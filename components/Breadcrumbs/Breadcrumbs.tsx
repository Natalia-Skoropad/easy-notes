'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

import css from './Breadcrumbs.module.css';

//=========================================================================

export type Crumb = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: Crumb[];
}

//=========================================================================

function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items.length) return null;

  const lastIndex = items.length - 1;

  return (
    <nav className={css.breadcrumbs} aria-label="Breadcrumb">
      {/* Home icon */}

      <Home className={css.homeIcon} />

      {items.map((item, index) => {
        const isLast = index === lastIndex;

        return (
          <div key={`${item.label}-${index}`} className={css.item}>
            <span className={css.separator}>/</span>

            {isLast || !item.href ? (
              <span className={css.current}>
                <span className={css.currentText}>{item.label}</span>
              </span>
            ) : (
              <Link href={item.href} className={css.link}>
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
