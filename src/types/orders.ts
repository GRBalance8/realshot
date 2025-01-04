// src/types/orders.ts
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface BaseOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderProgress {
  imagesProcessed: boolean;
  trainingInitiated: boolean;
  imagesGenerated: boolean;
  orderCompleted: boolean;
}

export interface Photo {
  id: string;
  url: string;
  createdAt: Date;
}

export interface PhotoRequest {
  id: string;
  description: string;
  referenceImage: string | null;
}

export interface OrderWithDetails extends BaseOrder {
  progress: OrderProgress;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  uploadedPhotos: Photo[];
  generatedPhotos: Photo[];
  photoRequests: PhotoRequest[];
  responsiblePerson?: string | null;
  stripeSessionId?: string | null;
  paymentIntentId?: string | null;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: Date;
  progress: OrderProgress;
}

export interface OrderStats {
  totalOrders: number;
  pendingPayment: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}
