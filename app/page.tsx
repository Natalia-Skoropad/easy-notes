import type { Metadata } from 'next';
import Image from 'next/image';

import css from './home.module.css';

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

function Home() {
  return (
    <section className={css.hero}>
      <h1 className={css.title}>Welcome to Easy Notes</h1>

      <div className={css.left}>
        <Image
          src="/notes.png"
          alt="Workspace with notes and analytics"
          width={500}
          height={100}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className={css.img}
        />
      </div>

      <div className={css.right}>
        <p className={css.lead}>
          Easy Notes is your secure, minimal workspace for saving, organizing,
          and revisiting ideas. Protected routes, cookie-based sessions, and a
          clean UI keep your notes safe and easy to work with.
        </p>

        <div className={css.highlights}>
          <div className={css.highlightItem}>
            <span className={css.dot} />
            <div>
              <h2>Private & protected</h2>
              <p>
                Access to notes only after authentication with safe cookies.
              </p>
            </div>
          </div>

          <div className={css.highlightItem}>
            <span className={css.dot} />
            <div>
              <h2>Smart browsing</h2>
              <p>Filter by tags, open details in modals, stay in the flow.</p>
            </div>
          </div>

          <div className={css.highlightItem}>
            <span className={css.dot} />
            <div>
              <h2>Modern stack</h2>
              <p>
                Next.js App Router, SSR + CSR, TanStack Query &amp; Zustand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
