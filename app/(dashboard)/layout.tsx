import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <section className="flex flex-col min-h-screen">
      {children}
    </section>
  );
}
