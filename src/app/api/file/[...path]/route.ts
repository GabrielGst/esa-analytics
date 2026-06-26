import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AuthenticatedRequest } from '@/../next-auth';

export const GET = auth(async function GET(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (req.auth?.user.group_membership !== 'authorized') {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { path } = await params;
  if (!path || path.length < 2) {
    return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
  }

  const [slug, filename] = path;

  try {
    const flaskRes = await fetch(
      `${process.env.FLASK_INTERNAL_URL ?? 'http://127.0.0.1:5050'}/flask/file/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`
    );

    if (!flaskRes.ok) {
      return NextResponse.json({ message: 'File not found' }, { status: flaskRes.status });
    }

    const buffer = await flaskRes.arrayBuffer();
    const contentType = flaskRes.headers.get('content-type') ?? 'application/octet-stream';
    const contentDisposition = flaskRes.headers.get('content-disposition');

    const headers: Record<string, string> = { 'Content-Type': contentType };
    if (contentDisposition) headers['Content-Disposition'] = contentDisposition;

    return new NextResponse(buffer, { headers });
  } catch (err) {
    console.error('File serve error:', err);
    return NextResponse.json({ message: 'Failed to serve file' }, { status: 500 });
  }
});
