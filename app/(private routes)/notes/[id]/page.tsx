import type { Metadata } from 'next';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

// ================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

// ================================================================

const SITE_URL = 'https://easy-notes-ten.vercel.app';

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;

  let title = 'Note details | EasyNotes';
  let description =
    'View a single note in EasyNotes: title, content, tag and timestamps.';

  try {
    const note = await fetchNoteById(id);

    if (note?.title) {
      title = `${note.title} | EasyNotes`;
    }

    if (note?.content) {
      description = note.content.slice(0, 150);
    }
  } catch {}

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/${id}`,
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
      title,
      description,
      images: ['/note-og-meta.jpg'],
    },
  };
}

// ================================================================

async function NoteDetails({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

export default NoteDetails;
