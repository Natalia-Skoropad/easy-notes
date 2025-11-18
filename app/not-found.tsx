import type { Metadata } from 'next';
import Link from 'next/link';

import css from './not-found.module.css';

//===========================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export const metadata: Metadata = {
  title: '404 — Page not found | EasyNotes',
  description: 'The page you are looking for does not exist.',

  openGraph: {
    title: '404 — Page not found | EasyNotes',
    description: 'The page you are looking for does not exist.',
    url: `${SITE_URL}/404`,
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
    title: '404 — Page not found | EasyNotes',
    description: 'The page you are looking for does not exist.',
    images: ['/note-og-meta.jpg'],
  },
};

//===========================================================================

function NotFound() {
  return (
    <section className={css.container}>
      <div className={css.card}>
        <p className={css.code}>404</p>
        <h1 className={css.title}>Page not found</h1>
        <p className={css.description}>
          The page you’re looking for doesn’t exist, was moved, or the link is
          incorrect. Try going back to the dashboard or explore your notes.
        </p>

        <div className={css.actions}>
          <Link href="/notes/filter/all" className={css.primaryLink}>
            Go to all notes
          </Link>
          <Link href="/" className={css.secondaryLink}>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
