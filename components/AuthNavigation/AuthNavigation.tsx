'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import Link from 'next/link';

import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { Button, CategoriesMenu } from '@/app/components';

import clsx from 'clsx';
import css from './AuthNavigation.module.css';

//===========================================================================

function AuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuestProfileOpen, setIsGuestProfileOpen] = useState(false);

  const closeAll = () => {
    setIsProfileOpen(false);
    setIsGuestProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push('/sign-in');
    }
  };

  const dropdownLinkClass = (href: string) =>
    clsx(css.dropdownLink, pathname === href && css.dropdownLinkActive);

  // -------- guest menu ----------------------------------------------------

  if (!isAuthenticated) {
    return (
      <li
        className={css.profileWrapper}
        onMouseLeave={() => setIsGuestProfileOpen(false)}
      >
        <button
          type="button"
          className={css.profileBtn}
          onMouseEnter={() => setIsGuestProfileOpen(true)}
          onClick={() => setIsGuestProfileOpen(prev => !prev)}
        >
          <span className={css.avatarStub}>
            <User size={14} />
          </span>
          <span>Profile</span>
          {isGuestProfileOpen ? (
            <ChevronUp size={14} className={css.chevron} />
          ) : (
            <ChevronDown size={14} className={css.chevron} />
          )}
        </button>

        {isGuestProfileOpen && (
          <div className={css.dropdown}>
            <Link
              href="/sign-in"
              className={dropdownLinkClass('/sign-in')}
              onClick={closeAll}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={dropdownLinkClass('/sign-up')}
              onClick={closeAll}
            >
              Sign Up
            </Link>
          </div>
        )}
      </li>
    );
  }

  // -------- auth menu -----------------------------------------------------

  return (
    <>
      {/* Notes dropdown */}
      <CategoriesMenu />

      {/* Profile dropdown */}
      <li
        className={css.profileWrapper}
        onMouseLeave={() => setIsProfileOpen(false)}
      >
        <button
          type="button"
          className={css.profileBtn}
          onMouseEnter={() => setIsProfileOpen(true)}
          onClick={() => setIsProfileOpen(prev => !prev)}
        >
          <span className={css.avatarStub}>
            <User size={11} />
          </span>

          <span>{user?.username || 'Profile'}</span>

          {isProfileOpen ? (
            <ChevronUp size={14} className={css.chevron} />
          ) : (
            <ChevronDown size={14} className={css.chevron} />
          )}
        </button>

        {isProfileOpen && (
          <div className={css.dropdown}>
            <Link
              href="/profile"
              className={dropdownLinkClass('/profile')}
              onClick={closeAll}
            >
              Details
            </Link>

            <Link
              href="/profile/edit"
              className={dropdownLinkClass('/profile/edit')}
              onClick={closeAll}
            >
              Edit
            </Link>

            <div className={css.dropdownDivider} />
            <Button
              type="button"
              text="Logout"
              variant="logout"
              className={css.logout}
              onClick={() => {
                closeAll();
                void handleLogout();
              }}
            />
          </div>
        )}
      </li>
    </>
  );
}

export default AuthNavigation;
