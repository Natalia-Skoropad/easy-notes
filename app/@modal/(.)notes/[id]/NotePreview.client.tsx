'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api/clientApi';
import { getTagStyle } from '@/lib/store/tagStyles';
import { Modal, Button } from '@/app/components';

import css from './NotePreview.module.css';

//===========================================================================

function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

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

  const close = () => router.back();

  return (
    <Modal onClose={close}>
      <div className={css.container}>
        {isLoading && (
          <div className={css.modalLoading}>
            <div className={css.spinner} />
            <p className={css.isLoading}>Loading, please wait...</p>
          </div>
        )}

        {!isLoading && (isError || !note) && (
          <p className={css.isError}>Something went wrong.</p>
        )}

        {!isLoading && !isError && note && (
          <div className={css.card}>
            <header className={css.header}>
              <div className={css.titleBlock}>
                <span className={css.badge}>Note details</span>
                <h2 className={css.title}>{note.title}</h2>
              </div>

              {note.tag && (
                <span className={css.tag} style={getTagStyle(note.tag)}>
                  {note.tag}
                </span>
              )}
            </header>

            <p className={css.content}>{note.content}</p>

            <p className={css.date}>
              Created{' '}
              <span className={css.dateValue}>
                {new Date(note.createdAt).toLocaleString()}
              </span>
            </p>

            <div className={css.actions}>
              <Button text="Close" variant="cancel" onClick={close} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default NotePreviewClient;
