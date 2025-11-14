'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import Link from 'next/link';

import type { NoteTag } from '@/types/note';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { Button } from '@/app/components';

import Image from 'next/image';
import css from '../Header/Header.module.css';

//===========================================================================

const TAGS: NoteTag[] = [
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];

//===========================================================================

function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuestProfileOpen, setIsGuestProfileOpen] = useState(false);

  const closeAll = () => {
    setIsNotesOpen(false);
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
              className={css.dropdownLink}
              onClick={closeAll}
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className={css.dropdownLink}
              onClick={closeAll}
            >
              Register
            </Link>
          </div>
        )}
      </li>
    );
  }

  return (
    <>
      {/* Notes dropdown */}
      <li
        className={css.profileWrapper}
        onMouseLeave={() => setIsNotesOpen(false)}
      >
        <button
          type="button"
          className={css.notesBtn}
          onMouseEnter={() => setIsNotesOpen(true)}
          onClick={() => setIsNotesOpen(prev => !prev)}
        >
          <span>Notes</span>
          {isNotesOpen ? (
            <ChevronUp size={14} className={css.chevron} />
          ) : (
            <ChevronDown size={14} className={css.chevron} />
          )}
        </button>

        {isNotesOpen && (
          <div className={css.dropdown}>
            <Link
              href="/notes/filter/all"
              className={css.dropdownLink}
              onClick={closeAll}
            >
              All notes
            </Link>

            {TAGS.map(tag => (
              <Link
                key={tag}
                href={`/notes/filter/${encodeURIComponent(tag)}`}
                className={css.dropdownLink}
                onClick={closeAll}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </li>

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
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username || 'Profile photo'}
                className={css.avatar}
                width={11}
                height={11}
              />
            ) : (
              <User size={11} />
            )}
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
              className={css.dropdownLink}
              onClick={closeAll}
            >
              Details
            </Link>

            <Link
              href="/profile/edit"
              className={css.dropdownLink}
              onClick={closeAll}
            >
              Settings
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
