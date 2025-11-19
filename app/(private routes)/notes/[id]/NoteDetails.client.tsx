'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import {
  Breadcrumbs,
  LinkButton,
  Button,
  ConfirmDialog,
} from '@/app/components';

import { deleteNote, fetchNoteById } from '@/lib/api/clientApi';
import { getTagStyle } from '@/lib/store/tagStyles';

import css from './NoteDetails.module.css';

// ================================================================

function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const router = useRouter();
  const queryClient = useQueryClient();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

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

  const { mutateAsync: deleteNoteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.removeQueries({ queryKey: ['note', id] });

      toast.success('Note deleted successfully');
      router.push('/notes/filter/all');
    },
    onError: err => {
      const msg = err instanceof Error ? err.message : 'Failed to delete note';
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <section className={css.section}>
        <p className={css.isLoading}>Loading, please wait...</p>
      </section>
    );
  }

  if (isError || !note) {
    return (
      <section className={css.section}>
        <p className={css.isError}>Something went wrong.</p>
      </section>
    );
  }

  const created = new Date(note.createdAt).toLocaleString();
  const updatedRaw =
    note.updatedAt && note.updatedAt !== note.createdAt
      ? new Date(note.updatedAt).toLocaleString()
      : null;

  const handleDeleteConfirm = async () => {
    if (!id) return;
    setIsConfirmDeleteOpen(false);
    await deleteNoteMutate(id);
  };

  return (
    <section className={css.section}>
      <div className={css.breadcrumbs}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'All notes', href: '/notes/filter/all' },
            { label: note.title || 'Note details' },
          ]}
        />
      </div>

      <div className={css.card}>
        <header className={css.header}>
          <div>
            <div className={css.badge}>Note details</div>
            <h1 className={css.title}>{note.title}</h1>
          </div>

          {note.tag && (
            <span className={css.tag} style={getTagStyle(note.tag)}>
              {note.tag}
            </span>
          )}
        </header>

        <p className={css.content}>{note.content}</p>

        <div className={css.metaRow}>
          <span className={css.metaLabel}>Created</span>
          <span className={css.metaValue}>{created}</span>

          {updatedRaw && (
            <>
              <span className={css.metaSeparator}>•</span>
              <span className={css.metaLabel}>Updated</span>
              <span className={css.metaValue}>{updatedRaw}</span>
            </>
          )}
        </div>

        <div className={css.actions}>
          <Button
            text={isDeleting ? 'Deleting…' : 'Delete'}
            variant="delete"
            type="button"
            onClick={() => setIsConfirmDeleteOpen(true)}
            disabled={isDeleting}
          />
          <LinkButton
            href={`/notes/${note.id}/edit`}
            text="Edit Note"
            variant="normal"
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting…' : 'Yes, delete'}
        cancelText="Cancel"
        confirmVariant="delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </section>
  );
}

export default NoteDetailsClient;
