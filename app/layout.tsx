import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: `${APP_NAME} - Professional VTU & Data Services`,
  description:
    'Buy data, airtime, and manage your wallet with VAULT DATA. Fast, secure, and affordable VTU services for all networks.',
  keywords: 'VTU, data, airtime, data bundles, Nigeria, Paystack',
  openGraph: {
    title: `${APP_NAME} - Professional VTU & Data Services`,
    description:
      'Buy data, airtime, and manage your wallet with VAULT DATA. Fast, secure, and affordable VTU services.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
