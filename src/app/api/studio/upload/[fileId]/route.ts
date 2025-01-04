// src/app/api/studio/upload/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileId = params.fileId;
    if (!fileId) {
      return NextResponse.json({ error: 'No file ID provided' }, { status: 400 });
    }

    const isReference = req.nextUrl.searchParams.get('type') === 'reference';

    if (isReference) {
      const photoRequest = await prisma.photoRequest.findUnique({
        where: { id: fileId }
      });

      if (photoRequest?.referenceImage) {
        await del(photoRequest.referenceImage);
      }

      await prisma.photoRequest.update({
        where: { id: fileId },
        data: { referenceImage: null }
      });
    } else {
      const uploadedPhoto = await prisma.uploadedPhoto.findUnique({
        where: { id: fileId }
      });

      if (uploadedPhoto?.url) {
        await del(uploadedPhoto.url);
      }

      await prisma.uploadedPhoto.delete({
        where: { id: fileId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
