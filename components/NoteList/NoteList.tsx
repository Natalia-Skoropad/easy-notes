'use client';

import { useState, KeyboardEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast as hotToast } from 'react-hot-toast';

import type { Note } from '@/types/note';
import { deleteNote } from '@/lib/api/clientApi';
import { getTagStyle } from '@/lib/store/tagStyles';
import { Button, ConfirmDialog, Toast } from '@/app/components';

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
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeletedToastOpen, setIsDeletedToastOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsDeletedToastOpen(true);
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete note';
      hotToast.error(msg);
    },

    onSettled: () => {
      setPendingId(null);
      setConfirmId(null);
      setIsConfirmOpen(false);
    },
  });

  const handleDeleteConfirmed = async () => {
    if (!confirmId) return;
    try {
      setPendingId(confirmId);
      await mutateAsync(confirmId);
    } catch {}
  };

  const openDeleteDialog = (id: string) => {
    setConfirmId(id);
    setIsConfirmOpen(true);
  };

  const openDetails = (id: string) => {
    router.push(`/notes/${id}`);
  };

  const openEdit = (
    id: string,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (event) {
      event.stopPropagation();
    }
    router.push(`/notes/${id}/edit`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails(id);
    }
  };

  if (notes.length === 0) return null;

  return (
    <>
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
              <span className={css.tag} style={getTagStyle(tag)}>
                {tag}
              </span>

              <div className={css.actionsRight}>
                <Button
                  text={pendingId === id && isPending ? 'Deleting…' : 'Delete'}
                  variant="delete"
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    openDeleteDialog(id);
                  }}
                  disabled={pendingId === id && isPending}
                />
                <Button
                  type="button"
                  variant="normal"
                  text="Edit"
                  onClick={event => openEdit(id, event)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText={isPending ? 'Deleting…' : 'Yes, delete'}
        cancelText="Cancel"
        confirmVariant="delete"
        onCancel={() => {
          if (isPending) return;
          setIsConfirmOpen(false);
          setConfirmId(null);
        }}
        onConfirm={handleDeleteConfirmed}
      />

      <Toast
        isOpen={isDeletedToastOpen}
        type="success"
        message="Note deleted successfully"
        onClose={() => setIsDeletedToastOpen(false)}
      />
    </>
  );
}

export default NoteList;
