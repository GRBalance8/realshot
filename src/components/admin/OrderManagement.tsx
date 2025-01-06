// src/components/admin/OrderManagement.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToBlob, BlobFolder } from '@/lib/blob';

interface Order {
  id: string;
  userId: string;
  status: string;
  imagesProcessed: boolean;
  trainingInitiated: boolean;
  imagesGenerated: boolean;
  orderCompleted: boolean;
  responsiblePerson: string | null;
  totalAmount: number;
  paymentStatus: string;
  stripeSessionId: string | null;
  paymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
  };
}

interface OrderManagementProps {
  initialOrders: Order[];
}

export function OrderManagement({ initialOrders }: OrderManagementProps): JSX.Element {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updateOrderStatus = async (orderId: string, updates: Partial<Order>): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update order');
      
      router.refresh();
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      ));
    } catch {
      setError('Failed to update order status');
    }
  };

  const handleFileUpload = async (orderId: string, files: FileList): Promise<void> => {
    setUploading(orderId);
    setError(null);
    
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');

      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const blob = await uploadToBlob({
          userId: order.userId,
          folder: BlobFolder.GENERATED,
          fileName,
          file,
          contentType: file.type,
        });

        await fetch(`/api/admin/orders/${orderId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: blob.url }),
        });
      });

      await Promise.all(uploadPromises);
      router.refresh();
    } catch {
      setError('Failed to upload images');
    } finally {
      setUploading(null);
    }
  };

  const markOrderComplete = async (orderId: string): Promise<void> => {
    try {
      await updateOrderStatus(orderId, {
        orderCompleted: true,
        status: 'COMPLETED'
      });
    } catch {
      setError('Failed to complete order');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-4">
          {error}
        </div>
      )}
      
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-[32px] shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-medium text-blue-900">
                Order #{order.id.slice(-6)}
              </h3>
              <p className="text-gray-600">Customer: {order.user.email}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium
              ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {order.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span>Images Processed</span>
              <button
                onClick={() => updateOrderStatus(order.id, { imagesProcessed: !order.imagesProcessed })}
                className={`px-4 py-2 rounded-full text-sm ${
                  order.imagesProcessed ? 'bg-blue-900 text-white' : 'bg-gray-100'
                }`}
              >
                {order.imagesProcessed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span>Training Initiated</span>
              <button
                onClick={() => updateOrderStatus(order.id, { trainingInitiated: !order.trainingInitiated })}
                className={`px-4 py-2 rounded-full text-sm ${
                  order.trainingInitiated ? 'bg-blue-900 text-white' : 'bg-gray-100'
                }`}
              >
                {order.trainingInitiated ? 'Completed' : 'Mark Complete'}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <span>Upload Generated Images</span>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(order.id, e.target.files)}
                  className="hidden"
                  id={`file-upload-${order.id}`}
                  disabled={uploading === order.id}
                />
                <label
                  htmlFor={`file-upload-${order.id}`}
                  className="px-4 py-2 bg-blue-900 text-white rounded-full text-sm cursor-pointer hover:bg-accent transition-colors"
                >
                  {uploading === order.id ? 'Uploading...' : 'Upload Images'}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <span>Complete Order</span>
              <button
                onClick={() => markOrderComplete(order.id)}
                disabled={!order.imagesProcessed || !order.trainingInitiated || order.orderCompleted}
                className="px-4 py-2 bg-green-600 text-white rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
              >
                {order.orderCompleted ? 'Completed' : 'Mark Complete & Notify Customer'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
