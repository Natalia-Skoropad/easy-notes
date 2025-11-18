import type { NoteTag } from '@/types/note';
import { NoteForm } from '@/app/components';

import css from './CreateNote.module.css';

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

// ================================================================

async function NoteEditClient() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm tags={TAGS} />
      </div>
    </main>
  );
}

export default NoteEditClient;
