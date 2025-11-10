import type { AnchorHTMLAttributes } from 'react';
import Link, { type LinkProps } from 'next/link';

import clsx from 'clsx';
import css from './LinkButton.module.css';

//===========================================================================

interface LinkButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    LinkProps {
  text: string;
  variant?: 'normal' | 'cancel' | 'delete';
  block?: boolean;
}

//===========================================================================

function LinkButton({
  href,
  text,
  variant = 'normal',
  block = false,
  prefetch,
  className,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={clsx(
        css.linkButton,
        css[variant],
        block && css.block,
        'anim-button',
        className
      )}
      {...rest}
    >
      {text}
    </Link>
  );
}

export default LinkButton;
