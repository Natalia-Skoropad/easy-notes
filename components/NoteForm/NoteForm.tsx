'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Category, createNote, NewNoteData } from '@/lib/api/clientApi';
import { useNoteDraftStore } from '@/lib/stores/noteStore';
import { Button } from '@/app/components';

import css from './NoteForm.module.css';

//===========================================================================

interface NoteFormProps {
  categories: Category[];
}

//===========================================================================

function NoteForm({ categories }: NoteFormProps) {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: NewNoteData) => createNote(data),
    onSuccess: () => {
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as NewNoteData;
    mutate(values);
  };

  const handleCancel = () => router.push('/notes/filter/all');

  return (
    <form className={css.form} action={handleSubmit}>
      <label className={css.label}>
        Title
        <input
          type="text"
          name="title"
          defaultValue={draft?.title}
          onChange={handleChange}
          required
        />
      </label>

      <label className={css.label}>
        Content
        <textarea
          name="content"
          defaultValue={draft?.content}
          onChange={handleChange}
          required
        />
      </label>

      <label className={css.label}>
        Category
        <select
          name="categoryId"
          defaultValue={draft?.categoryId || ''}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Choose category…
          </option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <Button type="submit" text={isPending ? 'Creating…' : 'Create'} />
        <Button
          type="button"
          variant="cancel"
          onClick={handleCancel}
          text="Cancel"
        />
      </div>
    </form>
  );
}

export default NoteForm;
