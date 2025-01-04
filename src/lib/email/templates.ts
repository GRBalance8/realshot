// src/lib/email/templates.ts
interface EmailData {
  userName?: string;
  orderId: string;
  orderStatus?: string;
  generatedPhotos?: string[];
}

const baseTemplate = (content: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #1A2B3B; padding: 20px; text-align: center; border-radius: 16px;">
      <h1 style="color: white; margin: 0;">RealShot</h1>
    </div>
    ${content}
    <div style="text-align: center; margin-top: 30px; color: #666;">
      <p>© ${new Date().getFullYear()} RealShot. All rights reserved.</p>
    </div>
  </div>
`;

export const emailTemplates = {
  orderCompletion: ({ userName, orderId, generatedPhotos = [] }: EmailData) => baseTemplate(`
    <div style="padding: 20px; background: white; border-radius: 16px; margin-top: 20px;">
      <h2 style="color: #1A2B3B;">Your Photos are Ready!</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Great news! Your order #${orderId} is complete and your AI-enhanced photos are ready.</p>
      ${generatedPhotos.length > 0 ? `
        <div style="margin: 20px 0;">
          ${generatedPhotos.slice(0, 3).map(url => `
            <img src="${url}" alt="Generated photo preview" style="width: 150px; height: 150px; object-fit: cover; margin: 5px; border-radius: 8px;">
          `).join('')}
        </div>
      ` : ''}
      <a href="${process.env.NEXTAUTH_URL}/account" 
         style="display: inline-block; background-color: #1A2B3B; color: white; 
                padding: 12px 24px; text-decoration: none; border-radius: 9999px; 
                margin: 20px 0;">
        View Your Photos
      </a>
    </div>
  `),

  orderStatus: ({ userName, orderId, orderStatus }: EmailData) => baseTemplate(`
    <div style="padding: 20px; background: white; border-radius: 16px; margin-top: 20px;">
      <h2 style="color: #1A2B3B;">Order Status Update</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Your order #${orderId} status has been updated to: <strong>${orderStatus}</strong></p>
      <a href="${process.env.NEXTAUTH_URL}/account" 
         style="display: inline-block; background-color: #1A2B3B; color: white; 
                padding: 12px 24px; text-decoration: none; border-radius: 9999px; 
                margin: 20px 0;">
        View Order Details
      </a>
    </div>
  `),

  newOrder: ({ orderId }: EmailData) => baseTemplate(`
    <div style="padding: 20px; background: white; border-radius: 16px; margin-top: 20px;">
      <h2 style="color: #1A2B3B;">New Order Received</h2>
      <p>A new order #${orderId} has been received and is ready for processing.</p>
      <a href="${process.env.NEXTAUTH_URL}/admin" 
         style="display: inline-block; background-color: #1A2B3B; color: white; 
                padding: 12px 24px; text-decoration: none; border-radius: 9999px; 
                margin: 20px 0;">
        View Order Details
      </a>
    </div>
  `)
};
