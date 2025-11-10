import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { getSingleNote } from '@/lib/api/clientApi';
import NoteDetailsClient from './NoteDetails.client';
import type { Metadata } from 'next';

//===========================================================================

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

//===========================================================================

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getSingleNote(id);

  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 30),

    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://notehub.com/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${note.title}`,
      description: note.content.slice(0, 3),
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

//===========================================================================

async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => getSingleNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

export default NoteDetails;
