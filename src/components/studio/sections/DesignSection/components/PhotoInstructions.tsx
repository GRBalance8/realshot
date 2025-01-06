// src/components/studio/sections/DesignSection/components/PhotoInstructions.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/studio/components/Card';
import { Button } from '@/components/studio/components/Button';
import { TextArea } from '@/components/studio/components/TextArea';
import { ErrorMessage } from '@/components/studio/components/ErrorMessage';
import { LoadingSpinner } from '@/components/studio/components/LoadingSpinner';
import type { PhotoInstruction } from '../types';

const successExamples = [
  {
    title: 'The Natural Smile',
    description: 'Authentic expression and relaxed pose resulted in 3x more matches.',
    stats: '280% increase in profile visits'
  },
  {
    title: 'The Hobby Shot',
    description: 'Showcasing genuine interests through activity photos leads to more meaningful conversations.',
    stats: '175% more first messages'
  },
  {
    title: 'The City Explorer',
    description: 'Urban setting with great lighting creates an aspirational yet approachable vibe.',
    stats: '220% higher response rate'
  }
];

interface PhotoInstructionsProps {
  instructions: PhotoInstruction[];
  onChange: (index: number, data: Partial<PhotoInstruction>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isUploading: (index: number) => boolean;
  setUploadingState: (index: number, isUploading: boolean) => void;
}

export function PhotoInstructions({ 
  instructions, 
  onChange, 
  onSubmit, 
  isLoading,
  isUploading,
  setUploadingState
}: PhotoInstructionsProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, { loading: boolean; error: boolean }>>({});

  const handleImageLoadingComplete = (id: string) => {
    setImageLoadStates(prev => ({
      ...prev,
      [id]: { ...prev[id], loading: false }
    }));
  };

  const handleImageError = (id: string) => {
    setImageLoadStates(prev => ({
      ...prev,
      [id]: { loading: false, error: true }
    }));
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadError('File size should be less than 10MB');
      return;
    }

    setUploadError(null);
    setUploadingState(index, true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'reference');

      const response = await fetch('/api/studio/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(index, {
        referenceImage: data.url,
        fileId: data.id
      });

      // Initialize loading state for new image
      setImageLoadStates(prev => ({
        ...prev,
        [data.id]: { loading: true, error: false }
      }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
      onChange(index, { referenceImage: null, fileId: null });
    } finally {
      setUploadingState(index, false);
    }
  };

  const handleDeleteFile = async (index: number) => {
    setUploadError(null);
    setUploadingState(index, true);

    try {
      if (instructions[index].fileId) {
        const response = await fetch(`/api/studio/upload/${instructions[index].fileId}?type=reference`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete file');
        }
      }

      onChange(index, { referenceImage: null, fileId: null });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setUploadingState(index, false);
    }
  };

  return (
    <div>
      <div className="mb-16">
        <h2 className="studio-heading text-center">Photos that perform exceptionally well</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {successExamples.map((example, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative w-full h-64">
                <Image
                  src="/api/placeholder/400/320"
                  alt={example.title}
                  width={400}
                  height={320}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-blue-900 mb-3">{example.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{example.description}</p>
                <div className="text-accent font-medium">{example.stats}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="studio-heading">Design Your Photos</h2>
        <p className="studio-subheading">
          Describe what you&apos;d like for each photo. Feel free to be as detailed as you want.
          Add reference photos if you have specific ideas in mind.
        </p>
      </div>

      {uploadError && <ErrorMessage message={uploadError} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {instructions.map((instruction, index) => (
          <Card key={index} className="p-8">
            <TextArea
              label="Description"
              value={instruction.description}
              onChange={e => onChange(index, { description: e.target.value })}
              placeholder="Describe what you&apos;d like for this photo..."
              rows={4}
              required
            />

            <div className="mt-6">
              <p className="form-label">Reference Photo (Optional)</p>
              {isUploading(index) ? (
                <div className="flex justify-center items-center h-48 bg-gray-50 rounded-xl">
                  <LoadingSpinner />
                </div>
              ) : instruction.referenceImage ? (
                <div className="relative h-48 group">
                  <div className="relative w-full h-full">
                    {imageLoadStates[instruction.fileId || '']?.loading && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
                    )}
                    <Image
                      src={instruction.referenceImage}
                      alt="Reference photo"
                      width={400}
                      height={192}
                      className="rounded-xl object-cover w-full h-full transition-opacity duration-300"
                      style={{ 
                        opacity: imageLoadStates[instruction.fileId || '']?.loading ? 0 : 1 
                      }}
                      onLoadingComplete={() => handleImageLoadingComplete(instruction.fileId || '')}
                      onError={() => handleImageError(instruction.fileId || '')}
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity 
                    flex items-center justify-center gap-4">
                    <button
                      onClick={() => setSelectedImage(instruction.referenceImage)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Preview image"
                    >
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteFile(index)}
                      className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                      aria-label="Delete image"
                    >
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-xl border-2 
                  border-dashed border-gray-300">
                  <input
                    type="file"
                    id={`file-input-${index}`}
                    className="hidden"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(index, file);
                    }}
                  />
                  <label
                    htmlFor={`file-input-${index}`}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-900">Choose a file</span>
                    <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
                  </label>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onSubmit} 
          loading={isLoading}
          disabled={!instructions.every(instruction => instruction.description.trim())}
        >
          Continue to Payment
        </Button>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full p-4">
            <Image
              src={selectedImage}
              alt="Reference photo preview"
              width={800}
              height={600}
              className="object-contain w-full h-full"
              unoptimized
              priority
            />
            <button 
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close preview"
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
