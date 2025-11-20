'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useCallback } from 'react';

import css from './NotesActionsOffcanvas.module.css';

//===========================================================================

interface NotesActionsOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

//===========================================================================

function NotesActionsOffcanvas({
  isOpen,
  onClose,
  children,
}: NotesActionsOffcanvasProps) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className={css.offcanvasBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Notes actions"
    >
      <div className={css.offcanvas} role="document">
        <div className={css.offcanvasHeader}>
          <div className={css.offcanvasBrand}>
            <p className={css.logo}>Notes actions</p>
            <p className={css.offcanvasGreeting}>
              Quick actions for your notes
            </p>
          </div>

          <button
            type="button"
            className={css.closeBtn}
            onClick={onClose}
            aria-label="Close actions"
          >
            <X className={css.menuIcon} />
          </button>
        </div>

        <div className={css.offcanvasNav}>{children}</div>
      </div>
    </div>
  );
}

export default NotesActionsOffcanvas;
