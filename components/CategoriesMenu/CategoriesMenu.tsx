'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { NoteTag } from '@/types/note';
import { useNotesStats } from '@/hooks/useNotesStats';
import { getTagStyle } from '@/lib/store/tagStyles';

import css from './CategoriesMenu.module.css';

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

function CategoriesMenu() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const pathname = usePathname();
  const { data: stats } = useNotesStats();

  const toggle = () => setIsOpenMenu(prev => !prev);

  const raw = pathname?.replace('/notes/filter', '').replace(/^\//, '') || '';
  const current = decodeURIComponent(raw || 'all');

  const isNotesSectionActive = pathname.startsWith('/notes');

  const btnClass = `${css.menuBtn} ${
    isNotesSectionActive ? css.menuBtnActive : ''
  }`;

  const linkClass = (value: string) =>
    `${css.menuLink} ${
      (current === 'all' && value === 'all') || current === value
        ? css.menuLinkActive
        : ''
    }`;

  return (
    <li
      className={css.menuContainer}
      onMouseEnter={() => setIsOpenMenu(true)}
      onMouseLeave={() => setIsOpenMenu(false)}
    >
      <button type="button" onClick={toggle} className={btnClass}>
        <span>Notes</span>
        <ChevronDown
          className={`${css.chevron} ${isOpenMenu ? css.chevronOpen : ''}`}
        />
      </button>

      {isOpenMenu && (
        <ul className={css.menu}>
          <li className={css.menuItem}>
            <Link
              href="/notes/filter/all"
              className={linkClass('all')}
              onClick={() => setIsOpenMenu(false)}
            >
              <span>All notes</span>
              {stats && stats.total > 0 && (
                <span className={css.badge}>{stats.total}</span>
              )}
            </Link>
          </li>

          {TAGS.map(tag => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${encodeURIComponent(tag)}`}
                className={linkClass(tag)}
                onClick={() => setIsOpenMenu(false)}
              >
                <span>{tag}</span>
                {stats && stats.byTag[tag] > 0 && (
                  <span className={css.badge} style={getTagStyle(tag)}>
                    {stats.byTag[tag]}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default CategoriesMenu;
