// src/types/admin.ts
import { OrderStatus, PaymentStatus } from '@prisma/client';

export interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN';
  name?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface AdminOrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

export interface AdminActions {
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deletePhoto: (orderId: string, photoId: string) => Promise<void>;
  markOrderComplete: (orderId: string) => Promise<void>;
  uploadGeneratedPhotos: (orderId: string, files: FileList) => Promise<void>;
}
