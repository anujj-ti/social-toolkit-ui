import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const promptId = searchParams.get('promptId');
  const apiKey = searchParams.get('apiKey');

  if (!tenantId || !promptId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/prompt/${promptId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prompt');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Prompt fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
} 