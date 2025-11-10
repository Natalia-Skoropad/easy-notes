import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';

//===========================================================================

export async function POST() {
  const cookieStore = await cookies();

  try {
    await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );
  } catch {
    // ignore API error, still clear cookies
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return NextResponse.json({ message: 'Logged out successfully' });
}
