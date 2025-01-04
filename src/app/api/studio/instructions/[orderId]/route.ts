// src/app/api/studio/instructions/[orderId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface PhotoInstruction {
 description: string;
 referenceImage: string | null;
 fileId: string | null;
}

export async function GET(
 req: Request,
 { params }: { params: { orderId: string } }
) {
 try {
   const session = await auth();
   if (!session?.user?.id) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const { orderId } = params;
   
   const order = await prisma.order.findFirst({
     where: {
       id: orderId,
       userId: session.user.id
     },
     include: {
       photoRequests: {
         orderBy: {
           createdAt: 'asc'
         }
       }
     }
   });

   if (!order) {
     return NextResponse.json(
       { error: 'Order not found' },
       { status: 404 }
     );
   }

   const instructions: PhotoInstruction[] = order.photoRequests.map(request => ({
     description: request.description,
     referenceImage: request.referenceImage,
     fileId: request.id
   }));

   // Pad with empty instructions if less than 6
   while (instructions.length < 6) {
     instructions.push({
       description: '',
       referenceImage: null,
       fileId: null
     });
   }

   return NextResponse.json({ instructions });
 } catch (error) {
   console.error('Instructions fetch error:', error);
   return NextResponse.json(
     { error: 'Failed to fetch instructions' },
     { status: 500 }
   );
 }
}
