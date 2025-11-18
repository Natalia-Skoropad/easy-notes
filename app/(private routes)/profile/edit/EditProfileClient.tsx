'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

import { Button, Breadcrumbs } from '@/app/components';
import { getMe, updateMe } from '@/lib/api/clientApi';

import css from './profileEdit.module.css';

//===========================================================================

type EditForm = {
  username: string;
};

const editProfileSchema = Yup.object({
  username: Yup.string()
    .transform(value => ((value ?? '').trim() === '' ? undefined : value))
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'No more than 20 characters')
    .notRequired(),
});

//===========================================================================

function EditProfileClient() {
  const router = useRouter();

  const [values, setValues] = useState<EditForm>({ username: '' });
  const [initialValues, setInitialValues] = useState<EditForm>({
    username: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EditForm, string>>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [initials, setInitials] = useState('U');

  // --------------------------------------------------
  // load current user
  // --------------------------------------------------

  useEffect(() => {
    getMe()
      .then(user => {
        const username = user.username ?? '';

        setValues({ username });
        setInitialValues({ username });

        const fromUsername =
          user.username
            ?.split(' ')
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || '';

        const fromEmail = user.email?.[0]?.toUpperCase() ?? '';

        setInitials(fromUsername || fromEmail || 'U');
      })
      .catch(() => {});
  }, []);

  // --------------------------------------------------
  // validation
  // --------------------------------------------------

  const validateField = async (name: keyof EditForm, value: string) => {
    try {
      await editProfileSchema.validateAt(name as string, {
        ...values,
        [name]: value,
      });
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof EditForm;

    setValues(prev => ({ ...prev, [field]: value }));
    void validateField(field, value);
  };

  const hasChanges = values.username.trim() !== initialValues.username.trim();

  // --------------------------------------------------
  // submit
  // --------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hasChanges) return;

    setIsSaving(true);

    try {
      const valid = (await editProfileSchema.validate(values, {
        abortEarly: false,
      })) as EditForm;

      const trimmed = valid.username?.trim();

      if (!trimmed) {
        setIsSaving(false);
        return;
      }
      await updateMe({ username: trimmed });

      router.push('/profile');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Partial<Record<keyof EditForm, string>> = {};

        err.inner.forEach(issue => {
          const path = issue.path as keyof EditForm | undefined;
          if (path && !fieldErrors[path]) {
            fieldErrors[path] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        console.error('Oops, some error:', err);
      }

      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  const isSaveDisabled = isSaving || !hasChanges || Boolean(errors.username);

  // --------------------------------------------------
  // render
  // --------------------------------------------------

  return (
    <section className={css.section}>
      <div className={css.breadcrumbs}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Profile details', href: '/profile' },
            { label: 'Profile edit' },
          ]}
        />
      </div>

      <div className={css.card}>
        <div className={css.headerRow}>
          <div className={css.titleBox}>
            <div className={css.badge}>Profile settings</div>
            <h1 className={css.title}>Profile Edit</h1>
            <p className={css.subtitle}>
              Update your display name used across EasyNotes.
            </p>
          </div>

          {/* Avatar preview */}
          <div className={css.avatarArea}>
            <div className={css.avatarWrap}>
              <div className={css.avatarStub}>{initials}</div>
            </div>
          </div>
        </div>

        <form className={css.form} onSubmit={handleSubmit} noValidate>
          <label className={css.label}>
            <span>Username</span>
            <input
              className={`${css.input} ${
                errors.username ? css.inputError : ''
              }`}
              type="text"
              name="username"
              placeholder="Your name"
              value={values.username}
              onChange={handleChange}
            />
            {errors.username && (
              <span className={css.errorField}>{errors.username}</span>
            )}
          </label>

          <div className={css.actions}>
            <Button
              type="submit"
              text={isSaving ? 'Saving…' : 'Save changes'}
              disabled={isSaveDisabled}
            />

            <Button
              type="button"
              variant="cancel"
              text="Cancel"
              onClick={handleCancel}
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditProfileClient;
