'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { AuthNavigation, MobileOffcanvas } from '@/app/components';

import css from './Header.module.css';

//===========================================================================

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const linkClass = (href: string) => {
    const isActive =
      href === '/' ? pathname === '/' : pathname.startsWith(href);

    return `${css.link} ${isActive ? css.linkActive : ''}`;
  };

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
            <Link href="/" className={linkClass('/')}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/about" className={linkClass('/about')}>
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
