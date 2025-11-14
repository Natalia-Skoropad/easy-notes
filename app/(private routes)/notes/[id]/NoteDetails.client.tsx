'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';

import css from './NoteDetails.module.css';

// ================================================================

function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id!),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  if (isLoading)
    return <p className={css.isLoading}>Loading, please wait...</p>;
  if (isError || !note)
    return <p className={css.isError}>Something went wrong.</p>;

  const created = new Date(note.createdAt).toLocaleString();

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{created}</p>
      </div>
    </div>
  );
}

export default NoteDetailsClient;
