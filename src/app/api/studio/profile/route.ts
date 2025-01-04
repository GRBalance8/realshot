// src/app/api/studio/profile/route.ts
// MODIFYING: Adding GET method and keeping POST method
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface ProfileData {
  hobbies?: string;
  location?: string;
  style?: string;
  additionalInfo?: string;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id
      }
    });

    if (!profile) {
      return NextResponse.json({
        hobbies: '',
        location: '',
        style: '',
        additionalInfo: ''
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json() as ProfileData;

    if ((data.hobbies !== undefined && typeof data.hobbies !== 'string') || 
        (data.location !== undefined && typeof data.location !== 'string') || 
        (data.style !== undefined && typeof data.style !== 'string') || 
        (data.additionalInfo !== undefined && typeof data.additionalInfo !== 'string')) {
      return NextResponse.json(
        { error: 'Invalid profile data format' },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        ...(data.hobbies !== undefined && { hobbies: data.hobbies }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.style !== undefined && { style: data.style }),
        ...(data.additionalInfo !== undefined && { additionalInfo: data.additionalInfo }),
      },
      create: {
        userId: session.user.id,
        hobbies: data.hobbies || '',
        location: data.location || '',
        style: data.style || '',
        additionalInfo: data.additionalInfo || '',
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
