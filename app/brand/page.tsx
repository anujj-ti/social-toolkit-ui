'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import BrandForm from '@/app/components/BrandForm';
import { Brand } from '@/types';

export default function BrandManagement() {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [error, setError] = useState<string>('');

  const handleBrandFetch = async (tenantId: string, brandId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/brand?tenantId=${tenantId}&brandId=${brandId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch brand');
      }
      
      setBrand(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBrand(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Brand Management</h1>
        
        <div className="space-y-6">
          <BrandForm onSubmit={handleBrandFetch} />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {brand && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Brand Details</h2>
              <pre className="bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(brand, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 