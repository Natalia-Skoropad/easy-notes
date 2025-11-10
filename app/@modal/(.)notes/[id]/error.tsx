'use client';

import { Modal } from '@/app/components';

//===========================================================================

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

//===========================================================================

function ErrorInModal({ error, reset }: ErrorProps) {
  return (
    <Modal>
      <div style={{ display: 'grid', gap: 12 }}>
        <h2>Не вдалося завантажити нотатку</h2>
        <p>{error.message || 'Сталася помилка. Спробуйте пізніше.'}</p>

        <button className="btn-reset anim-button" onClick={reset}>
          Спробувати знову
        </button>
      </div>
    </Modal>
  );
}

export default ErrorInModal;
