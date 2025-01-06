// src/lib/api-middleware.ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { Session } from 'next-auth'
import rateLimit from '@/lib/rate-limit'
import { logError } from '@/lib/error-logger'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500
})

type HandlerFunction<T> = (request: Request, session: Session) => Promise<NextResponse<ApiResponse<T>>>

interface ProtectedRouteOptions {
  requireAdmin?: boolean
  rateLimit?: boolean
}

let currentSession: Session | null = null

export async function withProtectedRoute<T>(
  request: Request,
  handler: HandlerFunction<T>,
  { requireAdmin = false, rateLimit: shouldRateLimit = true }: ProtectedRouteOptions = {}
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    if (shouldRateLimit) {
      try {
        await limiter.check(50, request.url)
      } catch {
        return NextResponse.json({ 
          success: false, 
          error: 'Too many requests' 
        }, { status: 429 })
      }
    }

    currentSession = await auth()
    if (!currentSession?.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    if (requireAdmin) {
      const user = await prisma.user.findUnique({
        where: { id: currentSession.user.id }
      })
      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ 
          success: false, 
          error: 'Unauthorized' 
        }, { status: 401 })
      }
    }

    return await handler(request, currentSession)
  } catch (error) {
    await logError(
      error as Error,
      currentSession?.user?.id,
      request.url
    )
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
