import { OrderManagement } from '@/components/admin/OrderManagement';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { Order as PrismaOrder } from '@prisma/client';

// Interface for the raw order from Prisma
interface RawOrder extends PrismaOrder {
  user: {
    email: string;
  };
}

// Interface for the processed order
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
  createdAt: Date;
  updatedAt: Date;
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

  // Convert Decimal to number for client component
  const orders: Order[] = rawOrders.map((order: RawOrder): Order => ({
    ...order,
    totalAmount: order.totalAmount instanceof Decimal ? 
      order.totalAmount.toNumber() : 
      Number(order.totalAmount),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-serif mb-8">Order Management</h1>
      <OrderManagement initialOrders={orders} />
    </div>
  );
}
