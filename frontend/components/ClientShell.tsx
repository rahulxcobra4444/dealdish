'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const DASHBOARD_ROUTES = ['/dashboard', '/admin'];

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_ROUTES.some(r => pathname.startsWith(r));

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div id="app">{children}</div>
      <Footer />
    </>
  );
}
