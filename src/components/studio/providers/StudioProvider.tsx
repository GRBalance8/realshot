// src/components/studio/providers/StudioProvider.tsx
'use client'
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface StudioState {
  currentStep: number
  designSubstep: number
  uploadedFiles: {
    id: string
    url: string
    name: string
  }[]
  photoInstructions: {
    description: string
    referenceImage: string | null
    fileId: string | null
  }[]
  profile: {
    hobbies: string
    location: string
    style: string
    additionalInfo: string
  }
}

interface LoadingState {
  isLoading: boolean
  message: string
}

interface StudioContextType extends StudioState {
  setStep: (step: number) => void
  setDesignSubstep: (substep: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  goToNextDesignStep: () => void
  goToPreviousDesignStep: () => void
  updateUploadedFiles: (files: StudioState['uploadedFiles']) => void
  updatePhotoInstructions: (instructions: StudioState['photoInstructions']) => void
  updateProfile: (profile: Partial<StudioState['profile']>) => void
  loading: LoadingState
}

const INITIAL_STATE: StudioState = {
  currentStep: 0,
  designSubstep: 0,
  uploadedFiles: [],
  photoInstructions: Array(6).fill({
    description: '',
    referenceImage: null,
    fileId: null
  }),
  profile: {
    hobbies: '',
    location: '',
    style: '',
    additionalInfo: ''
  }
}

const StudioContext = createContext<StudioContextType | undefined>(undefined)

const STORAGE_KEY = 'studio_state'

export function StudioProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<StudioState>(INITIAL_STATE)
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    message: 'Retrieving your data...'
  })

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading({ isLoading: true, message: 'Retrieving your data...' })

        const savedState = localStorage.getItem(STORAGE_KEY)
        if (savedState) {
          try {
            const parsedState = JSON.parse(savedState)
            setState(parsedState)
          } catch (error) {
            console.error('Error parsing saved state:', error)
            localStorage.removeItem(STORAGE_KEY)
          }
        }

        const orderResponse = await fetch('/api/studio/order/pending')
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order')
        }
        const orderData = await orderResponse.json()

        const profileResponse = await fetch('/api/studio/profile')
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile')
        }
        const profileData = await profileResponse.json()

        setState(prev => ({
          ...prev,
          profile: {
            hobbies: profileData.hobbies || '',
            location: profileData.location || '',
            style: profileData.style || '',
            additionalInfo: profileData.additionalInfo || ''
          }
        }))

        if (orderData.order) {
          setState(prev => ({
            ...prev,
            uploadedFiles: orderData.order.uploadedPhotos || [],
            photoInstructions: orderData.order.photoRequests.length ? 
              orderData.order.photoRequests : 
              Array(6).fill({
                description: '',
                referenceImage: null,
                fileId: null
              })
          }))
        }

      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading({ isLoading: false, message: '' })
      }
    }

    loadAllData()
  }, [])

  useEffect(() => {
    if (!loading.isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, loading.isLoading])

  const setStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step, designSubstep: 0 }))
  }, [])

  const setDesignSubstep = useCallback((substep: number) => {
    setState(prev => ({ ...prev, designSubstep: substep }))
  }, [])

  const goToNextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3),
      designSubstep: 0
    }))
  }, [])

  const goToPreviousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      designSubstep: 0
    }))
  }, [])

  const goToNextDesignStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      designSubstep: Math.min(prev.designSubstep + 1, 1)
    }))
  }, [])

  const goToPreviousDesignStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      designSubstep: Math.max(prev.designSubstep - 1, 0)
    }))
  }, [])

  const updateUploadedFiles = useCallback((files: StudioState['uploadedFiles']) => {
    setState(prev => ({ ...prev, uploadedFiles: files }))
  }, [])

  const updatePhotoInstructions = useCallback((instructions: StudioState['photoInstructions']) => {
    setState(prev => ({ ...prev, photoInstructions: instructions }))
  }, [])

  const updateProfile = useCallback((profile: Partial<StudioState['profile']>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }))
  }, [])

  const value = {
    ...state,
    setStep,
    setDesignSubstep,
    goToNextStep,
    goToPreviousStep,
    goToNextDesignStep,
    goToPreviousDesignStep,
    updateUploadedFiles,
    updatePhotoInstructions,
    updateProfile,
    loading
  }

  if (loading.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-blue-900">{loading.message}</p>
      </div>
    )
  }

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  )
}

export const useStudio = () => {
  const context = useContext(StudioContext)
  if (context === undefined) {
    throw new Error('useStudio must be used within a StudioProvider')
  }
  return context
}
