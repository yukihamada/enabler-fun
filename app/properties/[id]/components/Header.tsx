import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface MainVisualProps {
  images: string[];
}

export default function MainVisual({ images }: MainVisualProps) {
  return (
    <div className="relative h-96 mb-8">
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
      >
        {images.map((image, index) => (
          <div key={index}>
            <Image
              src={image}
              alt={`Property Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
