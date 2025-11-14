'use client';

import { useRouter } from 'next/navigation';
import { Modal } from '@/app/components';
import css from './NotePreview.module.css';

//===========================================================================

function LoadingNoteModal() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.modalLoading}>
        <div className={css.spinner} aria-hidden="true" />
        <p className={css.isLoading}>Loading, please wait...</p>
      </div>
    </Modal>
  );
}

export default LoadingNoteModal;
