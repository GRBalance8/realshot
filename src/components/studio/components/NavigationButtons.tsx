// src/components/studio/components/NavigationButtons.tsx
'use client'
import { useStudio } from '../providers/StudioProvider'
import { Button } from './Button'

export function NavigationButtons() {
  const { 
    currentStep, 
    designSubstep,
    goToPreviousStep,
    goToPreviousDesignStep
  } = useStudio()
  
  if (currentStep === 0) return null

  const handleBack = () => {
    if (currentStep === 2 && designSubstep > 0) {
      goToPreviousDesignStep()
    } else {
      goToPreviousStep()
    }
  }

  return (
    <div className="flex justify-center space-x-4 mt-8">
      <Button
        onClick={handleBack}
        variant="primary"
      >
        ← Back
      </Button>
    </div>
  )
}
