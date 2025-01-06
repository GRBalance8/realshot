// src/app/auth/reset-password/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | RealShot',
  description: 'Set a new password for your RealShot account',
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-cream bg-pattern flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-lg p-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
