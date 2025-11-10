import Link from 'next/link';
import type { Note } from '@/types/note';

import css from './NoteItem.module.css';

//===========================================================================

interface NoteItemProps {
  item: Note;
}

//===========================================================================

function NoteItem({ item }: NoteItemProps) {
  const { id, title } = item;

  return (
    <li className={css.item}>
      <Link className={css.card} href={`/notes/${id}`}>
        <h3 className={css.title}>{title}</h3>
      </Link>
    </li>
  );
}

export default NoteItem;
