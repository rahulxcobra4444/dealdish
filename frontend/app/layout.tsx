import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
import { ToastProvider } from '@/components/ToastProvider';
import ClientShell from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'DealDish — Restaurant Deals Marketplace',
  description: "Mumbai's #1 restaurant deals platform. Save up to 50% on dining at 500+ verified restaurants.",
  icons: { icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍽</text></svg>' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={playfair.variable}>
      <body>
        <ToastProvider>
          <ClientShell>{children}</ClientShell>
        </ToastProvider>
      </body>
    </html>
  );
}
