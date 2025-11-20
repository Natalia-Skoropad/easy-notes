'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';

import { fetchNotes } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';

import {
  SearchBox,
  Pagination,
  NoteList,
  EmptyState,
  LinkButton,
  Toast,
  Button,
  NotesActionsOffcanvas,
} from '@/app/components';

import css from './NotesPage.module.css';

//===========================================================================

const TAGS: NoteTag[] = [
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];

const PER_PAGE = 12;

//===========================================================================

function NotesClient({ tag }: { tag?: NoteTag }) {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isActionsOpen, setIsActionsOpen] = useState(false);
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
          <div className={`${css.searchBoxWrapper} ${css.desktopOnly}`}>
            <SearchBox
              value={searchInput}
              onChange={handleSearch}
              maxLength={50}
            />
          </div>

          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}

          <div className={css.toolbarActions}>
            <div className={css.desktopOnly}>
              <LinkButton href="/notes/action/create" text="Create Note +" />
            </div>

            <div className={css.mobileOnly}>
              <Button
                type="button"
                text="Actions"
                variant="normal"
                onClick={() => setIsActionsOpen(true)}
              />
            </div>
          </div>
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

        <NotesActionsOffcanvas
          isOpen={isActionsOpen}
          onClose={() => setIsActionsOpen(false)}
        >
          <div className={css.actionsSheet}>
            <h2 className={css.sheetTitle}>More actions</h2>

            <Button
              type="button"
              variant="normal"
              text="Create Note +"
              onClick={() => {
                setIsActionsOpen(false);
                router.push('/notes/action/create');
              }}
            />

            <div className={css.sheetDivider} />

            <SearchBox
              value={searchInput}
              onChange={handleSearch}
              maxLength={50}
            />

            <div className={css.sheetDivider} />

            <label className={css.sheetLabel}>
              <span>Filter by tag</span>
              <select
                className={css.sheetSelect}
                value={tag ?? 'all'}
                onChange={event => {
                  const value = event.target.value;

                  const href =
                    value === 'all'
                      ? '/notes/filter/all'
                      : `/notes/filter/${encodeURIComponent(value)}`;

                  router.push(href);
                  setIsActionsOpen(false);
                }}
              >
                <option value="all">All notes</option>
                {TAGS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </NotesActionsOffcanvas>
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
