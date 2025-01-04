// src/app/studio/layout.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { StudioProvider } from '@/components/studio/providers/StudioProvider';
import { LoadingSpinner } from '@/components/studio/components/LoadingSpinner';

export const metadata: Metadata = {
  title: 'RealShot Studio',
  description: 'Transform your dating profile photos with AI',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StudioProvider>
      <main className="min-h-screen bg-pattern">
        <div className="relative z-10">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner />
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </main>
    </StudioProvider>
  );
}
