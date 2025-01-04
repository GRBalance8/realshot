// src/components/studio/sections/UploadSection/index.tsx
import { useCallback } from 'react'
import { useStudio } from '../../providers/StudioProvider'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { ErrorMessage } from '../../components/ErrorMessage'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { UploadArea } from './components/UploadArea'
import { PhotoGrid } from './components/PhotoGrid'
import { useFileUpload } from './hooks/useFileUpload'

export function UploadSection() {
  const { goToNextStep } = useStudio()
  const { files, isLoading, error, uploadFiles, removeFile } = useFileUpload()

  const handleContinue = useCallback(() => {
    if (files.length >= 10) {
      goToNextStep()
    }
  }, [files.length, goToNextStep])

  return (
    <div className="studio-section">
      <div className="text-center mb-12">
        <h1 className="studio-heading">Upload Your Photos</h1>
        <p className="studio-subheading">
          Please upload 10-20 photos where your face is clearly visible.
          We'll use these to create your personalized AI model.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <UploadArea 
        onUpload={uploadFiles}
        disabled={isLoading || files.length >= 20}
      />

      <Card className="my-12">
        <div className="flex justify-between items-center mb-6 px-8 pt-8">
          <h2 className="font-serif text-3xl text-blue-900">Uploaded Photos</h2>
          <span className="text-gray-600 font-medium">
            {files.length} / 20 photos
          </span>
        </div>

        <div className="px-8 pb-8">
          {isLoading ? (
            <div className="text-center py-16 bg-white/50 rounded-2xl">
              <LoadingSpinner />
            </div>
          ) : (
            <PhotoGrid 
              files={files}
              onRemove={removeFile}
            />
          )}
        </div>
      </Card>

      <div className="flex flex-col items-center">
        <Button 
          onClick={handleContinue}
          disabled={files.length < 10}
        >
          Continue to Photo Requests
        </Button>

        {files.length < 10 && (
          <p className="mt-4 text-sm text-gray-500">
            Please upload at least 10 photos to continue
          </p>
        )}

        <p className="mt-6 text-gray-500">
          Questions?{' '}
          <a 
            href="mailto:support@realshot.ai" 
            className="text-blue-900 hover:text-accent transition-colors"
          >
            We're here to help!
          </a>
        </p>
      </div>
    </div>
  )
}
