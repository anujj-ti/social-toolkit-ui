import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const brandId = searchParams.get('brandId');
  const apiKey = searchParams.get('apiKey');

  if (!tenantId || !brandId || !apiKey) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/brand/${brandId}/compass`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch brand compass status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Brand compass status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand compass status' },
      { status: 500 }
    );
  }
} 