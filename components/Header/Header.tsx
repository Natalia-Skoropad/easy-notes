'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import css from './Header.module.css';

//===========================================================================

function Header() {
  const [isOpen, setIsOpen] = useState(false);

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

          <li
            className={css.profileWrapper}
            onMouseLeave={() => setIsOpen(false)}
          >
            <button
              type="button"
              className={css.profileBtn}
              onMouseEnter={() => setIsOpen(true)}
              onClick={() => setIsOpen(prev => !prev)}
            >
              <span className={css.avatarStub}>
                <User size={14} />
              </span>
              <span>Profile</span>
              {isOpen ? (
                <ChevronUp size={14} className={css.chevron} />
              ) : (
                <ChevronDown size={14} className={css.chevron} />
              )}
            </button>

            {isOpen && (
              <div className={css.dropdown}>
                <Link href="/sign-in" className={css.dropdownLink}>
                  Login
                </Link>
                <Link href="/sign-up" className={css.dropdownLink}>
                  Register
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
