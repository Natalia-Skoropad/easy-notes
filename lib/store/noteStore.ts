import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CreateNoteInput } from '../api/clientApi';

//===========================================================================

interface NoteDraftStore {
  draft: CreateNoteInput;
  setDraft: (note: CreateNoteInput) => void;
  clearDraft: () => void;
}

const initialDraft: CreateNoteInput = {
  title: '',
  content: '',
  tag: 'Todo',
};

//===========================================================================

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),

    {
      name: 'note-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);
