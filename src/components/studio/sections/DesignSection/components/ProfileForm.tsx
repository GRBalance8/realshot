// src/components/studio/sections/DesignSection/components/ProfileForm.tsx
import { Card } from '@/components/studio/components/Card';
import { Button } from '@/components/studio/components/Button';
import { TextArea } from '@/components/studio/components/TextArea';
import { Input } from '@/components/studio/components/Input';
import type { UserProfile } from '../types';

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (profile: Partial<UserProfile>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ProfileForm({ profile, onChange, onSubmit, isLoading }: ProfileFormProps) {
  return (
    <div>
      <Card className="mb-12">
        <div className="p-10">
          <h2 className="font-serif text-3xl text-blue-900 mb-8">Tell Us About Yourself</h2>
          <p className="text-gray-600 mb-10">
            The more you share, the better we can personalize your photos. All fields are optional.
          </p>
          <div className="space-y-8">
            <TextArea
              label="What are your hobbies and interests?"
              value={profile.hobbies}
              onChange={e => onChange({ hobbies: e.target.value })}
              placeholder="E.g., hiking, photography, cooking..."
              rows={3}
            />
            
            <Input
              label="Where are you located?"
              value={profile.location}
              onChange={e => onChange({ location: e.target.value })}
              placeholder="City, Country"
            />
            
            <TextArea
              label="How would you describe your style?"
              value={profile.style}
              onChange={e => onChange({ style: e.target.value })}
              placeholder="E.g., casual and comfortable, business professional..."
              rows={3}
            />
            
            <TextArea
              label="Anything else you'd like us to know?"
              value={profile.additionalInfo}
              onChange={e => onChange({ additionalInfo: e.target.value })}
              placeholder="Any specific preferences or ideas for your photos..."
              rows={3}
            />
          </div>
        </div>
      </Card>
      <div className="flex justify-center">
        <Button onClick={onSubmit} loading={isLoading}>
          Continue to Photo Design
        </Button>
      </div>
    </div>
  );
}
