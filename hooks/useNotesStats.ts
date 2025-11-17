'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';

//===============================================================

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

//===============================================================

export type NotesStats = {
  total: number;
  byTag: Record<NoteTag, number>;
};

//===============================================================

export function useNotesStats(enabled = true) {
  return useQuery<NotesStats>({
    queryKey: ['notes', 'stats'],
    enabled,
    staleTime: 60_000,
    queryFn: async () => {
      const firstPage = await fetchNotes({ page: 1 });
      const allNotes = [...firstPage.items];

      const perPage = firstPage.perPage;
      const totalPages = firstPage.totalPages;

      if (totalPages > 1) {
        const promises: Array<ReturnType<typeof fetchNotes>> = [];

        for (let page = 2; page <= totalPages; page += 1) {
          promises.push(fetchNotes({ page, perPage }));
        }

        const restPages = await Promise.all(promises);

        for (const page of restPages) {
          allNotes.push(...page.items);
        }
      }

      const byTag = TAGS.reduce((acc, tag) => {
        acc[tag] = 0;
        return acc;
      }, {} as Record<NoteTag, number>);

      for (const note of allNotes) {
        if (byTag[note.tag] !== undefined) {
          byTag[note.tag] += 1;
        }
      }

      return {
        total: allNotes.length,
        byTag,
      };
    },
  });
}
