'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { Breadcrumbs, LinkButton } from '@/app/components';
import { fetchNoteById } from '@/lib/api/clientApi';
import { getTagStyle } from '@/lib/store/tagStyles';

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

  return (
    <section className={css.section}>
      <div className={css.breadcrumbs}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'All notes', href: '/notes/filter/all' },
            { label: 'Note details' },
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
          <LinkButton
            href={`/notes/filter/all`}
            text="All Notes"
            variant="normal"
          />
          <LinkButton
            href={`/notes/${note.id}/edit`}
            text="Edit Note"
            variant="cancel"
          />
        </div>
      </div>
    </section>
  );
}

export default NoteDetailsClient;
