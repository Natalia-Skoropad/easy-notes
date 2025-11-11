'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

import { getSingleNote } from '@/lib/api/clientApi';
import { Button } from '@/app/components';

import css from './NoteDetails.module.css';

//===========================================================================

function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => getSingleNote(id!),
    refetchOnMount: false,
  });

  const handleGoBack = () => {
    const isSure = confirm('Are you sure?');
    if (isSure) {
      router.back();
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !note)
    return <p>Failed to load note. Please try again later.</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${note.updatedAt}`
    : `Created at: ${note.createdAt}`;

  return (
    <div className={css.wrap}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.body}>{note.content}</p>
      <p className={css.meta}>{formattedDate}</p>

      <Button onClick={handleGoBack} text="Back" />
    </div>
  );
}

export default NoteDetailsClient;
