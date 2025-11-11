import { nextServer } from './api';
import type { User } from '@/types/user';
import type { Note, NoteListResponse } from '@/types/note';

//===========================================================================

export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type NewNoteData = {
  title: string;
  content: string;
  categoryId: string;
};

// ---------------- NOTES & CATEGORIES ----------------

export const getNotes = async (categoryId?: string) => {
  const res = await nextServer.get<NoteListResponse>('/notes', {
    params: { categoryId },
  });
  return res.data;
};

export const getSingleNote = async (id: string) => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (data: NewNoteData) => {
  const res = await nextServer.post<Note>('/notes', data);
  return res.data;
};

export const getCategories = async () => {
  const res = await nextServer<Category[]>('/categories');
  return res.data;
};

// ---------------- AUTH ----------------

export type RegisterRequest = {
  email: string;
  password: string;
  userName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export type UpdateUserRequest = {
  userName?: string;
  photoUrl?: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

// ---------------- USER ----------------

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/auth/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.put<User>('/auth/me', payload);
  return res.data;
};

// ---------------- UPLOAD ----------------

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await nextServer.post('/upload', formData);
  return data.url;
};
