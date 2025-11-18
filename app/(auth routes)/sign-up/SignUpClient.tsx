'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import * as Yup from 'yup';

import { register, updateMe, type RegisterRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { ApiError } from '@/app/api/api';
import { Button, Breadcrumbs } from '@/app/components';

import css from './page.module.css';

//===========================================================================

const signUpSchema = Yup.object({
  username: Yup.string()
    .transform(value => ((value ?? '').trim() === '' ? undefined : value))
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'No more than 20 characters')
    .notRequired(),
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'No more than 20 characters')
    .required('Password is required'),
});

type SignUpForm = {
  username?: string;
  email: string;
  password: string;
};

//===========================================================================

function SignUpClient() {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState<SignUpForm>({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpForm, string>>
  >({});
  const [authError, setAuthError] = useState('');

  const validateField = async (name: keyof SignUpForm, value: string) => {
    try {
      await signUpSchema.validateAt(name as string, {
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
    const field = name as keyof SignUpForm;
    setValues(prev => ({ ...prev, [field]: value }));
    setAuthError('');
    void validateField(field, value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');

    try {
      const valid = (await signUpSchema.validate(values, {
        abortEarly: false,
      })) as SignUpForm;

      setErrors({});

      const payload: RegisterRequest = {
        email: valid.email,
        password: valid.password,
      };

      const user = await register(payload);
      setUser(user);

      if (valid.username) {
        try {
          const updated = await updateMe({ username: valid.username });
          setUser(updated);
        } catch (updateErr) {
          console.error('Failed to update username', updateErr);
        }
      }

      router.push('/profile');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Partial<Record<keyof SignUpForm, string>> = {};

        err.inner.forEach(issue => {
          const path = issue.path as keyof SignUpForm | undefined;
          if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
        });

        setErrors(fieldErrors);
        return;
      }

      const apiErr = err as ApiError;

      if (apiErr.response?.status === 409) {
        setAuthError('This email is already registered.');
        return;
      }

      setAuthError(
        apiErr.response?.data?.error ??
          apiErr.message ??
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <section className={css.section}>
      <div className={css.breadcrumbs}>
        <Breadcrumbs
          items={[
            {
              label: 'Home',
              href: '/',
            },
            { label: 'Sign up' },
          ]}
        />
      </div>

      <div className={css.card}>
        <h1 className={css.title}>Sign Up</h1>
        <p className={css.subtitle}>
          Sign up to sync your notes securely across sessions.
        </p>

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

          <label className={css.label}>
            <span>Email*</span>
            <input
              className={`${css.input} ${errors.email ? css.inputError : ''}`}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className={css.errorField}>{errors.email}</span>
            )}
          </label>

          <label className={css.label}>
            <span>Password*</span>
            <div className={css.passwordField}>
              <input
                className={`${css.input} ${
                  errors.password ? css.inputError : ''
                } ${css.passwordInput}`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className={css.passwordToggle}
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className={css.passwordIcon} />
                ) : (
                  <Eye className={css.passwordIcon} />
                )}
              </button>
            </div>
            {errors.password && (
              <span className={css.errorField}>{errors.password}</span>
            )}
          </label>

          {authError && <p className={css.errorCommon}>{authError}</p>}
          <Button type="submit" text="Sign Up" variant="normal" />
        </form>

        <p className={css.helper}>
          Already have an account?{' '}
          <Link href="/sign-in" className={css.link}>
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignUpClient;
