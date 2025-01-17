import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

export async function POST(request: Request) {
  const { tenantId, apiKey, name, description, output_type, prompt } = await request.json();

  if (!tenantId || !apiKey || !name || !description || !output_type || !prompt) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/worker`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          output_type,
          prompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create worker');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Worker create error:', error);
    return NextResponse.json(
      { error: 'Failed to create worker' },
      { status: 500 }
    );
  }
} 