// src/lib/api-middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Session } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import rateLimit from '@/lib/rate-limit';
import { logError } from '@/lib/error-logger';
import { prisma } from '@/lib/prisma';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500
});

type HandlerFunction = (request: Request, session: Session) => Promise<Response>;

interface ProtectedRouteOptions {
  requireAdmin?: boolean;
  rateLimit?: boolean;
}

let currentSession: Session | null = null;

export async function withProtectedRoute(
  request: Request,
  handler: HandlerFunction,
  { requireAdmin = false, rateLimit: shouldRateLimit = true }: ProtectedRouteOptions = {}
) {
  try {
    if (shouldRateLimit) {
      try {
        await limiter.check(50, request.url);
      } catch {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }

    currentSession = await auth();
    if (!currentSession?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (requireAdmin) {
      const user = await prisma.user.findUnique({
        where: { id: currentSession.user.id }
      });
      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return await handler(request, currentSession);
  } catch (error) {
    await logError(
      error as Error,
      currentSession?.user?.id,
      request.url
    );
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
