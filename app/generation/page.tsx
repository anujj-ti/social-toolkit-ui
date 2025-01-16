'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import GenerationForm from '@/app/components/GenerationForm';
import { Generation } from '@/types';

export default function GenerationManagement() {
  const [generations, setGenerations] = useState<Generation[] | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (tenantId: string, brandId: string, workerId: string, apiKey: string, context?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId, brandId, workerId, apiKey, context }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create generation');
      }
      
      setGenerations([data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setGenerations(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGet = async (tenantId: string, brandId: string, workerId: string, generationId: string, apiKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/generation?tenantId=${tenantId}&brandId=${brandId}&workerId=${workerId}&generationId=${generationId}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch generation');
      }
      
      setGenerations([data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setGenerations(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListAll = async (tenantId: string, brandId: string, workerId: string, apiKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/generation/list?tenantId=${tenantId}&brandId=${brandId}&workerId=${workerId}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch generations');
      }
      
      setGenerations(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setGenerations(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Generation Management</h1>
        
        <div className="space-y-6">
          <GenerationForm 
            onCreate={handleCreate}
            onGet={handleGet}
            onListAll={handleListAll}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {generations && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                {generations.length > 1 ? 'All Generations' : 'Generation Details'}
              </h2>
              <div className="space-y-4">
                {generations.map((gen, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded ${
                        gen.status === 'COMPLETED' ? 'bg-green-600' :
                        gen.status === 'PROCESSING' ? 'bg-blue-600' :
                        gen.status === 'PENDING' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}>
                        {gen.status}
                      </span>
                    </div>
                    
                    {gen.result && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">Result</h3>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap">{gen.result.content}</pre>
                        </div>
                        {gen.result.metadata && (
                          <div className="mt-2 text-sm text-gray-400">
                            Model: {gen.result.metadata.model}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 text-sm text-gray-400">
                      <div>Generation ID: {gen.generation_id}</div>
                      <div>Created: {new Date(gen.created_at).toLocaleString()}</div>
                      <div>Updated: {new Date(gen.updated_at).toLocaleString()}</div>
                      {gen.context && <div>Context: {gen.context}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 