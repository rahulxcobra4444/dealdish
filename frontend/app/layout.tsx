import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['400', '500', '600', '700', '900'], style: ['normal', 'italic'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['500', '700'] });

import { ToastProvider } from '@/components/ToastProvider';
import ClientShell from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'DealDish — Restaurant Deals in Siliguri',
  description: "Siliguri's best restaurant deals platform. Save up to 50% on dining at verified restaurants.",
  icons: { icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍽</text></svg>' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ToastProvider>
          <ClientShell>{children}</ClientShell>
        </ToastProvider>
      </body>
    </html>
  );
}
