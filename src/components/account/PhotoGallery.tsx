// src/components/account/PhotoGallery.tsx
'use client';

import { FC, useState, useCallback, useEffect, KeyboardEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Photo } from '@/types/orders';

interface PhotoGalleryProps {
  photos: Photo[];
}

export const PhotoGallery: FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    Object.fromEntries(photos.map(photo => [photo.id, true]))
  );

  const handleImageError = useCallback((photoId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [photoId]: true }));
    setLoadingImages(prev => ({ ...prev, [photoId]: false }));
  }, []);

  const handleImageLoad = useCallback((photoId: string) => {
    setLoadingImages(prev => ({ ...prev, [photoId]: false }));
  }, []);

  const handleDownload = useCallback(async (photo: Photo) => {
    if (downloading[photo.id]) return;

    setDownloading(prev => ({ ...prev, [photo.id]: true }));
    try {
      const response = await fetch(photo.url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Format date for filename
      const dateStr = photo.createdAt instanceof Date 
        ? photo.createdAt.toISOString().split('T')[0]
        : new Date(photo.createdAt).toISOString().split('T')[0];
      
      link.href = url;
      link.download = `realshot-photo-${dateStr}-${photo.id}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(prev => ({ ...prev, [photo.id]: false }));
    }
  }, [downloading]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (selectedPhoto) {
        if (e.key === 'Escape') {
          setSelectedPhoto(null);
        } else if (e.key === 'd' || e.key === 'D') {
          handleDownload(selectedPhoto);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, handleDownload]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative group"
          >
            {loadingImages[photo.id] && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            <Image
              src={photo.url}
              alt={`Generated photo from ${new Date(photo.createdAt).toLocaleDateString()}`}
              width={400}
              height={400}
              className={cn(
                "object-cover w-full h-full transition-transform duration-300",
                loadingImages[photo.id] ? "opacity-0" : "opacity-100",
                "group-hover:scale-105"
              )}
              onError={() => handleImageError(photo.id)}
              onLoadingComplete={() => handleImageLoad(photo.id)}
              quality={75}
              unoptimized
            />

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                onClick={() => setSelectedPhoto(photo)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="View full size"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={() => handleDownload(photo)}
                disabled={downloading[photo.id]}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                title="Download photo"
              >
                {downloading[photo.id] ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full p-4">
            <Image
              src={selectedPhoto.url}
              alt={`Full view from ${new Date(selectedPhoto.createdAt).toLocaleDateString()}`}
              width={1200}
              height={1200}
              className="object-contain w-full h-full"
              quality={100}
              priority
              unoptimized
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedPhoto);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Download photo (D)"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button 
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(null);
                }}
                title="Close (Esc)"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
