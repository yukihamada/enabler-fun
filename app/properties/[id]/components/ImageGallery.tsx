import React from 'react';
import Image from 'next/image';
import { Typography, IconButton, TextField, Button } from '@mui/material';
import { MdCancel as CancelIcon } from 'react-icons/md';
import { useProperty } from '../contexts/PropertyContext';
import { Property } from '../types';

interface ImageGalleryProps {
  images: string[];
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isEditing, onInputChange }) => {
  const { property, updateProperty } = useProperty() ?? {};
  const [newImageUrl, setNewImageUrl] = React.useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim() !== '' && property && property.id && updateProperty) {
      updateProperty({
        ...property,
        id: property.id,
        imageUrls: [...property.imageUrls, newImageUrl.trim()]
      } as Property);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (property && property.id && updateProperty) {
      const updatedImages = [...property.imageUrls];
      updatedImages.splice(index, 1);
      updateProperty({
        ...property,
        id: property.id,
        imageUrls: updatedImages
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // ファイルアップロードの実装（Firebase Storage等を使用）
    // アップロード後、URLを取得してプロパティに追加
  };

  return (
    <div>
      {isEditing ? (
        <div className="mb-4">
          <Typography variant="subtitle1" className="mb-2">画像</Typography>
          {property?.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center mb-2">
              {url && (url.startsWith('http://') || url.startsWith('https://')) ? (
                <Image 
                  src={url}
                  alt={`画像 ${index + 1}`}
                  width={100}
                  height={100}
                  className="mr-2"
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center mr-2">
                  <Typography>無効なURL</Typography>
                </div>
              )}
              <IconButton onClick={() => handleRemoveImage(index)}>
                <CancelIcon />
              </IconButton>
            </div>
          ))}
          <div className="flex items-center mb-2">
            <TextField
              fullWidth
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="画像URLを入力"
              className="mr-2"
            />
            <Button onClick={handleAddImage} variant="contained">
              追加
            </Button>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mb-2"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {Array.isArray(property?.imageUrls) && property.imageUrls.length > 0 ? (
            property.imageUrls.map((url, index) => (
              url && (url.startsWith('http://') || url.startsWith('https://')) ? (
                <Image 
                  key={index}
                  src={url} 
                  alt={`画像 ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : (
                <div key={index} className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-lg shadow-lg">
                  <Typography>無効なURL</Typography>
                </div>
              )
            ))
          ) : (
            <Typography>画像がありません</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;