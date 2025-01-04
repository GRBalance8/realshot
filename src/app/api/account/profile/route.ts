// src/app/api/account/profile/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { withProtectedRoute } from '@/lib/api-middleware';

export async function GET(request: Request) {
  return withProtectedRoute(request, async (_, session) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });
    return NextResponse.json({ profile });
  });
}

export async function PUT(request: Request) {
  return withProtectedRoute(request, async (req, session) => {
    const data = await req.json();
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { ...data, userId: session.user.id }
    });
    return NextResponse.json({ profile });
  });
}
