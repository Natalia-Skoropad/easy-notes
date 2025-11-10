import { LinkButton } from '@/app/components';
import css from './notFound.module.css';

//===========================================================================

function NotFound() {
  return (
    <div className={css.section}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you&#39;re looking for doesn&#39;t exist.</p>

      <LinkButton href="/" text="Go back home" variant="cancel" />
    </div>
  );
}

export default NotFound;
