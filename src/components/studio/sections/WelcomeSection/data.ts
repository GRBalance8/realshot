// src/components/studio/sections/WelcomeSection/data.ts
export const examplesData: ExamplesDataType = {
  good: [
    {
      title: "Clear Facial Features",
      description: "Good lighting and clear view of your face. Notice how the features are easily visible.",
      tips: [
        "Natural daylight is ideal",
        "Face should be clearly visible",
        "Avoid harsh shadows"
      ],
      image: "/images/examples/good-1.jpg"
    },
    {
      title: "Natural Expression",
      description: "Relaxed, genuine expression. Simple background and good framing.",
      tips: [
        "Genuine smile or neutral expression",
        "Clean, uncluttered background",
        "Comfortable, natural pose"
      ],
      image: "/images/examples/good-2.jpg"
    },
    {
      title: "Different Angles",
      description: "Profile and ¾ views help us create more dynamic photos.",
      tips: [
        "Mix of front and side views",
        "Include some candid angles",
        "Natural head positions"
      ],
      image: "/images/examples/good-3.jpg"
    }
  ],
  bad: [
    {
      title: "Too Dark / Harsh Lighting",
      description: "Poor lighting makes it harder to see facial details clearly.",
      tips: [
        "Avoid night or dim indoor shots",
        "Ensure face is well-lit",
        "Check for visible facial features"
      ],
      image: "/images/examples/bad-1.jpg"
    },
    {
      title: "Group Photos",
      description: "Group photos make it difficult to identify and focus on you.",
      tips: [
        "Avoid photos with multiple people",
        "Choose solo shots",
        "Crop if necessary"
      ],
      image: "/images/examples/bad-2.jpg"
    },
    {
      title: "Obstructed Face",
      description: "Objects or accessories blocking facial features reduce photo quality.",
      tips: [
        "Remove sunglasses or masks",
        "Keep face clearly visible",
        "Avoid objects blocking features"
      ],
      image: "/images/examples/bad-3.jpg"
    }
  ]
}
