import type { Metadata } from 'next';
import SignUpClient from './SignUpClient';

//===========================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Sign up | EasyNotes',
  description:
    'Create an EasyNotes account to save, tag and search your personal notes securely.',

  openGraph: {
    title: 'Sign up | EasyNotes',
    description:
      'Create an EasyNotes account to save, tag and search your personal notes securely.',
    url: `${SITE_URL}/sign-up`,
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
    title: 'Sign up | EasyNotes',
    description:
      'Create an EasyNotes account to save, tag and search your personal notes securely.',
    images: ['/note-og-meta.jpg'],
  },
};

//===========================================================================

function SignUpPage() {
  return <SignUpClient />;
}

export default SignUpPage;
