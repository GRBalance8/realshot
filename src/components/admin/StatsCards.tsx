// src/components/admin/StatsCards.tsx
'use client';
import { AdminDashboardStats } from '@/types/admin';

export function StatsCards({ stats }: { stats: AdminDashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          title: 'Total Orders',
          value: stats.totalOrders,
          icon: '📦'
        },
        {
          title: 'Pending Orders',
          value: stats.pendingOrders,
          icon: '⏳'
        },
        {
          title: 'Revenue',
          value: `$${stats.totalRevenue.toFixed(2)}`,
          icon: '💰'
        },
        {
          title: 'Avg. Order Value',
          value: `$${stats.averageOrderValue.toFixed(2)}`,
          icon: '📊'
        }
      ].map((stat, index) => (
        <div key={index} className="bg-white rounded-[32px] p-6 shadow-lg">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-gray-600">{stat.title}</div>
          <div className="text-2xl font-semibold text-blue-900 mt-2">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
