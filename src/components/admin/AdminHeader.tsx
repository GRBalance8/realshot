// src/components/admin/AdminHeader.tsx
import { FC } from 'react';

interface AdminHeaderProps {
  totalOrders?: number;
}

export const AdminHeader: FC<AdminHeaderProps> = ({ totalOrders = 0 }) => {
  return (
    <div className="bg-blue-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-serif">Admin Dashboard</h1>
        <p className="text-blue-100 mt-1">Managing {totalOrders} active orders</p>
      </div>
    </div>
  );
};
