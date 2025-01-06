// src/app/api/account/photos/route.ts
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

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    const photos = await prisma.generatedPhoto.findMany({
      where: {
        order: {
          userId: session.user.id,
          ...(orderId ? { id: orderId } : {})
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        order: {
          select: {
            createdAt: true,
            status: true
          }
        }
      }
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Photos fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
