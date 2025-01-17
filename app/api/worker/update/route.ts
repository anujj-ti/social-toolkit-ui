import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';
  
export async function PUT(request: Request) {
  const { tenantId, workerId, apiKey, name, description, prompt } = await request.json();

  if (!tenantId || !workerId || !apiKey || !name || !description || !prompt) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tenant/${tenantId}/worker/${workerId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          prompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update worker');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Worker update error:', error);
    return NextResponse.json(
      { error: 'Failed to update worker' },
      { status: 500 }
    );
  }
} 