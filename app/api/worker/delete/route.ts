import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
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
      `https://social-toolkit.ti.trilogy.com/tenant/${tenantId}/worker/${workerId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete worker');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Worker delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete worker' },
      { status: 500 }
    );
  }
} 