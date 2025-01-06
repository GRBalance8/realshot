// src/components/studio/sections/UploadSection/components/PhotoGrid.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { UploadedFile } from '../types';

interface PhotoGridProps {
  files: UploadedFile[];
  onRemove: (fileId: string) => void;
}

export function PhotoGrid({ files = [], onRemove }: PhotoGridProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    Object.fromEntries(files.map(file => [file.id, true]))
  );
  
  const safeFiles = Array.isArray(files) ? files : [];

  if (safeFiles.length === 0) {
    return (
      <div className="text-center py-16 bg-white/50 rounded-2xl">
        <p className="text-gray-600 mb-2">No photos uploaded yet.</p>
        <p className="text-sm text-gray-500">Your uploaded photos will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {safeFiles.map(file => (
        <div key={file.id} className="relative aspect-square rounded-xl overflow-hidden group">
          {loadingStates[file.id] && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <div className="relative w-full h-full">
            <Image
              src={file.url}
              alt={file.name}
              width={400}
              height={400}
              className="object-cover transition-opacity duration-300"
              style={{ opacity: loadingStates[file.id] ? 0 : 1 }}
              onLoadingComplete={() => {
                setLoadingStates(prev => ({ ...prev, [file.id]: false }));
              }}
              unoptimized
            />
          </div>
          <button
            onClick={() => onRemove(file.id)}
            className="absolute top-2 right-2 bg-white/95 w-7 h-7 rounded-full flex items-center justify-center 
              shadow-sm hover:scale-110 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Remove photo"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#1A2B3B" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
