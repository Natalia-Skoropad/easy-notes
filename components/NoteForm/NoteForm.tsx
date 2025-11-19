'use client';

import { useId, useState } from 'react';
import * as Yup from 'yup';

import type { NoteTag } from '@/types/note';
import type { CreateNoteInput } from '@/lib/api/clientApi';
import { Button } from '@/app/components';

import css from './NoteForm.module.css';

// --------------------------------------------------
// Типи
// --------------------------------------------------

type NoteFormValues = CreateNoteInput;

type FieldErrors = Partial<Record<keyof NoteFormValues, string>>;

interface NoteFormProps {
  mode: 'create' | 'edit';
  tags: NoteTag[];
  initialValues: NoteFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: NoteFormValues) => Promise<void> | void;
  onCancel: () => void;
  /** опціонально — щоб зберігати драфт зовні (create) */
  onChange?: (values: NoteFormValues) => void;
}

// --------------------------------------------------
// Схема валідації
// --------------------------------------------------

const buildSchema = (tags: NoteTag[]) =>
  Yup.object({
    title: Yup.string()
      .trim()
      .min(3, 'Title too short')
      .max(50, 'Title too long')
      .required('Title is required'),
    content: Yup.string()
      .trim()
      .min(5, 'Content too short')
      .max(500, 'Content too long')
      .required('Content is required'),
    tag: Yup.mixed<NoteTag>().oneOf(tags, 'Invalid tag').required('Select tag'),
  });

/* ====================================================================== */

function NoteForm({
  tags,
  mode,
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
  onChange,
}: NoteFormProps) {
  const fieldId = useId();

  // Локальний стан форми (і НІЯКИХ useEffect)
  const [values, setValues] = useState<NoteFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});

  const schema = buildSchema(tags);

  const validateField = async (
    name: keyof NoteFormValues,
    next: NoteFormValues
  ) => {
    try {
      await schema.validateAt(name as string, next);
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
    const key = name as keyof NoteFormValues;

    const next = { ...values, [key]: value } as NoteFormValues;

    setValues(next);
    onChange?.(next); // щоб зберігати драфт при створенні

    await validateField(key, next);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const valid = (await schema.validate(values, {
        abortEarly: false,
      })) as NoteFormValues;

      await onSubmit(valid);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const collected: FieldErrors = {};
        for (const e of err.inner) {
          if (e.path) collected[e.path as keyof NoteFormValues] = e.message;
        }
        setErrors(collected);
      }
    }
  };

  const isFormValid =
    schema.isValidSync(values) && !Object.values(errors).some(Boolean);

  const isDisabled = isSubmitting || !isFormValid;

  const submitText =
    mode === 'create'
      ? isSubmitting
        ? 'Creating…'
        : 'Create'
      : isSubmitting
      ? 'Saving…'
      : 'Save changes';

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label className={css.label} htmlFor={`${fieldId}-title`}>
          <span>Title*</span>
          <input
            id={`${fieldId}-title`}
            className={`${css.input} ${errors.title ? css.inputError : ''}`}
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            required
            maxLength={50}
            aria-invalid={!!errors.title}
          />
          {errors.title && <span className={css.error}>{errors.title}</span>}
        </label>
      </div>

      <div className={css.formGroup}>
        <label className={css.label} htmlFor={`${fieldId}-content`}>
          <span>Content*</span>
          <textarea
            id={`${fieldId}-content`}
            className={`${css.textarea} ${
              errors.content ? css.textareaError : ''
            }`}
            name="content"
            value={values.content}
            onChange={handleChange}
            required
            rows={8}
            maxLength={500}
            aria-invalid={!!errors.content}
          />
          {errors.content && (
            <span className={css.error}>{errors.content}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label className={css.label} htmlFor={`${fieldId}-tag`}>
          <span>Tag*</span>
          <select
            id={`${fieldId}-tag`}
            className={`${css.select} ${errors.tag ? css.selectError : ''}`}
            name="tag"
            value={values.tag}
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
        </label>
      </div>

      <div className={css.actions}>
        <Button type="submit" text={submitText} disabled={isDisabled} />
        <Button
          type="button"
          variant="cancel"
          onClick={onCancel}
          text="Cancel"
        />
      </div>
    </form>
  );
}

export default NoteForm;
