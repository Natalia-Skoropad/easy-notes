'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { getTagStyle } from '@/lib/store/tagStyles';
import { useNotesStats } from '@/hooks/useNotesStats';
import { Button } from '@/app/components';

import css from './MobileOffcanvas.module.css';

//===========================================================================

interface MobileOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
}

//===========================================================================

function MobileOffcanvas({ isOpen, onClose }: MobileOffcanvasProps) {
  const pathname = usePathname();

  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);

  const { data: stats } = useNotesStats(Boolean(user) && isOpen);
  const totalNotes = stats?.total ?? 0;

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleLogout = async () => {
    await logout();
    setUser(null);
    onClose();
  };

  if (!isOpen) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/notes/filter/all') return pathname.startsWith('/notes');
    return pathname === href;
  };

  const linkClass = (href: string) =>
    `${css.offcanvasLink} ${isActive(href) ? css.offcanvasLinkActive : ''}`;

  return (
    <div
      className={css.offcanvasBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className={css.offcanvas} role="document">
        <div className={css.offcanvasHeader}>
          <div className={css.offcanvasBrand}>
            <Link
              href="/"
              className={css.logo}
              onClick={onClose}
              aria-label="Go to home"
            >
              EasyNotes
            </Link>

            {user && (
              <p className={css.offcanvasGreeting}>
                Hi, {user.username || 'friend'} 👋
              </p>
            )}
          </div>

          <button
            type="button"
            className={css.closeBtn}
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className={css.menuIcon} />
          </button>
        </div>

        <nav className={css.offcanvasNav}>
          <Link href="/" className={linkClass('/')} onClick={onClose}>
            Home
          </Link>

          <Link href="/about" className={linkClass('/about')} onClick={onClose}>
            About
          </Link>

          {!user && (
            <>
              <Link
                href="/sign-in"
                className={linkClass('/sign-in')}
                onClick={onClose}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={linkClass('/sign-up')}
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/profile"
                className={linkClass('/profile')}
                onClick={onClose}
              >
                Profile
              </Link>

              <Link
                href="/notes/filter/all"
                className={linkClass('/notes/filter/all')}
                onClick={onClose}
              >
                <span>All notes</span>
                {totalNotes > 0 && (
                  <span className={css.badge} style={getTagStyle('Work')}>
                    {totalNotes}
                  </span>
                )}
              </Link>

              <div className={css.dropdownDivider} />

              <Button
                type="button"
                text="Logout"
                variant="logout"
                className={css.logout}
                onClick={handleLogout}
              />
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

export default MobileOffcanvas;
