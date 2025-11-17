'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { NoteTag } from '@/types/note';

import { useNotesStats } from '@/hooks/useNotesStats';
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

// той самий маппер класів, але вже з локального css
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

function CategoriesMenu() {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const toggle = () => setIsOpenMenu(prev => !prev);

  const { data: stats } = useNotesStats();

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuBtn}>
        Notes
      </button>

      {isOpenMenu && (
        <ul className={css.menu}>
          <li className={css.menuItem}>
            <Link href="/notes/filter/all" onClick={toggle}>
              <span>All notes</span>
              {stats && stats.total > 0 && (
                <span className={`${css.badge} ${css.badgeTotal}`}>
                  {stats.total}
                </span>
              )}
            </Link>
          </li>

          {TAGS.map(tag => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${encodeURIComponent(tag)}`}
                onClick={toggle}
              >
                <span>{tag}</span>
                {stats && stats.byTag[tag] > 0 && (
                  <span className={`${css.badge} ${getTagBadgeClass(tag)}`}>
                    {stats.byTag[tag]}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoriesMenu;
