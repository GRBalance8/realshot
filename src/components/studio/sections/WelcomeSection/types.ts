// src/components/studio/sections/WelcomeSection/types.ts
export interface ExampleType {
  title: string
  description: string
  tips: string[]
  image: string
}

export interface ExamplesDataType {
  good: ExampleType[]
  bad: ExampleType[]
}
