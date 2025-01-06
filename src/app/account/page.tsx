// src/app/account/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AccountContent } from '@/components/account/AccountContent';
import type { Metadata } from 'next';
import type { OrderWithDetails } from '@/types/orders';

export const metadata: Metadata = {
  title: 'Account | RealShot',
  description: 'View your RealShot account and photos',
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth');
  }

  const latestOrder = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      generatedPhotos: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      uploadedPhotos: true,
      photoRequests: true
    }
  }) as OrderWithDetails | null;

  if (!latestOrder || latestOrder.paymentStatus !== 'PAID') {
    redirect('/studio');
  }

  return <AccountContent userName={session.user.name} order={latestOrder} />;
}
