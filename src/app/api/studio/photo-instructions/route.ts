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

    if (instructions.length === 0 || instructions.length > 6) {
      return NextResponse.json(
        { error: 'Invalid number of instructions' },
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
    const photoRequests = await Promise.all(
      instructions.map((instruction) =>
        prisma.photoRequest.create({
          data: {
            orderId: order.id,
            description: instruction.description,
            referenceImage: instruction.referenceImage,
          }
        })
      )
    );

    return NextResponse.json(photoRequests);
  } catch (error) {
    console.error('Photo instructions error:', error);
    return NextResponse.json(
      { error: 'Failed to save photo instructions' },
      { status: 500 }
    );
  }
}
