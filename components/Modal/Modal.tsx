'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/components';

import css from './Modal.module.css';

//===========================================================================

interface ModalProps {
  children: React.ReactNode;
}
//===========================================================================

function Modal({ children }: ModalProps) {
  const router = useRouter();
  const close = () => router.back();

  return (
    <div className={css.backdrop} onClick={close}>
      <div className={css.dialog} onClick={e => e.stopPropagation()}>
        {children}
        <div className={css.actions}>
          <Button variant="cancel" onClick={close} text="Close" />
        </div>
      </div>
    </div>
  );
}

export default Modal;
