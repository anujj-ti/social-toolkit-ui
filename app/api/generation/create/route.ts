import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

export async function POST(request: Request) {
  const { tenantId, brandId, workerId, context, apiKey } = await request.json();

  if (!tenantId || !brandId || !workerId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/brand/${brandId}/worker/${workerId}/generation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: context || undefined,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create generation');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Generation create error:', error);
    return NextResponse.json(
      { error: 'Failed to create generation' },
      { status: 500 }
    );
  }
} 