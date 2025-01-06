// src/app/studio/page.tsx
import { StudioWizard } from '@/components/studio/StudioWizard';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function StudioPage() {
  try {
    const session = await auth();
    
    if (!session) {
      redirect('/auth');
    }

    return <StudioWizard />;
  } catch (error) {
    console.error('[StudioPage] Authentication error:', error);
    redirect('/auth');
  }
}
