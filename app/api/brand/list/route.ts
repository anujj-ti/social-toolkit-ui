import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const apiKey = searchParams.get('apiKey');

  if (!tenantId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/brand`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Brand list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands data' },
      { status: 500 }
    );
  }
} 