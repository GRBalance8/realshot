// src/app/auth/reset-password/page.tsx
import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | RealShot',
  description: 'Set a new password for your RealShot account',
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-cream bg-pattern flex items-center justify-center p-4">
      <ResetPasswordForm />
    </main>
  );
}
