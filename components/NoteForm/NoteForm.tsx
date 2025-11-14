'use client';

import { useId, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

import { createNote, type CreateNoteInput } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import { Button } from '@/app/components';

import css from './NoteForm.module.css';

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

type FieldErrors = Partial<Record<keyof CreateNoteInput, string>>;

interface NoteFormProps {
  tags: NoteTag[];
}

//===========================================================================

const schema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, 'Title too short')
    .max(50, 'Title too long')
    .required('Title is required'),
  content: Yup.string()
    .trim()
    .max(500, 'Content too long')
    .required('Content is required'),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS, 'Invalid tag').required('Select tag'),
});

//===========================================================================

function NoteForm({ tags }: NoteFormProps) {
  const router = useRouter();
  const fieldId = useId();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();
  const [errors, setErrors] = useState<FieldErrors>({});

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateNoteInput) => createNote(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      toast.success('Note created successfully');
      router.back();
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create note';
      toast.error(msg);
    },
  });

  const validateField = async (
    name: keyof CreateNoteInput,
    next: CreateNoteInput
  ) => {
    try {
      await schema.validateAt(name, next);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (err) {
      const msg =
        err instanceof Yup.ValidationError ? err.message : 'Invalid value';
      setErrors(prev => ({ ...prev, [name]: msg }));
    }
  };

  const handleChange = async (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    const next = { ...draft, [name]: value } as CreateNoteInput;
    setDraft(next);
    await validateField(name as keyof CreateNoteInput, next);
  };

  const handleSubmit = async (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as CreateNoteInput;
    try {
      await schema.validate(values, { abortEarly: false });
      await mutateAsync(values);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const collected: FieldErrors = {};
        for (const e of err.inner) {
          if (e.path) collected[e.path as keyof CreateNoteInput] = e.message;
        }
        setErrors(collected);
      }
    }
  };

  const isFormValid = schema.isValidSync(draft);
  const cancel = () => router.back();

  return (
    <form className={css.form} action={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title*</label>
        <input
          id={`${fieldId}-title`}
          className={css.input}
          type="text"
          name="title"
          value={draft.title}
          onChange={handleChange}
          required
          maxLength={50}
          aria-invalid={!!errors.title}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content*</label>
        <textarea
          id={`${fieldId}-content`}
          className={css.textarea}
          name="content"
          value={draft.content}
          onChange={handleChange}
          required
          rows={8}
          maxLength={500}
          aria-invalid={!!errors.content}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag*</label>
        <select
          id={`${fieldId}-tag`}
          className={css.select}
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          required
          aria-invalid={!!errors.tag}
        >
          <option value="" disabled>
            Choose tag…
          </option>
          {tags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <Button
          type="submit"
          text={isPending ? 'Creating…' : 'Create'}
          disabled={isPending || !isFormValid}
        />

        <Button type="button" variant="cancel" onClick={cancel} text="Cancel" />
      </div>
    </form>
  );
}

export default NoteForm;
