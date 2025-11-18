import type { Metadata } from 'next';
import SignInClient from './SignInClient';

//===========================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Sign in | EasyNotes',
  description:
    'Sign in to your EasyNotes account to access and manage your private notes.',

  openGraph: {
    title: 'Sign in | EasyNotes',
    description:
      'Sign in to your EasyNotes account to access and manage your private notes.',
    url: `${SITE_URL}/sign-in`,
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
    title: 'Sign in | EasyNotes',
    description:
      'Sign in to your EasyNotes account to access and manage your private notes.',
    images: ['/note-og-meta.jpg'],
  },
};

//===========================================================================

function SignInPage() {
  return <SignInClient />;
}

export default SignInPage;
