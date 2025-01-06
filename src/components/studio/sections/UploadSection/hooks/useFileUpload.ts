// src/components/studio/sections/UploadSection/hooks/useFileUpload.ts
import { useState, useCallback, useEffect } from 'react'
import type { UploadedFile } from '../types'
import { uploadFile, deleteFile } from '@/lib/api/uploadApi'

interface PendingOrderResponse {
  order?: {
    uploadedPhotos: Array<{
      id: string
      url: string
    }>
  }
}

interface FileUploadHook {
  files: UploadedFile[]
  isLoading: boolean
  error: string | null
  uploadFiles: (newFiles: File[]) => Promise<void>
  removeFile: (fileId: string) => Promise<void>
}

export function useFileUpload(): FileUploadHook {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFiles = useCallback(async (newFiles: File[]): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const uploadPromises = newFiles.map(async (file) => {
        const response = await uploadFile(file, (progress) => {
          console.log(`Upload progress for ${file.name}: ${progress}%`)
        })
        
        return {
          id: response.id,
          url: response.url,
          name: response.name || file.name
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      setFiles(prevFiles => [...prevFiles, ...uploadedFiles])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files')
      console.error('Upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      await deleteFile(fileId)
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file')
      console.error('Delete error:', err)
    }
  }, [])

  useEffect(() => {
    const loadExistingFiles = async (): Promise<void> => {
      try {
        const response = await fetch('/api/studio/order/pending')
        if (!response.ok) throw new Error('Failed to fetch existing files')
        
        const data = await response.json() as PendingOrderResponse
        if (data.order?.uploadedPhotos) {
          setFiles(data.order.uploadedPhotos.map(photo => ({
            id: photo.id,
            url: photo.url,
            name: photo.url.split('/').pop() || 'Untitled'
          })))
        }
      } catch (err) {
        console.error('Failed to load existing files:', err)
      }
    }

    loadExistingFiles()
  }, [])

  return {
    files,
    isLoading,
    error,
    uploadFiles,
    removeFile
  }
}
