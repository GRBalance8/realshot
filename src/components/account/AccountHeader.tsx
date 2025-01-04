// src/components/account/AccountHeader.tsx
import { FC } from 'react';

interface AccountHeaderProps {
  userName: string | null | undefined;
}

export const AccountHeader: FC<AccountHeaderProps> = ({ userName }) => {
  return (
    <div className="bg-blue-900 text-white py-12 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif mb-4">
          Welcome{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-blue-100 text-lg">
          Explore our services to enhance your profile
        </p>
      </div>
    </div>
  );
};
