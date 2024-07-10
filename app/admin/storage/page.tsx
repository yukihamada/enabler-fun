'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ref, listAll, uploadBytes, StorageReference, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Image from 'next/image'
import crypto from 'crypto'

interface FileItem {
  ref: StorageReference;
  url: string;
}

export default function AdminStorage() {
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    })
  }

  const listFiles = useCallback(async () => {
    try {
      const listRef = ref(storage, 'image');
      const res = await listAll(listRef);
      const fileItems = await Promise.all(res.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { ref: item, url };
      }));
      setFiles(fileItems);
    } catch (error) {
      console.error('ファイル一覧の取得に失敗しました:', error);
      if (error instanceof Error) {
        setError(`エラー: ${error.message}`);
      } else {
        setError('不明なエラーが発生しました');
      }
    }
  }, []);

  useEffect(() => {
    listFiles()
  }, [listFiles]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files)
    }
  }

  const hashFileName = (fileName: string): string => {
    const hash = crypto.createHash('md5').update(fileName).digest('hex')
    const extension = fileName.split('.').pop()
    return `${hash}.${extension}`
  }

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    const newUploadProgress: { [key: string]: number } = {}

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const hashedFileName = hashFileName(file.name)
      const storageRef = ref(storage, `image/${hashedFileName}`)
      newUploadProgress[hashedFileName] = 0
      setUploadProgress(prev => ({ ...prev, ...newUploadProgress }))

      try {
        await uploadBytes(storageRef, file)
        console.log(`ファイル "${file.name}" がアップロードされました`)
        newUploadProgress[hashedFileName] = 100
        setUploadProgress(prev => ({ ...prev, ...newUploadProgress }))
      } catch (error) {
        console.error(`ファイル "${file.name}" のアップロードに失敗しました:`, error)
        newUploadProgress[hashedFileName] = -1
        setUploadProgress(prev => ({ ...prev, ...newUploadProgress }))
      }
    }

    await listFiles()
    setUploading(false)
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <Header />
      <main className="admin-container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">ストレージ管理</h1>
        {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}
        
        <div 
          className={`border-2 border-dashed p-8 mb-8 rounded-lg transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
            accept="image/*"
            multiple
          />
          <p className="text-center text-gray-600">
            {uploading ? 'アップロード中...' : 'ここに複数のファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください'}
          </p>
        </div>

        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <div key={fileName} className="mb-2">
            <p>{fileName}: {progress === 100 ? '完了' : progress === -1 ? 'エラー' : `${progress}%`}</p>
          </div>
        ))}

        <h2 className="text-2xl font-bold mb-4 text-gray-800">アップロード済みファイル</h2>
        {files.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.ref.name} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={file.url}
                    alt={file.ref.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 truncate">{file.ref.name}</p>
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {copiedUrl === file.url ? 'コピー済み' : 'URLをコピー'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">ファイルがありません。</p>
        )}
      </main>
      <Footer />
    </>
  )
}