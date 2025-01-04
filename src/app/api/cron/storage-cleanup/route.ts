// src/app/api/cron/storage-cleanup/route.ts
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { sendCleanupAlert } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function deleteBlobFiles(urls: string[]) {
  return Promise.allSettled(
    urls.map(async (url) => {
      try {
        await del(url);
        return { success: true, url };
      } catch (error) {
        console.error(`Failed to delete blob at ${url}:`, error);
        return { success: false, url };
      }
    })
  );
}

export async function GET(request: Request) {
  try {
    // Verify cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      cancelledOrders: 0,
      abandonedUploads: 0,
      deletedFiles: 0,
      errors: [] as string[]
    };

    // 1. Clean up cancelled orders
    const cancelledOrders = await prisma.order.findMany({
      where: { status: 'CANCELLED' },
      include: {
        uploadedPhotos: true,
        photoRequests: true,
        generatedPhotos: true
      }
    });

    for (const order of cancelledOrders) {
      const allUrls = [
        ...order.uploadedPhotos.map(p => p.url),
        ...order.photoRequests.filter(r => r.referenceImage).map(r => r.referenceImage!),
        ...order.generatedPhotos.map(p => p.url)
      ];

      const deleteResults = await deleteBlobFiles(allUrls);
      
      // Count failures
      const failures = deleteResults.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        results.errors.push(`Failed to delete ${failures.length} files from order ${order.id}`);
      }

      // Delete order and related records from database
      await prisma.order.delete({
        where: { id: order.id }
      });

      results.cancelledOrders++;
      results.deletedFiles += deleteResults.filter(r => r.status === 'fulfilled').length;
    }

    // 2. Clean up abandoned uploads (incomplete orders older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const abandonedOrders = await prisma.order.findMany({
      where: {
        createdAt: { lt: sevenDaysAgo },
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        uploadedPhotos: true,
        photoRequests: true
      }
    });

    for (const order of abandonedOrders) {
      const allUrls = [
        ...order.uploadedPhotos.map(p => p.url),
        ...order.photoRequests.filter(r => r.referenceImage).map(r => r.referenceImage!)
      ];

      const deleteResults = await deleteBlobFiles(allUrls);
      
      // Count failures
      const failures = deleteResults.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        results.errors.push(`Failed to delete ${failures.length} files from abandoned order ${order.id}`);
      }

      // Delete order and related records from database
      await prisma.order.delete({
        where: { id: order.id }
      });

      results.abandonedUploads++;
      results.deletedFiles += deleteResults.filter(r => r.status === 'fulfilled').length;
    }

    // Send cleanup report to admin
    await sendCleanupAlert(results);

    return NextResponse.json({
      success: true,
      ...results,
      message: `Cleaned up ${results.deletedFiles} files from ${results.cancelledOrders} cancelled orders and ${results.abandonedUploads} abandoned uploads`
    });

  } catch (error) {
    console.error('Storage cleanup error:', error);
    // Send alert for critical failure
    await sendCleanupAlert({
      cancelledOrders: 0,
      abandonedUploads: 0,
      deletedFiles: 0,
      errors: [`Critical cleanup failure: ${error instanceof Error ? error.message : 'Unknown error'}`]
    });
    return NextResponse.json(
      { error: 'Failed to run storage cleanup' },
      { status: 500 }
    );
  }
}
