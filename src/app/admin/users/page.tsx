// src/app/admin/users/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserManagement } from '@/components/admin/UserManagement'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage(): Promise<JSX.Element> {
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

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-blue-900">Users</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>
      <UserManagement initialUsers={users} />
    </main>
  )
}
