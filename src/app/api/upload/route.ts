import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AuthenticatedRequest } from '@/../next-auth';

export const POST = auth(async function POST(req: AuthenticatedRequest) {
  if (req.auth?.user.group_membership !== 'authorized') {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const incoming = await req.formData();

    const flaskForm = new FormData();
    for (const [key, value] of incoming.entries()) {
      flaskForm.append(key, value);
    }

    const flaskRes = await fetch(
      (process.env.FLASK_INTERNAL_URL ?? 'http://127.0.0.1:5050') + '/flask/multiple-uploads/',
      { method: 'POST', body: flaskForm }
    );

    const data = await flaskRes.json();
    return NextResponse.json(data, { status: flaskRes.status });
  } catch (err) {
    console.error('Upload proxy error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
});
