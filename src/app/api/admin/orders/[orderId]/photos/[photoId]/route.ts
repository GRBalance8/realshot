// src/app/api/admin/orders/[orderId]/photos/[photoId]/route.ts
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string; photoId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get photo URL before deletion
    const photo = await prisma.generatedPhoto.findUnique({
      where: {
        id: params.photoId,
        orderId: params.orderId
      }
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete from Vercel Blob
    try {
      await del(photo.url);
    } catch (error) {
      console.error('Failed to delete from blob storage:', error);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await prisma.generatedPhoto.delete({
      where: {
        id: params.photoId,
        orderId: params.orderId
      }
    });

    // Check if this was the last generated photo
    const remainingPhotos = await prisma.generatedPhoto.count({
      where: { orderId: params.orderId }
    });

    // Update order status if no photos remain
    if (remainingPhotos === 0) {
      await prisma.order.update({
        where: { id: params.orderId },
        data: { imagesGenerated: false }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully'
    });

  } catch (error) {
    console.error('Photo deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
