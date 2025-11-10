import axios from 'axios';

//===========================================================================

const isServer = typeof window === 'undefined';

const serverBase =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

export const nextServer = axios.create({
  baseURL: isServer ? `${serverBase}/api` : '/api',
  withCredentials: true,
});
