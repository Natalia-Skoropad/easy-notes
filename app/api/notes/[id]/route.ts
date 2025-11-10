import { NextResponse } from 'next/server';
import { api, ApiError } from '../../api';

//===========================================================================

interface GetProps {
  params: Promise<{ id: string }>;
}

//===========================================================================

export async function GET(_req: Request, { params }: GetProps) {
  void _req;
  const { id } = await params;

  try {
    const { data } = await api.get(`/notes/${id}`);
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
