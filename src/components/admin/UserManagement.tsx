// src/components/admin/UserManagement.tsx
'use client';
import { useState } from 'react';
import { AdminUser } from '@/types/admin';

export function UserManagement({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);

  const toggleAdminRole = async (userId: string, isAdmin: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: isAdmin ? 'ADMIN' : 'USER' })
      });

      if (!response.ok) throw new Error('Failed to update user role');

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: isAdmin ? 'ADMIN' : 'USER' } : user
      ));
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-lg p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-4">User</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Role</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="py-4">{user.name || 'N/A'}</td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">{user.role}</td>
                <td className="py-4">
                  <button
                    onClick={() => toggleAdminRole(user.id, user.role !== 'ADMIN')}
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-full bg-blue-900 text-white hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
