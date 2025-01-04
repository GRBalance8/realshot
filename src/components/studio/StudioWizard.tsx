// src/components/studio/StudioWizard.tsx
'use client'
import { useStudio } from './providers/StudioProvider'
import { WelcomeSection } from './sections/WelcomeSection'
import { UploadSection } from './sections/UploadSection'
import { DesignSection } from './sections/DesignSection'
import { PaymentSection } from './sections/PaymentSection'
import { ProgressNav } from './components/ProgressNav'
import { NavigationButtons } from './components/NavigationButtons'

export function StudioWizard() {
  const { currentStep } = useStudio()

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeSection />
      case 1:
        return <UploadSection />
      case 2:
        return <DesignSection />
      case 3:
        return <PaymentSection />
      default:
        return <WelcomeSection />
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <ProgressNav />
      {renderStep()}
      <NavigationButtons />
    </div>
  )
}
