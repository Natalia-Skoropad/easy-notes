'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, User } from 'lucide-react';

import { useAuthStore } from '@/lib/stores/authStore';
import { logout, getCategories, type Category } from '@/lib/api/clientApi';
import { Button } from '@/app/components';

import Image from 'next/image';
import css from '../Header/Header.module.css';

//===========================================================================

function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const clearIsAuthenticated = useAuthStore(s => s.clearIsAuthenticated);

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuestProfileOpen, setIsGuestProfileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCategories([]);
      return;
    }

    getCategories()
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, [isAuthenticated]);

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

            {categories.map(category => (
              <Link
                key={category.id}
                href={`/notes/filter/${category.id}`}
                className={css.dropdownLink}
                onClick={closeAll}
              >
                {category.name}
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
            {user?.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={user.userName || 'Profile photo'}
                className={css.avatar}
              />
            ) : (
              <User size={11} />
            )}
          </span>

          <span>{user?.userName || 'Profile'}</span>

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
