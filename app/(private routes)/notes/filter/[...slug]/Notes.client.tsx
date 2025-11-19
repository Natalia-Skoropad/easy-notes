'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { fetchNotes } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';

import { useSearchParams } from 'next/navigation';

import {
  SearchBox,
  Pagination,
  NoteList,
  EmptyState,
  LinkButton,
  Toast,
} from '@/app/components';

import css from './NotesPage.module.css';

//===========================================================================

const PER_PAGE = 12;

function NotesClient({ tag }: { tag?: NoteTag }) {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();

  const [isCreatedToastOpen, setIsCreatedToastOpen] = useState(
    () => searchParams.get('created') === '1'
  );

  useEffect(() => {
    if (!isCreatedToastOpen) return;

    const timer = window.setTimeout(() => {
      setIsCreatedToastOpen(false);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [isCreatedToastOpen]);

  const {
    input: searchInput,
    query: searchRaw,
    onChange: handleSearch,
  } = useDebouncedSearch({ delay: 800, onDebounced: () => setPage(1) });

  const search = searchRaw.trim().length >= 2 ? searchRaw.trim() : '';

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['notes', page, PER_PAGE, search, tag ?? ''],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const errMsg = error instanceof Error ? error.message : undefined;

  const showEmpty = !isLoading && !isFetching && !isError && notes.length === 0;

  const titleText = tag ? `${tag} notes` : 'All notes';

  return (
    <>
      <section className={css.app}>
        <h1 className={css.title}>{titleText}</h1>

        <header className={css.toolbar} aria-label="Notes toolbar">
          <SearchBox
            value={searchInput}
            onChange={handleSearch}
            maxLength={50}
          />

          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}

          <LinkButton href="/notes/action/create" text="Create note +" />
        </header>

        {(isLoading || isFetching) && (
          <p className={css.isLoading}>Loading notes…</p>
        )}

        {isError && <p className={css.isError}>Error: {errMsg}</p>}

        {showEmpty && (
          <EmptyState
            title="Nothing found"
            message={
              search
                ? `No results for '${search}'. Try a different keyword.`
                : tag
                ? `No notes with tag '${tag}' yet.`
                : 'No notes yet.'
            }
          />
        )}

        {notes.length > 0 && <NoteList notes={notes} />}
      </section>

      <Toast
        isOpen={isCreatedToastOpen}
        type="success"
        message="Note created successfully"
        onClose={() => setIsCreatedToastOpen(false)}
      />
    </>
  );
}

export default NotesClient;
