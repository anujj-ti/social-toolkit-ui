import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const workerId = searchParams.get('workerId');
  const apiKey = searchParams.get('apiKey');

  if (!tenantId || !workerId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/worker/${workerId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch worker');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Worker fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch worker' },
      { status: 500 }
    );
  }
} 