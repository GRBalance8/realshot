// src/components/admin/UserManagement.tsx
'use client';

import { useState } from 'react';
import { UserRole } from '@prisma/client';

interface UserDisplay {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function UserManagement({ initialUsers }: { initialUsers: UserDisplay[] }): JSX.Element {
  const [users] = useState<UserDisplay[]>(initialUsers);

  return (
    <div className="bg-white rounded-[32px] shadow-lg p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-4">User</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Role</th>
              <th className="pb-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="py-4">{user.name || 'N/A'}</td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">{user.role}</td>
                <td className="py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
