// src/components/studio/sections/WelcomeSection/index.tsx
import { useStudio } from '../../providers/StudioProvider'
import { Button } from '../../components/Button'
import { ExamplesSection } from './ExamplesSection'
import { examplesData } from './data'

export function WelcomeSection() {
  const { goToNextStep } = useStudio()

  return (
    <div className="studio-section">
      <div className="text-center mb-16">
        <h1 className="studio-heading">
          Experience Dating Apps Like <span className="text-accent">The Top 5%</span>
        </h1>
        <p className="studio-subheading">
          The perfect photos are probably already in your camera roll. Here's what works 
          especially well, but don't worry if your photos aren't exactly like the examples.
        </p>
      </div>

      <ExamplesSection 
        title="Examples of Great Reference Photos"
        examples={examplesData.good}
        type="good"
      />

      <ExamplesSection 
        title="Photos That Are Harder to Work With"
        examples={examplesData.bad}
        type="bad"
      />

      <div className="flex flex-col items-center space-y-6">
        <Button onClick={goToNextStep}>
          Continue to Photo Upload
        </Button>

        <p className="mt-6 text-gray-500">
          Questions?{' '}
          <a 
            href="mailto:support@realshot.ai" 
            className="text-blue-900 hover:text-accent transition-colors"
          >
            We're here to help!
          </a>
        </p>
      </div>
    </div>
  )
}
