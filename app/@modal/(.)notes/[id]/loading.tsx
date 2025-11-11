import { Modal } from '@/app/components';
import css from './loading.module.css';

//===========================================================================

function LoadingNoteModal() {
  return (
    <Modal>
      <div className={css.box}>
        <div className="spinner" />
        <p>Loading note…</p>
      </div>
    </Modal>
  );
}

export default LoadingNoteModal;
