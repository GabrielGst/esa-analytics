import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AuthenticatedRequest } from '@/../next-auth';

export const GET = auth(async function GET(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ ssapId: string }> }
) {
  if (req.auth?.user.group_membership !== 'authorized') {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { ssapId } = await params;

  try {
    const flaskRes = await fetch(
      `${process.env.FLASK_INTERNAL_URL ?? 'http://127.0.0.1:5050'}/flask/activity/${encodeURIComponent(ssapId)}`
    );
    const data = await flaskRes.json();
    return NextResponse.json(data, { status: flaskRes.status });
  } catch (err) {
    console.error('Activity fetch error:', err);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch activity' }, { status: 500 });
  }
});
