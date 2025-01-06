// src/components/account/AccountContent.tsx
'use client';

import { FC } from 'react';
import { AccountHeader } from './AccountHeader';
import { ServicesGrid } from './ServicesGrid';
import { OrderProgress } from './OrderProgress';
import { PhotoGallery } from './PhotoGallery';
import type { OrderWithDetails } from '@/types/orders';

interface AccountContentProps {
  userName: string | null | undefined;
  order: OrderWithDetails;
}

export const AccountContent: FC<AccountContentProps> = ({ userName, order }) => {
  return (
    <main className="min-h-screen bg-gray-50">
      <AccountHeader userName={userName} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {order && !order.progress.orderCompleted && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-blue-900 mb-6">Current Order Status</h2>
            <OrderProgress 
              status={order.progress}
              orderId={order.id}
            />
          </div>
        )}

        {order.progress.orderCompleted && order.generatedPhotos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-blue-900 mb-6">Your Generated Photos</h2>
            <PhotoGallery photos={order.generatedPhotos} />
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-serif text-blue-900 mb-6">Available Services</h2>
          <ServicesGrid />
        </div>
      </div>
    </main>
  );
};
