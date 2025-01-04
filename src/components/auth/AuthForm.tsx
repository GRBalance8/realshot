'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [remember, setRemember] = useState(true);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/my-account');
          router.refresh();
        }
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Auto login after successful registration
        await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        
        router.push('/my-account');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/my-account' });
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/auth/forgot-password');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-lg p-10">
      <div className="flex justify-center mb-10">
        <div className="bg-gray-50 rounded-full p-1 relative">
          <div className="flex space-x-2">
            <button
              type="button"
              className={cn(
                "px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10",
                isLogin ? "text-white" : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
            <button
              type="button"
              className={cn(
                "px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 relative z-10",
                !isLogin ? "text-white" : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
          <div 
            className={cn(
              "absolute top-1 bottom-1 w-1/2 bg-blue-900 rounded-full transition-transform duration-300",
              !isLogin ? "translate-x-full" : "translate-x-0"
            )}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:outline-none"
            required
            minLength={8}
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:outline-none"
              required
              minLength={8}
            />
          </div>
        )}

        {isLogin && (
          <label className="flex items-center cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded-sm transition-colors 
                ${remember ? 'bg-blue-900 border-blue-900' : 'border-gray-300 bg-white'}`}
              >
                {remember && (
                  <svg className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                       viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="ml-3 text-sm text-gray-600">Remember me</span>
          </label>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-full hover:bg-accent transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="loading-spinner mr-2" />
              {isLogin ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className="mt-8 mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
        >
          <svg className="w-5 h-5 mr-2 text-gray-600 group-hover:text-gray-900 transition-colors" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {isLogin && (
        <a
          href="/auth/forgot-password"
          onClick={handleForgotPassword}
          className="block text-center text-sm text-gray-600 hover:text-blue-900 transition-colors"
        >
          Forgot your password?
        </a>
      )}
    </div>
  );
};
