export type NoteTag =
  | 'Work'
  | 'Personal'
  | 'Meeting'
  | 'Shopping'
  | 'Ideas'
  | 'Travel'
  | 'Finance'
  | 'Health'
  | 'Important'
  | 'Todo';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tag: NoteTag;
}
