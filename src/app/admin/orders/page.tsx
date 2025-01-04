// src/app/admin/orders/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderManagement } from '@/components/admin/OrderManagement';

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (user?.role !== 'ADMIN') {
    redirect('/account');
  }

  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, name: true }
      },
      uploadedPhotos: true,
      generatedPhotos: true
    }
  });

  const serializedOrders = orders.map(order => ({
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString()
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-blue-900">Orders</h1>
        <p className="text-gray-600">Manage and track all orders</p>
      </div>
      <OrderManagement initialOrders={serializedOrders} />
    </main>
  );
}
