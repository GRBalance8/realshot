// src/components/studio/components/DesignSectionWrapper.tsx
'use client'
import { ReactNode } from 'react'
import { DesignStepIndicator } from './DesignStepIndicator'

interface DesignSectionWrapperProps {
  children: ReactNode
}

export function DesignSectionWrapper({ children }: DesignSectionWrapperProps) {
  return (
    <div className="design-section">
      <DesignStepIndicator />
      {children}
    </div>
  )
}
