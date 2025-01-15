'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import TenantForm from '@/app/components/TenantForm';
import { Tenant } from '@/types';

export default function TenantManagement() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [error, setError] = useState<string>('');

  const handleTenantFetch = async (tenantId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/tenant?tenantId=${tenantId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tenant');
      }
      
      setTenant(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTenant(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Tenant Management</h1>
        
        <div className="space-y-6">
          <TenantForm onSubmit={handleTenantFetch} />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {tenant && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Tenant Details</h2>
              <pre className="bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(tenant, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 