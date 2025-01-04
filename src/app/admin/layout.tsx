// src/app/admin/layout.tsx
import Link from 'next/link';
import { FC, ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/admin" className="font-serif text-xl">
              Admin Dashboard
            </Link>
            <div className="flex space-x-4">
              <Link 
                href="/admin/orders"
                className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                Orders
              </Link>
              <Link 
                href="/admin/users"
                className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                Users
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
