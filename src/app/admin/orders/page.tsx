// src/app/admin/orders/page.tsx
import { OrderManagement } from '@/components/admin/OrderManagement';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { Order as PrismaOrder } from '@prisma/client';

interface RawOrder extends PrismaOrder {
  user: {
    email: string;
  };
}

interface SerializedOrder {
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

export default async function OrdersPage(): Promise<JSX.Element> {
  const rawOrders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const serializedOrders: SerializedOrder[] = rawOrders.map((order: RawOrder): SerializedOrder => ({
    ...order,
    totalAmount: order.totalAmount instanceof Decimal ? 
      order.totalAmount.toNumber() : 
      Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString()
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-serif mb-8">Order Management</h1>
      <OrderManagement initialOrders={serializedOrders} />
    </div>
  );
}
