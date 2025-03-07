// src/components/studio/components/ProgressNav.tsx
'use client'

import { useMemo } from 'react'
import { useStudio } from '../providers/StudioProvider'

interface Step {
  id: string
  label: string
  icon: React.ReactNode
}

const WelcomeIcon = (): React.ReactNode => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const UploadIcon = (): React.ReactNode => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
)

const DesignIcon = (): React.ReactNode => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const PaymentIcon = (): React.ReactNode => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

export function ProgressNav(): JSX.Element {
  const { currentStep, designSubstep } = useStudio()

  const steps: Step[] = useMemo(
    () => [
      { id: 'welcome', label: 'Welcome', icon: <WelcomeIcon /> },
      { id: 'upload', label: 'Upload', icon: <UploadIcon /> },
      { id: 'design', label: 'Design', icon: <DesignIcon /> },
      { id: 'payment', label: 'Payment', icon: <PaymentIcon /> }
    ],
    []
  )

  const calculateProgress = (): string => {
    switch (currentStep) {
      case 0:
        return '0%'
      case 1:
        return '33%'
      case 2:
        return designSubstep === 0 ? '66%' : '75%'
      case 3:
        return '100%'
      default:
        return '0%'
    }
  }

  const progressWidth = calculateProgress()

  return (
    <nav aria-label="Progress" className="relative flex justify-center items-center mb-16">
      <div className="relative flex justify-between w-full max-w-3xl px-8">
        <div className="absolute top-8 left-0 right-0 h-[2px] bg-gray-200" aria-hidden="true" />
        <div className="absolute top-8 left-0 h-[2px] bg-accent transition-all duration-300" style={{ width: progressWidth }} aria-hidden="true" />
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStep || (index === currentStep && currentStep === 2 && designSubstep === 1)
          const isActive = index === currentStep

          const stepClasses = `
            w-16 h-16 rounded-full flex items-center justify-center mb-3 
            transition-transform transition-shadow duration-300 shadow-md z-10
            ${isActive ? 'bg-blue-900 text-white scale-110 shadow-lg' : 
              isCompleted ? 'bg-accent text-white' : 'bg-white text-blue-900'}
          `

          const labelClasses = `
            text-sm font-medium tracking-wide transition-colors duration-300
            ${isActive ? 'text-blue-900' : isCompleted ? 'text-accent' : 'text-gray-400'}
          `

          return (
            <div key={step.id} className="flex flex-col items-center relative z-20">
              <div className={stepClasses} aria-current={isActive ? 'step' : undefined}>
                {step.icon}
              </div>
              <span className={labelClasses}>{step.label}</span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
