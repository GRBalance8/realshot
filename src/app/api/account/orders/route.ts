// src/app/api/account/orders/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        paymentStatus: 'PAID'
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        generatedPhotos: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
