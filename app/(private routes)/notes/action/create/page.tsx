import type { Metadata } from 'next';
import CreateNoteClient from './CreateNoteClient';

//===========================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Create note | EasyNotes',
  description:
    'Create a new note in EasyNotes by adding a title, content and tag to keep your ideas organized.',
  openGraph: {
    title: 'Create note | EasyNotes',
    description:
      'Create a new note in EasyNotes by adding a title, content and tag to keep your ideas organized.',
    url: `${SITE_URL}/notes/action/create`,
    siteName: 'EasyNotes',
    images: [
      {
        url: '/note-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'EasyNotes',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create note | EasyNotes',
    description:
      'Create a new note in EasyNotes by adding a title, content and tag to keep your ideas organized.',
    images: ['/note-og-meta.jpg'],
  },
};

//===========================================================================

function CreateNotePage() {
  return <CreateNoteClient />;
}

export default CreateNotePage;
