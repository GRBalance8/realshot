// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { withProtectedRoute } from '@/lib/api-middleware';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  return withProtectedRoute(request, async () => {
    try {
      // Get all paid orders statistics
      const [orderStats, revenue] = await Promise.all([
        prisma.order.groupBy({
          by: ['status'],
          where: {
            paymentStatus: 'PAID'
          },
          _count: true
        }),
        prisma.order.aggregate({
          where: {
            paymentStatus: 'PAID'
          },
          _sum: {
            totalAmount: true
          }
        })
      ]);

      // Calculate totals for each status
      const totalOrders = orderStats.reduce((sum, stat) => sum + stat._count, 0);
      const pendingOrders = orderStats.find(stat => stat.status === 'PENDING')?._count ?? 0;
      const processingOrders = orderStats.find(stat => stat.status === 'PROCESSING')?._count ?? 0;
      const completedOrders = orderStats.find(stat => stat.status === 'COMPLETED')?._count ?? 0;
      const totalRevenue = Number(revenue._sum.totalAmount) || 0;

      // Calculate average order value
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return NextResponse.json({
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch admin statistics' },
        { status: 500 }
      );
    }
  }, { requireAdmin: true });
}

export const dynamic = 'force-dynamic';
