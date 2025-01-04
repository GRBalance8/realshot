// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderCompletionEmail } from '@/lib/email/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No stripe signature found' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session.metadata?.orderId) {
          throw new Error('No orderId in session metadata');
        }

        // Update order status
        await prisma.order.update({
          where: { 
            id: session.metadata.orderId 
          },
          data: {
            status: 'PROCESSING',
            paymentStatus: 'PAID',
            paymentIntentId: session.payment_intent as string,
            updatedAt: new Date()
          }
        });

        // Send completion email
        if (session.customer_details?.email) {
          await sendOrderCompletionEmail(
            session.customer_details.email,
            session.metadata.orderId,
            session.customer_details.name || undefined
          );
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        await prisma.order.update({
          where: { paymentIntentId: charge.payment_intent as string },
          data: { 
            paymentStatus: 'REFUNDED',
            updatedAt: new Date()
          }
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook error occurred' },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
