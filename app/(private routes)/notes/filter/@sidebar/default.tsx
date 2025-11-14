'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NoteTag } from '@/types/note';

import clsx from 'clsx';
import css from './SidebarNotes.module.css';

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

function NotesSidebar() {
  const pathname = usePathname();

  const raw = pathname?.replace('/notes/filter', '').replace(/^\//, '') || '';
  const current = decodeURIComponent(raw || 'all');

  const linkClass = (value: string) =>
    clsx(
      css.menuLink,
      (current === 'all' && value === 'all') || current === value
        ? css.active
        : undefined
    );

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/filter/all" className={linkClass('all')}>
          All notes
        </Link>
      </li>

      {TAGS.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${encodeURIComponent(tag)}`}
            className={linkClass(tag)}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NotesSidebar;
