'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { NoteTag } from '@/types/note';

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
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const toggle = () => setIsOpenMenu(prev => !prev);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuBtn}>
        Notes
      </button>
      {isOpenMenu && (
        <ul className={css.menu}>
          <li className={css.menuItem}>
            <Link href={`/notes/filter/all`} onClick={toggle}>
              All notes
            </Link>
          </li>
          {TAGS.map(tag => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${encodeURIComponent(tag)}`}
                onClick={toggle}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoriesMenu;
