import { useState } from 'react';
import { StadiumImage } from './StadiumImagesManager';

interface StadiumGalleryProps {
  images: StadiumImage[];
  principalImageId?: string;
  stadiumName: string;
}

export function StadiumGallery({
  images,
  principalImageId,
  stadiumName,
}: StadiumGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video">
        <img
          src={currentImage.url}
          alt={`${stadiumName} - Image ${selectedIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {currentImage.id === principalImageId && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
            ★ Principal
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedIndex
                  ? 'border-emerald-500'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {image.id === principalImageId && (
                <div className="absolute top-0.5 right-0.5 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  ★
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
