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
        <h2>Failed to load note. Please try again later.</h2>
        <p>{error.message || 'An error occurred. Please try again later.'}</p>

        <button className="btn-reset anim-button" onClick={reset}>
          Try again
        </button>
      </div>
    </Modal>
  );
}

export default ErrorInModal;
