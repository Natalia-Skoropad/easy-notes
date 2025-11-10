'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

import { register, type RegisterRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/stores/authStore';
import { ApiError } from '@/app/api/api';

import css from './page.module.css';

//===========================================================================

const signUpSchema = Yup.object({
  userName: Yup.string()
    .min(2, 'Username must be at least 2 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type SignUpForm = RegisterRequest;

function SignUp() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [values, setValues] = useState<SignUpForm>({
    userName: '',
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
      const validData = (await signUpSchema.validate(values, {
        abortEarly: false,
      })) as SignUpForm;

      setErrors({});

      const user = await register(validData);

      if (user) {
        setUser(user);
        router.push('/profile');
      } else {
        setAuthError('Unable to register. Please try again.');
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const fieldErrors: Partial<Record<keyof SignUpForm, string>> = {};
        err.inner.forEach(issue => {
          const path = issue.path as keyof SignUpForm | undefined;
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
        <h1 className={css.title}>Create account</h1>
        <p className={css.subtitle}>
          Sign up to sync your notes securely across sessions.
        </p>

        <form className={css.form} onSubmit={handleSubmit} noValidate>
          <label className={css.label}>
            <span>Username</span>
            <input
              className={`${css.input} ${
                errors.userName ? css.inputError : ''
              }`}
              type="text"
              name="userName"
              placeholder="Your name"
              value={values.userName}
              onChange={handleChange}
            />
            {errors.userName && (
              <span className={css.errorField}>{errors.userName}</span>
            )}
          </label>

          <label className={css.label}>
            <span>Email</span>
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
            <span>Password</span>
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

          {authError && <p className={css.errorCommon}>{authError}</p>}

          <button type="submit" className={css.submit}>
            Sign up
          </button>
        </form>

        <p className={css.helper}>
          Already have an account?{' '}
          <a href="/sign-in" className={css.link}>
            Sign in
          </a>
        </p>
      </div>
    </section>
  );
}

export default SignUp;
