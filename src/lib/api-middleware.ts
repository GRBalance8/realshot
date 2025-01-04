// src/lib/api-middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import rateLimit from '@/lib/rate-limit';
import { logError } from '@/lib/error-logger';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500
});

export async function withProtectedRoute(
  request: Request,
  handler: Function,
  { requireAdmin = false, rateLimit = true } = {}
) {
  try {
    // Rate limiting
    if (rateLimit) {
      try {
        await limiter.check(50, request.url); // 50 requests per minute per URL
      } catch {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }

    // Auth check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    if (requireAdmin) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Execute handler
    return await handler(request, session);

  } catch (error) {
    // Log error
    await logError(
      error as Error,
      session?.user?.id,
      request.url
    );

    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
