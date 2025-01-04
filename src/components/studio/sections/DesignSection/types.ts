// src/components/studio/sections/DesignSection/types.ts
export interface UserProfile {
  hobbies: string;
  location: string;
  style: string;
  additionalInfo: string;
}

export interface PhotoInstruction {
  description: string;
  referenceImage: string | null;
  fileId: string | null;
}

export interface DesignSectionState {
  currentSubstep: number;
  profile: UserProfile;
  photoInstructions: PhotoInstruction[];
}
