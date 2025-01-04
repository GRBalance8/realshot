// src/components/studio/sections/DesignSection/hooks/useDesignSection.ts
'use client'
import { useState } from 'react'
import { useStudio } from '../../../providers/StudioProvider'
import { UserProfile, PhotoInstruction } from '../types'

export function useDesignSection() {
  const { 
    profile, 
    photoInstructions, 
    updateProfile, 
    updatePhotoInstructions,
    designSubstep,
    goToNextDesignStep
  } = useStudio()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(new Set())

  const handleProfileUpdate = (profile: Partial<UserProfile>) => {
    updateProfile(profile)
  }

  const handlePhotoInstructionUpdate = (index: number, data: Partial<PhotoInstruction>) => {
    const updatedInstructions = [...photoInstructions]
    updatedInstructions[index] = {
      ...updatedInstructions[index],
      ...data
    }
    updatePhotoInstructions(updatedInstructions)
  }

  const setUploadingState = (index: number, isUploading: boolean) => {
    setUploadingIndexes(prev => {
      const next = new Set(prev)
      if (isUploading) {
        next.add(index)
      } else {
        next.delete(index)
      }
      return next
    })
  }

  const saveProfile = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/studio/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save profile')
      }
      
      goToNextDesignStep()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const savePhotoInstructions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/studio/photo-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoInstructions)
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save instructions')
      }
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save instructions')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    state: {
      currentSubstep: designSubstep,
      profile,
      photoInstructions,
    },
    isLoading,
    error,
    updateProfile: handleProfileUpdate,
    updatePhotoInstruction: handlePhotoInstructionUpdate,
    saveProfile,
    savePhotoInstructions,
    isUploading: (index: number) => uploadingIndexes.has(index),
    setUploadingState
  }
}
