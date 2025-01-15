'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import PromptForm from '@/app/components/PromptForm';
import { Prompt } from '@/types';

export default function PromptManagement() {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);
  const [error, setError] = useState<string>('');

  const handlePromptFetch = async (tenantId: string, promptId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/prompt?tenantId=${tenantId}&promptId=${promptId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prompt');
      }
      
      setPrompts([data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPrompts(null);
    }
  };

  const handleListAll = async (tenantId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/prompt/list?tenantId=${tenantId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prompts');
      }
      
      setPrompts(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPrompts(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Prompt Management</h1>
        
        <div className="space-y-6">
          <PromptForm onSubmit={handlePromptFetch} onListAll={handleListAll} />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {prompts && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                {prompts.length > 1 ? 'All Prompts' : 'Prompt Details'}
              </h2>
              <pre className="bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(prompts, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 