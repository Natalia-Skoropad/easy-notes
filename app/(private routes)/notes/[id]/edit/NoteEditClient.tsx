'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { Breadcrumbs, NoteForm, ConfirmDialog, Toast } from '@/app/components';

import {
  fetchNoteById,
  updateNote,
  type CreateNoteInput,
} from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';

import css from './noteEdit.module.css';

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

type NoteFormValues = CreateNoteInput;

//===========================================================================

function NoteEditClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<NoteFormValues | null>(
    null
  );
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(false);

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
  });

  const { mutateAsync: updateNoteMutate, isPending: isSaving } = useMutation({
    mutationFn: (payload: NoteFormValues) => updateNote(id!, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', id] });

      // відкриваємо наш кастомний тост
      setIsSuccessToastOpen(true);
      // юзер лишається на цій сторінці
    },

    onError: err => {
      const msg = err instanceof Error ? err.message : 'Failed to update note';
      // для помилки можна залишити глобальний hot-toast
      toast.error(msg);
    },
  });

  // стани завантаження / помилки
  if (isLoading) {
    return (
      <main className={css.main}>
        <p className={css.isLoading}>Loading, please wait...</p>
      </main>
    );
  }

  if (isError || !note) {
    return (
      <main className={css.main}>
        <p className={css.isError}>Could not load note.</p>
      </main>
    );
  }

  const initialValues: NoteFormValues = {
    title: note.title,
    content: note.content ?? '',
    tag: note.tag,
  };

  // натиснули Submit у формі — просимо підтвердження
  const handleRequestSubmit = (values: NoteFormValues) => {
    setPendingValues(values);
    setIsConfirmSaveOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingValues) return;
    await updateNoteMutate(pendingValues);
    setIsConfirmSaveOpen(false);
  };

  const handleCancel = () => {
    // йдемо прямо на список нотаток, без модалки
    router.push('/notes/filter/all');
  };

  return (
    <main className={css.main}>
      <div className={css.breadcrumbs}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'All notes', href: '/notes/filter/all' },
            { label: note.title || 'Edit note' },
          ]}
        />
      </div>

      <div className={css.container}>
        <h1 className={css.title}>Edit note</h1>

        <NoteForm
          mode="edit"
          tags={TAGS}
          initialValues={initialValues}
          isSubmitting={isSaving}
          onSubmit={handleRequestSubmit}
          onCancel={handleCancel}
        />
      </div>

      {/* попап підтвердження збереження */}
      <ConfirmDialog
        isOpen={isConfirmSaveOpen}
        title="Save changes"
        message="Are you sure you want to save changes to this note?"
        confirmText={isSaving ? 'Saving…' : 'Yes, save'}
        cancelText="Cancel"
        confirmVariant="normal"
        onConfirm={handleConfirmSave}
        onCancel={() => setIsConfirmSaveOpen(false)}
      />

      {/* тост про успішне збереження */}
      <Toast
        isOpen={isSuccessToastOpen}
        type="success"
        message="Note updated successfully"
        onClose={() => setIsSuccessToastOpen(false)}
      />
    </main>
  );
}

export default NoteEditClient;
