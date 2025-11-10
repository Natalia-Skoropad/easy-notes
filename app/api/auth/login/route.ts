import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

import { api, ApiError } from '../../api';

//===========================================================================

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const apiRes = await api.post('/auth/login', body);
    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
        };

        if (parsed.accessToken) {
          cookieStore.set('accessToken', parsed.accessToken, options);
        }
        if (parsed.refreshToken) {
          cookieStore.set('refreshToken', parsed.refreshToken, options);
        }
      }
      return NextResponse.json(apiRes.data);
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
