const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://social-toolkit.ti.trilogy.com';

export async function getTenant(tenantId: string, apiKey: string) {
  const response = await fetch(`${API_BASE_URL}/tenant/${tenantId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tenant');
  }

  return response.json();
} 