import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AuthenticatedRequest } from '@/../next-auth';

export const GET = auth(async function GET(req: AuthenticatedRequest) {
  if (req.auth?.user.group_membership !== 'authorized') {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get('slug') ?? '';
  if (!slug) {
    return NextResponse.json({ status: 'error', message: 'slug is required' }, { status: 400 });
  }

  try {
    const flaskRes = await fetch(
      `${process.env.FLASK_INTERNAL_URL ?? 'http://127.0.0.1:5050'}/flask/files/?slug=${encodeURIComponent(slug)}`
    );
    const data = await flaskRes.json();
    return NextResponse.json(data, { status: flaskRes.status });
  } catch (err) {
    console.error('File list error:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to list files' }, { status: 500 });
  }
});
