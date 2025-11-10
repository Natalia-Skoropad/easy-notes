import { nextServer } from './api';
import type { User } from '@/types/user';
import type { Note, NotesResponse } from '@/types/note';

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
  tag: string;
};

//===========================================================================

export const getNotes = async (params?: {
  search?: string;
  page?: number;
  tag?: string;
}) => {
  const { data } = await nextServer.get<NotesResponse>('/notes', {
    params,
  });
  return data;
};

export const getSingleNote = async (id: string) => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (data: NewNoteData) => {
  const res = await nextServer.post('/notes', data);
  return res.data;
};

export const getCategories = async () => {
  const res = await nextServer.get<Category[]>('/categories');
  return res.data;
};

// ===== Mock users for the Profile route ===================================

export type RegisterRequest = {
  email: string;
  password: string;
  userName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

type SessionResponse = {
  success: boolean;
};

export type UpdateUserRequest = {
  userName?: string;
  photoUrl?: string;
};

//===========================================================================

export const register = async (payload: RegisterRequest) => {
  const { data } = await nextServer.post<User>('/auth/register', payload);
  return data;
};

export const login = async (payload: LoginRequest) => {
  const { data } = await nextServer.post<User>('/auth/login', payload);
  return data;
};

export const checkSession = async () => {
  const { data } = await nextServer.get<SessionResponse>('/auth/session');
  return data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const logout = async () => {
  await nextServer.post('/auth/logout');
};

export const updateMe = async (payload: Partial<User>) => {
  const { data } = await nextServer.patch<User>('/users/me', payload);
  return data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await nextServer.post('/upload', formData);
  return data.url;
};
