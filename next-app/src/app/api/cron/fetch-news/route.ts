import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://jwyjvinmgdozkgzydmax.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eWp2aW5tZ2RvemtnenlkbWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTAwNTUsImV4cCI6MjA4MjUyNjA1NX0.JKhtk6bfhnIkyrBD-BvOZfgo4NCzv3GN4802AikObfk';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/fetch-news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Cron fetch-news error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
