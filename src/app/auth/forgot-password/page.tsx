// src/app/auth/forgot-password/page.tsx
import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | RealShot',
  description: 'Reset your RealShot account password',
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-cream bg-pattern flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </main>
  );
}
