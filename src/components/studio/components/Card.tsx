// src/components/studio/components/Card.tsx
import { clsx } from 'clsx'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={clsx('bg-white rounded-2xl shadow-card transition-smooth hover:shadow-card-hover p-8', className)}>
      {children}
    </div>
  )
}
