'use client';

import { useEffect } from 'react';
import css from './Toast.module.css';

//===========================================================================

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

//===========================================================================

function Toast({
  message,
  type = 'success',
  isOpen,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!isOpen) return;

    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${css.toast} ${type === 'success' ? css.success : css.error}`}
    >
      <span className={css.dot} />
      <p className={css.message}>{message}</p>
    </div>
  );
}

export default Toast;
