// src/components/studio/sections/DesignSection/components/PhotoInstructions.tsx
import { useState } from 'react';
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

  const handleFileUpload = async (index: number, file: File) => {
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
              <img
                src={`/api/placeholder/400/320`}
                alt={example.title}
                className="w-full h-64 object-cover"
              />
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
          Describe what you'd like for each photo. Feel free to be as detailed as you want.
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
              placeholder="Describe what you'd like for this photo..."
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
                <div className="relative">
                  <img
                    src={instruction.referenceImage}
                    alt="Reference"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="absolute top-3 right-3 bg-white/95 w-7 h-7 rounded-full flex items-center 
                      justify-center shadow-sm hover:scale-110 hover:shadow-md transition-all"
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
              ) : (
                <div>
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
                    className="inline-flex items-center justify-center bg-blue-900 text-white 
                      py-2 px-4 rounded-full text-sm font-medium tracking-wide transition-all 
                      duration-300 hover:bg-accent hover:-translate-y-1 hover:shadow-lg 
                      active:translate-y-0 cursor-pointer"
                  >
                    Choose File
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
    </div>
  );
}
