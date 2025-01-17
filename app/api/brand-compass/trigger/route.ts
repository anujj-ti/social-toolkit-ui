import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

export async function POST(request: Request) {
  const { tenantId, brandId, apiKey } = await request.json();

  if (!tenantId || !brandId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/brand/${brandId}/compass/trigger`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to trigger brand compass');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Brand compass trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger brand compass' },
      { status: 500 }
    );
  }
} 