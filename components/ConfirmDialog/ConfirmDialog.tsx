'use client';

import type { ReactNode } from 'react';
import { Modal, Button } from '@/app/components';

import css from './ConfirmDialog.module.css';

//===========================================================================

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'normal' | 'cancel' | 'delete' | 'logout';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  extra?: ReactNode;
}

//===========================================================================

function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmVariant = 'normal',
  onConfirm,
  onCancel,
  extra,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    void onConfirm();
  };

  return (
    <Modal onClose={onCancel}>
      <div className={css.dialog}>
        {title && <h2 className={css.title}>{title}</h2>}
        <p className={css.message}>{message}</p>
        {extra && <div className={css.extra}>{extra}</div>}

        <div className={css.actions}>
          <Button
            type="button"
            variant={confirmVariant}
            text={confirmText}
            onClick={handleConfirm}
          />
          <Button
            type="button"
            variant="cancel"
            text={cancelText}
            onClick={onCancel}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
