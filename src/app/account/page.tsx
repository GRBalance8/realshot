// src/app/account/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AccountHeader } from '@/components/account/AccountHeader';
import { ServicesGrid } from '@/components/account/ServicesGrid';
import { OrderProgress } from '@/components/account/OrderProgress';

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth');
  }

  // Check user's latest order status
  const latestOrder = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      generatedPhotos: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  // If user has no paid orders or latest order is pending, redirect to studio
  if (!latestOrder || latestOrder.paymentStatus !== 'PAID') {
    redirect('/studio');
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AccountHeader userName={session.user.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Display Order Progress if active order exists */}
        {latestOrder && !latestOrder.orderCompleted && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-blue-900 mb-6">Current Order Status</h2>
            <OrderProgress 
              status={{
                imagesProcessed: latestOrder.imagesProcessed,
                trainingInitiated: latestOrder.trainingInitiated,
                imagesGenerated: latestOrder.imagesGenerated,
                orderCompleted: latestOrder.orderCompleted
              }}
              orderId={latestOrder.id}
            />
          </div>
        )}

        {/* Display Generated Photos if available */}
        {latestOrder.orderCompleted && latestOrder.generatedPhotos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-blue-900 mb-6">Your Generated Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestOrder.generatedPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={photo.url}
                    alt="Generated photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif text-blue-900 mb-6">Available Services</h2>
          <ServicesGrid />
        </div>
      </div>
    </main>
  );
}
