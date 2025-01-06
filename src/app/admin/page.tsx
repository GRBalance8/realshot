// src/app/admin/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderManagement } from '@/components/admin/OrderManagement'
import { StatsCards } from '@/components/admin/StatsCards'
import { UserManagement } from '@/components/admin/UserManagement'

export const dynamic = 'force-dynamic'

export default async function AdminPage(): Promise<JSX.Element> {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (user?.role !== 'ADMIN') {
    redirect('/account')
  }

  const [orders, users, stats] = await Promise.all([
    prisma.order.findMany({
      where: { paymentStatus: 'PAID' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, name: true }
        },
        uploadedPhotos: true,
        generatedPhotos: true
      }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.$transaction([
      prisma.order.count({ where: { paymentStatus: 'PAID' } }),
      prisma.order.count({ where: { status: 'PENDING', paymentStatus: 'PAID' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      })
    ])
  ])

  const [totalOrders, pendingOrders, processingOrders, completedOrders, revenue] = stats

  const serializedOrders = orders.map(order => ({
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString()
  }))

  const dashboardStats = {
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    totalRevenue: Number(revenue._sum.totalAmount) || 0,
    averageOrderValue: totalOrders ? (Number(revenue._sum.totalAmount) || 0) / totalOrders : 0
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-blue-900">Overview</h2>
        <p className="text-gray-600">Dashboard statistics and quick actions</p>
      </div>
      <StatsCards stats={dashboardStats} />
      <div className="mt-12">
        <h2 className="text-2xl font-serif text-blue-900 mb-6">Recent Orders</h2>
        <OrderManagement initialOrders={serializedOrders.slice(0, 5)} />
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-serif text-blue-900 mb-6">Recent Users</h2>
        <UserManagement initialUsers={users.slice(0, 5)} />
      </div>
    </main>
  )
}
