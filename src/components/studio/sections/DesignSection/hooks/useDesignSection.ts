// src/components/studio/sections/DesignSection/hooks/useDesignSection.ts
'use client'

import { useState, useCallback, useRef } from 'react'
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
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  const handleProfileUpdate = (profile: Partial<UserProfile>) => {
    updateProfile(profile)
  }

  const saveInstructionsToServer = useCallback(async (instructions: PhotoInstruction[]) => {
    const response = await fetch('/api/studio/photo-instructions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(instructions)
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to save instructions')
    }

    return response.json()
  }, [])

  const handlePhotoInstructionUpdate = (index: number, data: Partial<PhotoInstruction>) => {
    // First update local state
    const updatedInstructions = [...photoInstructions]
    updatedInstructions[index] = {
      ...updatedInstructions[index],
      ...data
    }
    updatePhotoInstructions(updatedInstructions)

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout to save to server
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveInstructionsToServer(updatedInstructions)
        setError(null)
      } catch (err) {
        console.error('Error saving instruction:', err)
        setError(err instanceof Error ? err.message : 'Failed to save instruction')
      }
    }, 1000) // Debounce for 1 second
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
      // Clear any pending debounced saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Validate that all descriptions are filled out
      const hasEmptyDescriptions = photoInstructions.some(instruction => 
        !instruction.description.trim()
      )

      if (hasEmptyDescriptions) {
        throw new Error('Please provide descriptions for all photos')
      }

      // Save to server
      await saveInstructionsToServer(photoInstructions)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save instructions')
      console.error('Error saving photo instructions:', err)
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
