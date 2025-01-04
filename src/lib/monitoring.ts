// src/lib/monitoring.ts
import { transporter } from './email';

interface CleanupReport {
  cancelledOrders: number;
  abandonedUploads: number;
  deletedFiles: number;
  errors: string[];
}

export async function sendCleanupAlert(report: CleanupReport) {
  const hasErrors = report.errors.length > 0;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `Storage Cleanup Report ${hasErrors ? '- Action Required' : '- Success'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${hasErrors ? '#DC2626' : '#1A2B3B'}">
          Storage Cleanup Report
        </h2>
        <div style="margin: 20px 0; padding: 15px; background-color: ${hasErrors ? '#FEE2E2' : '#F3F4F6'}; border-radius: 8px;">
          <p>Summary:</p>
          <ul>
            <li>Cancelled Orders Processed: ${report.cancelledOrders}</li>
            <li>Abandoned Uploads Cleaned: ${report.abandonedUploads}</li>
            <li>Total Files Deleted: ${report.deletedFiles}</li>
          </ul>
          ${hasErrors ? `
            <div style="margin-top: 15px; color: #DC2626;">
              <p><strong>Errors Encountered:</strong></p>
              <ul>
                ${report.errors.map(error => `<li>${error}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `,
  };
  
  await transporter.sendMail(mailOptions);
}
