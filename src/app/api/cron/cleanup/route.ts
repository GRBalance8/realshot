// src/app/api/cron/cleanup/route.ts
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function deleteFromBlob(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error(`Failed to delete blob at ${url}:`, error);
  }
}

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find orders older than 7 days that are still pending
    const oldPendingOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo
        },
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        uploadedPhotos: true,
        photoRequests: true
      }
    });

    let deletedFiles = 0;
    const processedOrders = [];

    for (const order of oldPendingOrders) {
      // Delete training images
      for (const photo of order.uploadedPhotos) {
        await deleteFromBlob(photo.url);
        deletedFiles++;
      }

      // Delete reference images
      for (const request of order.photoRequests) {
        if (request.referenceImage) {
          await deleteFromBlob(request.referenceImage);
          deletedFiles++;
        }
      }

      // Delete the order and related records from database
      await prisma.order.delete({
        where: { id: order.id }
      });

      processedOrders.push(order.id);
    }

    return NextResponse.json({
      success: true,
      deletedFiles,
      processedOrders,
      message: `Cleaned up ${deletedFiles} files from ${processedOrders.length} orders`
    });

  } catch (error) {
    console.error('Cleanup job error:', error);
    return NextResponse.json(
      { error: 'Failed to run cleanup job' },
      { status: 500 }
    );
  }
}
