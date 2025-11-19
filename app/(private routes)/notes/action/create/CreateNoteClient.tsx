'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import type { NoteTag } from '@/types/note';
import { createNote, type CreateNoteInput } from '@/lib/api/clientApi';
import { NoteForm, Breadcrumbs } from '@/app/components';
import { useNoteDraftStore } from '@/lib/store/noteStore';

import css from './CreateNote.module.css';

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

//===========================================================================

function CreateNoteClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateNoteInput) => createNote(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all?created=1');
    },

    onError: err => {
      console.error(err);
    },
  });

  const handleSubmit = async (values: CreateNoteInput) => {
    await mutateAsync(values);
  };

  const handleCancel = () => router.back();

  const handleChange = (values: CreateNoteInput) => {
    setDraft(values);
  };

  return (
    <main className={css.main}>
      <div className={css.breadcrumbs}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'All notes', href: '/notes/filter/all' },
            { label: 'Create note' },
          ]}
        />
      </div>

      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>

        <NoteForm
          mode="create"
          tags={TAGS}
          initialValues={draft}
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onChange={handleChange}
        />
      </div>
    </main>
  );
}

export default CreateNoteClient;
