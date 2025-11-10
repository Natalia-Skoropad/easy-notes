export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
}
