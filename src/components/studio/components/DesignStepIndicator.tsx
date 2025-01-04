// src/components/studio/components/DesignStepIndicator.tsx
'use client'
import { useStudio } from '../providers/StudioProvider'

const designSteps = [
  {
    label: 'Profile',
    description: 'Tell us about yourself'
  },
  {
    label: 'Photo Design',
    description: 'Design your photos'
  }
]

export function DesignStepIndicator() {
  const { designSubstep } = useStudio()

  return (
    <div className="mb-12">
      <div className="flex justify-center space-x-16">
        {designSteps.map((step, index) => (
          <div 
            key={step.label} 
            className={`flex flex-col items-center ${
              index === designSubstep 
                ? 'text-blue-900'
                : index < designSubstep
                  ? 'text-accent'
                  : 'text-gray-400'
            }`}
          >
            <div className="flex items-center mb-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  transition-all duration-300 ${
                    index === designSubstep 
                      ? 'bg-blue-900 text-white' 
                      : index < designSubstep
                        ? 'bg-accent text-white'
                        : 'bg-gray-100'
                  }`}
              >
                {index + 1}
              </div>
            </div>
            <div className="text-center">
              <div className="font-medium">{step.label}</div>
              <div className="text-sm opacity-75">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
