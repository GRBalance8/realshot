// src/components/studio/sections/UploadSection/components/UploadArea.tsx
// MODIFYING: Adding multiple file upload support
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { clsx } from 'clsx'

interface UploadAreaProps {
  onUpload: (files: File[]) => void
  disabled?: boolean
}

export function UploadArea({ onUpload, disabled }: UploadAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic']
    },
    disabled,
    maxSize: 10 * 1024 * 1024,
    multiple: true, // Enable multiple file selection
  })

  return (
    <div 
      {...getRootProps()} 
      className={clsx(
        'upload-area',
        isDragActive ? 'upload-area-dragging' : 'upload-area-idle',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} multiple /> {/* Add multiple attribute */}
      <div className="flex flex-col items-center">
        <svg 
          className="w-20 h-20 mb-6 transition-colors duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke={isDragActive ? '#F5A855' : '#1A2B3B'}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
          />
        </svg>
        <p className="text-xl font-medium text-blue-900 mb-3">
          Drop your photos here or click to browse
        </p>
        <p className="text-gray-600">
          Select multiple files • JPEG, PNG or HEIC • Max 10MB each
        </p>
      </div>
    </div>
  )
}
