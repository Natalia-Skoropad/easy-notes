'use client';

import Link from 'next/link';
import css from './Header.module.css';
import { AuthNavigation } from '@/app/components';

//===========================================================================

function Header() {
  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <Link href="/" className={css.logo}>
          EasyNotes
        </Link>

        <ul className={css.list}>
          <li>
            <Link href="/" className={css.link}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/about" className={css.link}>
              About
            </Link>
          </li>

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}

export default Header;
