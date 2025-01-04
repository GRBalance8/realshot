// src/components/studio/sections/WelcomeSection/ExamplesSection.tsx
import { ExampleCard } from './ExampleCard'
import type { ExamplesDataType } from './types'

interface ExamplesSectionProps {
  title: string
  examples: ExamplesDataType['good'] | ExamplesDataType['bad']
  type: 'good' | 'bad'
}

export function ExamplesSection({ title, examples, type }: ExamplesSectionProps) {
  return (
    <div className="mb-20">
      <h2 className="font-serif text-3xl text-blue-900 mb-12 text-center tracking-wide">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {examples.map((example, index) => (
          <ExampleCard 
            key={index}
            example={example}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}
