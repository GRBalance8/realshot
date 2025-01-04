// src/components/studio/sections/DesignSection/index.tsx
'use client'
import { useStudio } from '../../providers/StudioProvider'
import { ErrorMessage } from '../../components/ErrorMessage'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { DesignSectionWrapper } from '../../components/DesignSectionWrapper'
import { ProfileForm } from './components/ProfileForm'
import { PhotoInstructions } from './components/PhotoInstructions'
import { useDesignSection } from './hooks/useDesignSection'

export function DesignSection() {
  const { goToNextStep } = useStudio()
  const { 
    state, 
    isLoading, 
    error, 
    updateProfile, 
    updatePhotoInstruction,
    saveProfile,
    savePhotoInstructions,
    isUploading,
    setUploadingState
  } = useDesignSection()

  const handleSaveProfile = async () => {
    try {
      await saveProfile()
    } catch (err) {
      // Error handled by hook
    }
  }

  const handleContinue = async () => {
    try {
      const success = await savePhotoInstructions()
      if (success) {
        goToNextStep()
      }
    } catch (err) {
      // Error handled by hook
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <DesignSectionWrapper>
      {error && <ErrorMessage message={error} />}
      
      {state.currentSubstep === 0 ? (
        <ProfileForm
          profile={state.profile}
          onChange={updateProfile}
          onSubmit={handleSaveProfile}
          isLoading={isLoading}
        />
      ) : (
        <PhotoInstructions
          instructions={state.photoInstructions}
          onChange={updatePhotoInstruction}
          onSubmit={handleContinue}
          isLoading={isLoading}
          isUploading={isUploading}
          setUploadingState={setUploadingState}
        />
      )}
    </DesignSectionWrapper>
  )
}
