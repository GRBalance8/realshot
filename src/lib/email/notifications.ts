// src/lib/email/notifications.ts
import { transporter } from './transporter';
import { emailTemplates } from './templates';

export async function sendOrderCompletionEmail(
  email: string, 
  orderId: string, 
  userName?: string,
  photos?: string[]
) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your RealShot Order is Ready!',
    html: emailTemplates.orderCompletion({ orderId, userName, generatedPhotos: photos })
  };
  
  await transporter.sendMail(mailOptions);
}

export async function sendOrderStatusEmail(
  email: string,
  orderId: string,
  status: string,
  userName?: string
) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Order Status Update - RealShot',
    html: emailTemplates.orderStatus({ orderId, orderStatus: status, userName })
  };

  await transporter.sendMail(mailOptions);
}

export async function sendNewOrderNotification(orderId: string) {
  if (!process.env.ADMIN_EMAIL) return;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Order Received - RealShot',
    html: emailTemplates.newOrder({ orderId })
  };

  await transporter.sendMail(mailOptions);
}
