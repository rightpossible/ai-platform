'use client';

import { LandingHeader } from '@/components/landing/landing-header';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}