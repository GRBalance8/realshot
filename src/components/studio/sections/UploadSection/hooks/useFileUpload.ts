// src/components/studio/sections/UploadSection/hooks/useFileUpload.ts
import { useState, useCallback, useEffect } from 'react';
import { UploadedFile } from '../types';
import { uploadFile, deleteFile } from '@/lib/api/uploadApi';

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (newFiles: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const uploadPromises = newFiles.map(async (file) => {
        const response = await uploadFile(file, (progress) => {
          // Progress tracking is available but not used in current UI
          // Could be added to state if needed
          console.log(`Upload progress for ${file.name}: ${progress}%`);
        });
        return {
          id: response.id,
          url: response.url,
          name: file.name
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFile = useCallback(async (fileId: string) => {
    try {
      await deleteFile(fileId);
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
      console.error('Delete error:', err);
    }
  }, []);

  // Load existing files for the current order if any
  useEffect(() => {
    const loadExistingFiles = async () => {
      try {
        // Note: You might want to pass the orderId as a parameter to the hook
        // if you need to load existing files for a specific order
        const response = await fetch('/api/studio/order/pending');
        if (!response.ok) throw new Error('Failed to fetch existing files');
        const data = await response.json();
        if (data.order?.uploadedPhotos) {
          setFiles(data.order.uploadedPhotos.map((photo: any) => ({
            id: photo.id,
            url: photo.url,
            name: photo.url.split('/').pop() || 'Untitled'
          })));
        }
      } catch (err) {
        console.error('Failed to load existing files:', err);
        // Don't set error state here as it's not critical
      }
    };

    loadExistingFiles();
  }, []);

  return {
    files,
    isLoading,
    error,
    uploadFiles,
    removeFile
  };
}
