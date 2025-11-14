import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import type { Metadata } from 'next';

import { fetchNotes } from '@/lib/api/serverApi';
import type { NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

//===========================================================================

const PER_PAGE = 12;
const SITE_URL = 'https://09-auth-henna-seven.vercel.app';

interface NotesByTagPageProps {
  params: Promise<{ slug?: string[] }>;
}

//===========================================================================

export async function generateMetadata({
  params,
}: NotesByTagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const maybe = slug?.[0];

  const tagOrAll =
    !maybe || maybe === 'all' ? 'All' : decodeURIComponent(maybe);
  const title =
    tagOrAll === 'All' ? 'All notes | NoteHub' : `${tagOrAll} notes | NoteHub`;
  const description =
    tagOrAll === 'All'
      ? 'Browse all notes with search and pagination.'
      : `Browse notes tagged "${tagOrAll}".`;
  const url = `${SITE_URL}/notes/filter/${
    tagOrAll === 'All' ? 'all' : encodeURIComponent(tagOrAll)
  }`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: tagOrAll === 'All' ? 'All notes' : `${tagOrAll} notes`,
        },
      ],
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

//===========================================================================

async function NotesByTagPage({ params }: NotesByTagPageProps) {
  const { slug } = await params;
  const maybeTag = slug?.[0];

  const tag =
    !maybeTag || maybeTag === 'all'
      ? undefined
      : (decodeURIComponent(maybeTag) as NoteTag);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, PER_PAGE, '', tag ?? ''],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

export default NotesByTagPage;
