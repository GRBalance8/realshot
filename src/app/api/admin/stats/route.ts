// src/app/api/admin/stats/route.ts
export async function GET(request: Request) {
  return withProtectedRoute(request, async () => {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      })
    ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
      averageOrderValue: totalOrders ? (revenue._sum.totalAmount || 0) / totalOrders : 0
    });
  }, { requireAdmin: true });
}
