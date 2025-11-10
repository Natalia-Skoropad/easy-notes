import { NextResponse } from 'next/server';
import { api, ApiError } from '../api';

//===========================================================================

export async function GET() {
  try {
    const { data } = await api.get('/categories');
    return NextResponse.json(data);
  } catch (error) {
    const err = error as ApiError;

    return NextResponse.json(
      {
        error: err.response?.data?.error ?? err.message,
      },
      { status: err.response?.status ?? 500 }
    );
  }
}
