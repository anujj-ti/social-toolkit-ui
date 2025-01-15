'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import SourceForm from '@/app/components/SourceForm';
import { Source } from '@/types';

export default function SourceManagement() {
  const [sources, setSources] = useState<Source[] | null>(null);
  const [error, setError] = useState<string>('');

  const handleSourceFetch = async (tenantId: string, brandId: string, sourceId: string, apiKey: string) => {
    try {
      const response = await fetch(
        `/api/source?tenantId=${tenantId}&brandId=${brandId}&sourceId=${sourceId}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch source');
      }
      
      setSources([data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSources(null);
    }
  };

  const handleListAll = async (tenantId: string, brandId: string, apiKey: string) => {
    try {
      const response = await fetch(
        `/api/source/list?tenantId=${tenantId}&brandId=${brandId}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sources');
      }
      
      setSources(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSources(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Source Management</h1>
        
        <div className="space-y-6">
          <SourceForm onSubmit={handleSourceFetch} onListAll={handleListAll} />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {sources && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                {sources.length > 1 ? 'All Sources' : 'Source Details'}
              </h2>
              <pre className="bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(sources, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 