import type { Note } from '@/types/note';
import { NoteItem } from '@/app/components';

import css from './NoteList.module.css';

//===========================================================================

interface NoteListProps {
  notes: Note[];
}

//===========================================================================

function NoteList({ notes }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map(note => (
        <NoteItem key={note.id} item={note} />
      ))}
    </ul>
  );
}

export default NoteList;
