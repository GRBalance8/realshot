// src/app/api/studio/photo-instructions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface PhotoInstruction {
  description: string;
  referenceImage: string | null;
  fileId: string | null;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instructions = await req.json() as PhotoInstruction[];

    if (!Array.isArray(instructions)) {
      return NextResponse.json(
        { error: 'Invalid instructions format' },
        { status: 400 }
      );
    }

    if (instructions.length !== 6) {
      return NextResponse.json(
        { error: 'Must provide exactly 6 instructions' },
        { status: 400 }
      );
    }

    // Get the active order for the user
    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: 'PENDING'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No active order found' },
        { status: 400 }
      );
    }

    // Delete existing instructions for this order
    await prisma.photoRequest.deleteMany({
      where: {
        orderId: order.id
      }
    });

    // Create new instructions
    const photoRequests = await prisma.$transaction(
      instructions.map((instruction) =>
        prisma.photoRequest.create({
          data: {
            orderId: order.id,
            description: instruction.description,
            referenceImage: instruction.referenceImage
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: photoRequests
    });
  } catch (error) {
    console.error('Photo instructions error:', error);
    return NextResponse.json(
      { error: 'Failed to save photo instructions' },
      { status: 500 }
    );
  }
}
