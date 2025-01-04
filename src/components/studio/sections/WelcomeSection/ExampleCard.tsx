// src/components/studio/sections/WelcomeSection/ExampleCard.tsx
import Image from 'next/image'
import { Card } from '@/components/studio/components/Card'
import type { ExampleType } from './types'

interface ExampleCardProps {
  example: ExampleType
  type: 'good' | 'bad'
}

export function ExampleCard({ example, type }: ExampleCardProps) {
  return (
    <Card>
      <div className="aspect-w-4 aspect-h-5 relative">
        <img 
          src="/api/placeholder/400/500"
          alt={example.title}
          className="object-cover w-full h-full rounded-t-2xl"
        />
      </div>
      <div className="p-8">
        <h3 className="font-serif text-2xl text-blue-900 mb-3">{example.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{example.description}</p>
        <ul className="space-y-3">
          {example.tips.map((tip, index) => (
            <li key={index} className="flex items-start text-gray-500">
              <span className={`mr-2 ${type === 'good' ? 'text-accent' : 'text-red-500'}`}>•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
