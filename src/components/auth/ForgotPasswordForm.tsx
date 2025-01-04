// src/components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to process request');

      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-lg p-10">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          If an account exists for {email}, you will receive a password reset link shortly.
        </p>
        <button
          onClick={() => router.push('/auth')}
          className="w-full bg-blue-900 text-white py-3 rounded-full hover:bg-accent transition-all duration-300"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-lg p-10">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">Reset Password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-full hover:bg-accent transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/auth')}
          className="w-full text-gray-600 hover:text-blue-900 transition-colors"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};
