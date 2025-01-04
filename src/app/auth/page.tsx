// src/app/auth/page.tsx
import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Authentication | RealShot',
  description: 'Sign in to your RealShot account',
};

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-cream bg-pattern flex items-center justify-center p-4">
      <AuthForm />
    </main>
  );
}
