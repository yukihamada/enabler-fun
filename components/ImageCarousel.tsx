import Image from 'next/image';
import { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={images[currentImageIndex]}
          alt={`Property Image ${currentImageIndex + 1}`}
          width={500} // 必要に応じて調整
          height={300} // 必要に応じて調整
          objectFit="cover"
          className="w-full"
        />
      </div>
      <button
        onClick={handlePrevImage}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full opacity-75 hover:opacity-100 transition duration-200"
      >
        {'<'}
      </button>
      <button
        onClick={handleNextImage}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full opacity-75 hover:opacity-100 transition duration-200"
      >
        {'>'}
      </button>
    </div>
  );
};

export default ImageCarousel;
