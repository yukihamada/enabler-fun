import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, IconButton, CircularProgress, Tooltip } from '@mui/material';
import { MdClose, MdArrowBack, MdArrowForward, MdZoomIn, MdZoomOut, MdFullscreen, MdFullscreenExit, MdPlayArrow, MdPause, MdShare } from 'react-icons/md';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';

interface ImageGalleryProps {
  images: Array<{ url: string; caption?: string }>;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (file: File) => Promise<void>;
  onImageDelete: (index: number) => void;
  onImagesReorder: (newImages: Array<{ url: string; caption?: string }>) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isEditing, onInputChange, onImageUpload, onImageDelete, onImagesReorder }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
    setZoom(1);
    setLoading(true);
  };

  const handleClose = () => {
    setOpen(false);
    setZoom(1);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setLoading(true);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setLoading(true);
  }, [images.length]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleNext, handlePrev]);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newImages = Array.from(images);
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

    onImagesReorder(newImages);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleSlideshow = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(handleNext, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  const shareImage = () => {
    if (navigator.share) {
      navigator.share({
        title: '物件画像',
        text: images[currentIndex].caption || '物件画像をご覧ください',
        url: images[currentIndex].url,
      }).catch(console.error);
    } else {
      alert('お使いのブラウザは共有機能に対応していません。');
    }
  };

  return (
    <div className="mb-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {images.map((image, index) => (
                <Draggable key={image.url} draggableId={image.url} index={index} isDragDisabled={!isEditing}>
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative overflow-hidden rounded-lg group"
                    >
                      <Image
                        src={image.url}
                        alt={`物件画像 ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover cursor-pointer rounded-lg transition-transform duration-300 group-hover:scale-105"
                        onClick={() => handleOpen(index)}
                      />
                      {isEditing && (
                        <button
                          onClick={() => onImageDelete(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {isEditing && (
                <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && onImageUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer text-blue-500 hover:text-blue-600">
                    画像を追加
                  </label>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <div className="relative" {...handlers}>
          <div className="flex flex-col h-[90vh]">
            <div className="flex-grow flex justify-center items-center">
              {loading && <CircularProgress />}
              <Image
                src={images[currentIndex].url}
                alt={`物件画像 ${currentIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 ease-in-out"
                style={{ transform: `scale(${zoom})` }}
                onLoadingComplete={() => setLoading(false)}
              />
            </div>
            {images[currentIndex].caption && (
              <div className="text-center p-4 bg-black bg-opacity-50 text-white">
                {images[currentIndex].caption}
              </div>
            )}
            <div className="flex justify-center p-2 bg-black bg-opacity-50">
              {images.map((image, index) => (
                <Image
                  key={image.url}
                  src={image.url}
                  alt={`サムネイル ${index + 1}`}
                  width={64}
                  height={64}
                  className={`w-16 h-16 object-cover m-1 cursor-pointer rounded ${index === currentIndex ? 'border-2 border-white' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
          <IconButton
            onClick={handleClose}
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
          >
            <MdClose />
          </IconButton>
          <IconButton
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
          >
            <MdArrowBack />
          </IconButton>
          <IconButton
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
          >
            <MdArrowForward />
          </IconButton>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            <Tooltip title="ズームイン">
              <IconButton onClick={handleZoomIn} className="text-white bg-black bg-opacity-50 hover:bg-opacity-75">
                <MdZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="ズームアウト">
              <IconButton onClick={handleZoomOut} className="text-white bg-black bg-opacity-50 hover:bg-opacity-75">
                <MdZoomOut />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "フルスクリーン解除" : "フルスクリーン"}>
              <IconButton onClick={toggleFullscreen} className="text-white bg-black bg-opacity-50 hover:bg-opacity-75">
                {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
              </IconButton>
            </Tooltip>
            <Tooltip title={isPlaying ? "一時停止" : "スライドショー再生"}>
              <IconButton onClick={toggleSlideshow} className="text-white bg-black bg-opacity-50 hover:bg-opacity-75">
                {isPlaying ? <MdPause /> : <MdPlayArrow />}
              </IconButton>
            </Tooltip>
            <Tooltip title="共有">
              <IconButton onClick={shareImage} className="text-white bg-black bg-opacity-50 hover:bg-opacity-75">
                <MdShare />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ImageGallery;