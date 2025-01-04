// src/app/api/studio/upload/route.ts
// MODIFYING: Adding Vercel Blob integration
import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/heic'];

interface UploadResponse {
 id: string;
 url: string;
 referenceImage?: string | null;
}

export async function POST(req: NextRequest) {
 try {
   const session = await auth();
   
   if (!session?.user?.id || !session?.user?.email) {
     console.error('Auth failed: No session or user ID');
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const user = await prisma.$transaction(async (tx) => {
     let user = await tx.user.findUnique({
       where: { id: session.user.id }
     });

     if (!user) {
       user = await tx.user.create({
         data: {
           id: session.user.id,
           email: session.user.email,
           name: session.user.name || null,
         }
       });
     }
     return user;
   });

   const formData = await req.formData();
   const file = formData.get('file') as File;
   const isReference = formData.get('type') === 'reference';

   if (!file) {
     return NextResponse.json({ error: 'No file provided' }, { status: 400 });
   }

   if (!ALLOWED_FILE_TYPES.includes(file.type)) {
     return NextResponse.json(
       { error: 'Invalid file type. Please upload JPEG, PNG, or HEIC files only.' },
       { status: 400 }
     );
   }

   if (file.size > MAX_FILE_SIZE) {
     return NextResponse.json(
       { error: 'File size exceeds 10MB limit' },
       { status: 400 }
     );
   }

   // Upload to Vercel Blob
   const blob = await put(file.name, file, {
     access: 'public',
     addRandomSuffix: true,
   });

   const order = await prisma.$transaction(async (tx) => {
     const existingOrder = await tx.order.findFirst({
       where: {
         userId: user.id,
         status: 'PENDING'
       },
       orderBy: {
         createdAt: 'desc'
       }
     });

     if (existingOrder) {
       return existingOrder;
     }

     return await tx.order.create({
       data: {
         userId: user.id,
         status: 'PENDING'
       }
     });
   });

   let response: UploadResponse;
   
   if (isReference) {
     const photoRequest = await prisma.photoRequest.create({
       data: {
         orderId: order.id,
         referenceImage: blob.url,
         description: ''
       }
     });

     response = {
       id: photoRequest.id,
       url: blob.url,
       referenceImage: photoRequest.referenceImage
     };
   } else {
     const uploadedFile = await prisma.uploadedPhoto.create({
       data: {
         url: blob.url,
         orderId: order.id,
       }
     });

     response = {
       id: uploadedFile.id,
       url: uploadedFile.url
     };
   }

   return NextResponse.json(response);
 } catch (error) {
   console.error('Upload error:', error);
   if (error instanceof Error) {
     console.error('Error details:', {
       message: error.message,
       stack: error.stack,
       name: error.name
     });
   }
   return NextResponse.json(
     { error: 'Upload failed. Please try again.' },
     { status: 500 }
   );
 }
}

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

   try {
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
   } catch (prismaError) {
     console.error('Prisma delete error:', prismaError);
     return NextResponse.json(
       { error: 'File not found or already deleted' },
       { status: 404 }
     );
   }

   return NextResponse.json({ success: true });
 } catch (error) {
   console.error('Delete error:', error);
   if (error instanceof Error) {
     console.error('Error details:', {
       message: error.message,
       stack: error.stack,
       name: error.name
     });
   }
   return NextResponse.json(
     { error: 'Failed to delete file. Please try again.' },
     { status: 500 }
   );
 }
}
