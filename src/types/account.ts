// src/types/account.ts
export interface Service {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  icon?: React.ReactNode;
}

export interface AccountPageProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
  activeOrders?: Order[];
}

export interface Order {
  id: string;
  status: OrderStatus;
  imagesProcessed: boolean;
  trainingInitiated: boolean;
  imagesGenerated: boolean;
  orderCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
