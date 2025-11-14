import css from './EmptyState.module.css';

//===============================================================

interface EmptyStateProps {
  title?: string;
  message?: string;
}

//===============================================================

function EmptyState({
  title = 'Nothing found',
  message = 'Try a different query.',
}: EmptyStateProps) {
  return (
    <div className={css.empty} role="status" aria-live="polite">
      <h2 className={css.title}>{title}</h2>
      {message && <p className={css.message}>{message}</p>}
    </div>
  );
}

export default EmptyState;
