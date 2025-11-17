import { nextServer } from './api';
import { type AxiosResponse } from 'axios';

import type { User } from '@/types/user';
import type { Note, NoteTag } from '@/types/note';

//===========================================================================

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface PagedNotes {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Note[];
}

type RawFetchNotesResponse = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  notes?: Note[];
  results?: Note[];
  items?: Note[];
  data?: Note[];
};

export type CreateNoteInput = Pick<Note, 'title' | 'content' | 'tag'>;

// ---------------- NOTES ---------------------------------------------------

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<PagedNotes> {
  const { page = 1, perPage = 12, search, tag } = params;

  const q = (search ?? '').trim();
  const queryParams: Record<string, unknown> = { page, perPage };

  if (q.length >= 2) queryParams.search = q;
  if (tag) queryParams.tag = tag;

  const res: AxiosResponse<RawFetchNotesResponse> = await nextServer.get(
    '/notes',
    {
      params: queryParams,
    }
  );

  const data = res.data;
  const items =
    data.notes ?? data.results ?? data.items ?? data.data ?? ([] as Note[]);

  return {
    page: data.page ?? page,
    perPage: data.perPage ?? perPage,
    totalItems: data.totalItems ?? items.length,
    totalPages:
      data.totalPages ??
      Math.max(
        1,
        Math.ceil((data.totalItems ?? items.length) / (data.perPage ?? perPage))
      ),
    items,
  };
}

export async function fetchNoteById(id: string | number): Promise<Note> {
  const res: AxiosResponse<Note> = await nextServer.get(`/notes/${id}`);
  return res.data;
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const res: AxiosResponse<Note> = await nextServer.post('/notes', input);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await nextServer.delete(`/notes/${id}`);
  return res.data;
}

//===========================================================================

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export type UpdateUserRequest = {
  username: string;
  avatar?: string;
};

// ---------------- AUTH ---------------------------------------------------

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

// ---------------- USERS --------------------------------------------------

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.patch<User>('/users/me', payload);
  return res.data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await nextServer.post('/upload', formData);
  return data.url;
};
