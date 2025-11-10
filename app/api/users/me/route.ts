import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api, ApiError } from '../../api';

//===========================================================================

export async function GET() {
  const cookieStore = await cookies();

  try {
    const { data } = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const err = error as ApiError;

    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status ?? 500 }
    );
  }
}

//===========================================================================

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const body = await req.json();

  try {
    const { data } = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    const err = error as ApiError;

    return NextResponse.json(
      { error: err.response?.data?.error ?? err.message },
      { status: err.response?.status ?? 500 }
    );
  }
}
