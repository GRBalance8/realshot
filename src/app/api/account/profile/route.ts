// src/app/api/account/profile/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withProtectedRoute } from '@/lib/api-middleware'
import { ApiResponse } from '@/types/api'
import { Profile } from '@prisma/client'

export async function GET(request: Request): Promise<NextResponse<ApiResponse<{ profile: Profile | null }>>> {
  return withProtectedRoute<{ profile: Profile | null }>(
    request,
    async (_, session) => {
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id }
      })
      return NextResponse.json({ 
        success: true,
        data: { profile }
      })
    }
  )
}

export async function PUT(request: Request): Promise<NextResponse<ApiResponse<{ profile: Profile }>>> {
  return withProtectedRoute<{ profile: Profile }>(
    request,
    async (req, session) => {
      const data = await req.json()
      const profile = await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: data,
        create: { ...data, userId: session.user.id }
      })
      return NextResponse.json({ 
        success: true,
        data: { profile }
      })
    }
  )
}
