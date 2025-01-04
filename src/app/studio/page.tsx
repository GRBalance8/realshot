// src/app/studio/page.tsx
import { StudioWizard } from '@/components/studio/StudioWizard';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function StudioPage() {
  try {
    const session = await auth();
    console.log("[StudioPage] Session:", session);
    
    if (!session) {
      console.log("[StudioPage] No session, redirecting to /auth");
      redirect('/auth');
    }
    return <StudioWizard />;
  } catch (error) {
    console.error('[StudioPage] Authentication error:', error);
    redirect('/auth');
  }
}
