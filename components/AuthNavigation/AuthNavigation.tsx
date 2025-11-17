'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import Link from 'next/link';

import type { NoteTag } from '@/types/note';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { Button } from '@/app/components';
import { useNotesStats } from '@/hooks/useNotesStats';

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

// маленький хелпер, щоб підбирати кольоровий клас для тегу
const getTagBadgeClass = (tag: NoteTag) => {
  switch (tag) {
    case 'Work':
      return css.badgeWork;
    case 'Personal':
      return css.badgePersonal;
    case 'Meeting':
      return css.badgeMeeting;
    case 'Shopping':
      return css.badgeShopping;
    case 'Ideas':
      return css.badgeIdeas;
    case 'Travel':
      return css.badgeTravel;
    case 'Finance':
      return css.badgeFinance;
    case 'Health':
      return css.badgeHealth;
    case 'Important':
      return css.badgeImportant;
    case 'Todo':
      return css.badgeTodo;
    default:
      return '';
  }
};

//===========================================================================

function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuestProfileOpen, setIsGuestProfileOpen] = useState(false);

  const { data: stats } = useNotesStats(isAuthenticated);

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

  // -------- auth menu -----------------------------------------------------

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
              <span>All notes</span>
              {stats && stats.total > 0 && (
                <span className={`${css.badge} ${css.badgeTotal}`}>
                  {stats.total}
                </span>
              )}
            </Link>

            {TAGS.map(tag => (
              <Link
                key={tag}
                href={`/notes/filter/${encodeURIComponent(tag)}`}
                className={css.dropdownLink}
                onClick={closeAll}
              >
                <span>{tag}</span>
                {stats && stats.byTag[tag] > 0 && (
                  <span className={`${css.badge} ${getTagBadgeClass(tag)}`}>
                    {stats.byTag[tag]}
                  </span>
                )}
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
