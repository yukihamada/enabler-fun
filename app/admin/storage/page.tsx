"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { storage, db } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { useDropzone } from 'react-dropzone';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import '../admin.css';
import crypto from 'crypto';
import { FaRegCopy, FaTrashAlt, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';

const StoragePage = () => {
  const [fileList, setFileList] = useState<{ name: string; url: string; size: number; createdAt: Date }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const generateHashedFileName = (originalName: string) => {
    const timestamp = Date.now().toString();
    const hash = crypto.createHash('md5').update(timestamp).digest('hex');
    const extension = originalName.split('.').pop();
    return `${hash}.${extension}`;
  };

  const listFiles = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const storageRef = ref(storage, 'uploads');
      const result = await listAll(storageRef);
      const filesQuery = query(collection(db, 'files'));
      const filesSnapshot = await getDocs(filesQuery);
      const filesData = filesSnapshot.docs.reduce<Record<string, { createdAt: Date; size: number }>>((acc, doc) => {
        const data = doc.data();
        acc[data.hashedName] = { createdAt: data.createdAt.toDate(), size: data.size };
        return acc;
      }, {});

      const files = await Promise.all(
        result.items.map(async (item) => ({
          name: item.name,
          url: await getDownloadURL(item),
          size: filesData[item.name]?.size || 0,
          createdAt: filesData[item.name]?.createdAt || new Date()
        }))
      );
      setFileList(files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (err) {
      console.error("ファイルリストの取���中にエラーが発生しました:", err);
      setError("ファイルリストの取得に失敗しました。権限を確認してください。");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);
    setUploadComplete(false);
    const newFiles: { name: string; url: string }[] = [];

    for (const file of acceptedFiles) {
      try {
        const hashedFileName = generateHashedFileName(file.name);
        const storageRef = ref(storage, `uploads/${hashedFileName}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'files'), {
          originalName: file.name,
          hashedName: hashedFileName,
          url: downloadURL,
          createdAt: new Date(),
          size: file.size
        });

        newFiles.push({ name: hashedFileName, url: downloadURL });
      } catch (err) {
        console.error("ファイルのアップロード中にエラーが発生しました:", err);
        setError(`${file.name}のアップロードに失敗しました。`);
      }
    }
    
    setUploading(false);
    setUploadComplete(true);
    console.log('アップロード完了');
    await listFiles(); // アップロード後にリストを更新

    setTimeout(() => {
      setUploadComplete(false);
    }, 3000);
  }, [listFiles]);

  const deleteFile = async (file: { name: string; url: string }) => {
    if (window.confirm(`${file.name}を削除してもよろしいですか？`)) {
      try {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await deleteObject(storageRef);

        const q = query(collection(db, 'files'), where('hashedName', '==', file.name));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        await listFiles(); // 削除後にリストを更新
        setSelectedFile(null);
      } catch (err) {
        console.error("ファイルの削除中にエラーが発生しした:", err);
        setError("ファイルの削除に失敗しました。権限を確認してください。");
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const copyToClipboard = (text: string) => {
    if (isBrowser && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('URLをクリップボードにコピーしました');
      }, (err) => {
        console.error('URLのコピーに失敗しました:', err);
      });
    } else {
      console.error('クリップボード機能が利用できません');
    }
  };

  const uploadFromUrl = async () => {
    if (!urlInput) {
      setError('URLを入力してください。');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadComplete(false);

    try {
      const response = await axios.get(urlInput, { responseType: 'blob' });
      const file = new File([response.data], 'url-file', { type: response.data.type });
      const hashedFileName = generateHashedFileName(file.name);
      const storageRef = ref(storage, `uploads/${hashedFileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'files'), {
        originalName: file.name,
        hashedName: hashedFileName,
        url: downloadURL,
        createdAt: new Date(),
        size: file.size
      });

      setUploading(false);
      setUploadComplete(true);
      setUrlInput('');
      await listFiles();

      setTimeout(() => {
        setUploadComplete(false);
      }, 3000);
    } catch (err) {
      console.error("URLからのアップロード中にエラーが発生しました:", err);
      setError('URLからのファイルアップロードに失敗しました。');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    console.log('初期リスト取得');
    listFiles();
  }, [listFiles]);

  const handleRefresh = () => {
    listFiles();
  };

  const FileListItem = ({ file }: { file: { name: string; url: string; size: number; createdAt: Date } }) => {
    const isImage = file.name.match(/\.(jpeg|jpg|gif|png)$/i);

    return (
      <li className="mb-2 flex items-center">
        {isImage && (
          <Image
            src={file.url}
            alt={file.name}
            width={200}
            height={200}
            style={{ objectFit: 'cover' }}
            className="mr-2 rounded"
          />
        )}
        <div className="flex-grow">
          <button
            onClick={() => setSelectedFile(file)}
            className="text-blue-500 hover:underline cursor-pointer text-left bg-gray-100 px-2 py-1 rounded"
          >
            {file.name}
          </button>
          <div className="text-sm text-gray-500">
            {formatFileSize(file.size)} • {formatDistanceToNow(file.createdAt, { addSuffix: true, locale: ja })}
          </div>
        </div>
        {isBrowser && (
          <button
            onClick={() => copyToClipboard(file.url)}
            className="ml-2 text-gray-500 hover:text-gray-700"
            title="URLをコピー"
          >
            <FaRegCopy />
          </button>
        )}
        <button
          onClick={() => deleteFile(file)}
          className="ml-2 text-red-500 hover:text-red-700"
          title="ファイルを削除"
        >
          <FaTrashAlt />
        </button>
      </li>
    );
  };

  const FilePreview = ({ file }: { file: { name: string; url: string } }) => {
    const isImage = file.name.match(/\.(jpeg|jpg|gif|png)$/i);
    const isPDF = file.name.toLowerCase().endsWith('.pdf');
    const isVideo = file.name.match(/\.(mp4|webm|ogg)$/i);
    const isAudio = file.name.match(/\.(mp3|wav|ogg)$/i);

    return (
      <div className="mb-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            copyToClipboard(file.url);
          }}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          {file.name}
        </a>
        {isImage && (
          <Image
            src={file.url}
            alt={file.name}
            width={200}
            height={200}
            style={{ objectFit: 'cover' }}
            className="mt-1 max-w-xs max-h-32"
          />
        )}
        {isPDF && (
          <embed src={file.url} type="application/pdf" width="100%" height="200px" className="mt-1" />
        )}
        {isVideo && (
          <video src={file.url} controls className="mt-1 max-w-xs max-h-32" />
        )}
        {isAudio && (
          <audio src={file.url} controls className="mt-1" />
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="admin-container max-w-full px-4">
        <h1 className="text-2xl font-bold mb-4">ストレージ管理</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div {...getRootProps()} className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded">
          <input {...getInputProps()} multiple />
          {isDragActive ? (
            <p>ファイルをここにドロップ...</p>
          ) : (
            <p>ファイルをドラッグ&ドロップするか、クリックして選択してください（複数可）</p>
          )}
        </div>
        {uploadComplete && (
          <p className="text-green-500 mb-4">アップロードが了しまし！</p>
        )}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">アップロードされたファイル:</h2>
            <button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              disabled={isRefreshing}
            >
              <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              更新
            </button>
          </div>
          {isRefreshing && (
            <div className="mb-2">
              <Loader size="small" />
            </div>
          )}
          <ul className="max-h-96 overflow-y-auto">
            {fileList.map((file, index) => (
              <FileListItem key={index} file={file} />
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">URLからアップロード:</h2>
          <div className="flex">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/file.jpg"
              className="flex-grow border border-gray-300 rounded-l px-4 py-2"
            />
            <button
              onClick={uploadFromUrl}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
              disabled={uploading}
            >
              アップロード
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StoragePage;