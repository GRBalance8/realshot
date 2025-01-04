// src/app/account/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account | RealShot',
  description: 'Manage your RealShot services and orders',
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
