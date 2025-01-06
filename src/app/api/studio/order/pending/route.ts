// src/app/api/studio/order/pending/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: 'PENDING'
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        uploadedPhotos: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        photoRequests: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ order: null });
    }

    return NextResponse.json({
      order: {
        ...order,
        uploadedPhotos: order.uploadedPhotos.map(photo => ({
          id: photo.id,
          url: photo.url,
          name: photo.url.split('/').pop() || 'Untitled'
        }))
      }
    });
  } catch (error) {
    console.error('Pending order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending order' },
      { status: 500 }
    );
  }
}
