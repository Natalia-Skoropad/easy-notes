'use client';

import { Button } from '@/app/components';
import css from './error.module.css';

//===========================================================================

interface ErrorProps {
  error: Error;
  reset: () => void;
}

//===========================================================================

function Error({ error, reset }: ErrorProps) {
  return (
    <div className={css.wrap}>
      <h2>Failed to load data</h2>
      <p>{error.message}</p>

      <Button onClick={reset} text="Try again" />
    </div>
  );
}

export default Error;
