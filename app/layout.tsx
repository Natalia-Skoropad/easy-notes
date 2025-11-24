import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import {
  Header,
  Footer,
  TanStackProvider,
  AuthProvider,
} from '@/app/components';

import './globals.css';
import css from './layout.module.css';

//===========================================================================

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

//===========================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'EasyNotes | Simple notes app',
  description:
    'Create, search and manage personal notes with tags, filters and previews.',

  openGraph: {
    title: 'EasyNotes | Simple notes app',
    description:
      'Create, search and manage personal notes with tags, filters and previews.',
    url: SITE_URL,
    siteName: 'EasyNotes',
    images: [
      {
        url: '/note-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'EasyNotes',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'EasyNotes | Simple notes app',
    description:
      'Create, search and manage personal notes with tags, filters and previews.',
    images: ['/note-og-meta.jpg'],
  },
};

//===========================================================================

function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />

      <body className={montserrat.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <div className="container">
              <main className={css.main}>
                <div className={css.container}>
                  {children}
                  {modal}
                </div>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

export default RootLayout;
