'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as Yup from 'yup';

import { login, type LoginRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { ApiError } from '@/app/api/api';
import { Button } from '@/app/components';

import css from './page.module.css';

//===========================================================================

const signInSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'No more than 20 characters')
    .required('Password is required'),
});

type SignInForm = LoginRequest;

//===========================================================================

function SignIn() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [values, setValues] = useState<SignInForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInForm, string>>
  >({});
  const [authError, setAuthError] = useState('');

  const validateField = async (name: keyof SignInForm, value: string) => {
    try {
      await signInSchema.validateAt(name as string, {
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
    const field = name as keyof SignInForm;

    setValues(prev => ({ ...prev, [field]: value }));
    setAuthError('');
    void validateField(field, value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');

    try {
      const validData = (await signInSchema.validate(values, {
        abortEarly: false,
      })) as SignInForm;

      setErrors({});

      const user = await login(validData);

      if (user) {
        setUser(user);
        router.push('/profile');
      } else {
        setAuthError('Invalid email or password.');
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Partial<Record<keyof SignInForm, string>> = {};
        err.inner.forEach(issue => {
          const path = issue.path as keyof SignInForm | undefined;
          if (path && !fieldErrors[path]) {
            fieldErrors[path] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      const apiErr = err as ApiError;
      setAuthError(
        apiErr.response?.data?.error ??
          apiErr.message ??
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <section className={css.section}>
      <div className={css.card}>
        <h1 className={css.title}>Sign in</h1>
        <p className={css.subtitle}>Access your private notes dashboard.</p>

        <form className={css.form} onSubmit={handleSubmit} noValidate>
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
            <input
              className={`${css.input} ${
                errors.password ? css.inputError : ''
              }`}
              type="password"
              name="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className={css.errorField}>{errors.password}</span>
            )}
          </label>

          {authError && (
            <p className={css.errorCommon}>
              Incorrect email address or password
            </p>
          )}

          <Button type="submit" variant="normal" text="Log in" />
        </form>

        <p className={css.helper}>
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className={css.link}>
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignIn;
