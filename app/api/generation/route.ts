import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const brandId = searchParams.get('brandId');
  const workerId = searchParams.get('workerId');
  const generationId = searchParams.get('generationId');
  const apiKey = searchParams.get('apiKey');

  if (!tenantId || !brandId || !workerId || !generationId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/brand/${brandId}/worker/${workerId}/generation/${generationId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch generation');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Generation fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generation' },
      { status: 500 }
    );
  }
} 