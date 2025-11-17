'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { AuthNavigation } from '@/app/components';
import { MobileOffcanvas } from '@/app/components';

import css from './Header.module.css';

//===========================================================================

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMenu = () => setIsMobileMenuOpen(true);
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <Link href="/" className={css.logo}>
          EasyNotes
        </Link>

        {/* mobile burger */}
        <button
          type="button"
          className={css.menuToggle}
          aria-label="Open navigation"
          onClick={openMenu}
        >
          <Menu className={css.menuIcon} />
        </button>

        {/* desktop navigation */}
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

        {/* mobile offcanvas */}
        <MobileOffcanvas isOpen={isMobileMenuOpen} onClose={closeMenu} />
      </nav>
    </header>
  );
}

export default Header;
