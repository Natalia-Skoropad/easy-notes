'use client';

import { useState, KeyboardEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import type { Note } from '@/types/note';
import { deleteNote } from '@/lib/api/clientApi';
import { Button } from '@/app/components';

import css from './NoteList.module.css';

// ================================================================

interface NoteListProps {
  notes: Note[];
}

// ================================================================

function NoteList({ notes }: NoteListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete note';
      toast.error(msg);
    },

    onSettled: () => setPendingId(null),
  });

  const handleDelete = async (id: string) => {
    try {
      setPendingId(id);
      await mutateAsync(id);
    } catch {
      // handled in onError
    }
  };

  const openDetails = (id: string) => {
    router.push(`/notes/${id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails(id);
    }
  };

  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li
          key={id}
          className={css.listItem}
          onClick={() => openDetails(id)}
          onKeyDown={event => handleKeyDown(event, id)}
          role="button"
          tabIndex={0}
        >
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>

            <Button
              text={pendingId === id ? 'Deleting…' : 'Delete'}
              variant="delete"
              type="button"
              onClick={event => {
                event.stopPropagation();
                void handleDelete(id);
              }}
              disabled={pendingId === id || isPending}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
