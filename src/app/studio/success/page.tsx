// src/app/studio/success/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card } from '@/components/studio/components/Card';

export default async function SuccessPage({
  searchParams
}: {
  searchParams: { session_id: string }
}) {
  const session = await auth();
  if (!session) {
    redirect('/auth');
  }

  return (
    <div className="studio-section">
      <Card className="text-center max-w-2xl mx-auto">
        <div className="p-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="studio-heading mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've started processing your photos and will notify you once they're ready.
          </p>
          <p className="text-sm text-gray-500">
            Order reference: {searchParams.session_id}
          </p>
        </div>
      </Card>
    </div>
  );
}
