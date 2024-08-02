import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface PhotoGalleryProps {
  images: string[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const { t } = useTranslation('common');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{t('photoGallery')}</h2>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative h-40 cursor-pointer" onClick={() => setSelectedImage(image)}>
            <Image src={image} alt={`Property image ${index + 1}`} layout="fill" objectFit="cover" />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative w-3/4 h-3/4">
            <Image src={selectedImage} alt="Selected property image" layout="fill" objectFit="contain" />
          </div>
        </div>
      )}
    </div>
  );
}
