'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import GenerationForm from '@/app/components/GenerationForm';
import { Generation } from '@/types';

export default function GenerationManagement() {
  const [generations, setGenerations] = useState<Generation[] | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());

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

  const togglePrompt = (generationId: string) => {
    const newExpanded = new Set(expandedPrompts);
    if (newExpanded.has(generationId)) {
      newExpanded.delete(generationId);
    } else {
      newExpanded.add(generationId);
    }
    setExpandedPrompts(newExpanded);
  };

  const renderFormattedResult = (generation: Generation) => {
    const isExpanded = expandedPrompts.has(generation.generation_id);

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-400">Generation {generation.generation_id}</h3>
            <p className="text-gray-400 mt-1">Status: {generation.status}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            generation.status === 'COMPLETED' ? 'bg-green-600' : 
            generation.status === 'FAILED' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            {generation.status}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => togglePrompt(generation.generation_id)}
              className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-2 hover:text-purple-200"
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              <span>Prompt</span>
            </button>
            {isExpanded && (
              <div className="bg-gray-700/50 rounded-lg p-4 whitespace-pre-wrap">
                {generation.prompt}
              </div>
            )}
          </div>

          {generation.result && (
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Result</h4>
              <div className="bg-gray-700/50 rounded-lg p-4 whitespace-pre-wrap">
                {generation.result.content}
              </div>
              {generation.result.metadata && (
                <div className="mt-2 text-sm text-gray-400">
                  <div>Model: {generation.result.metadata.model}</div>
                  <div>Type: {generation.result.metadata.type}</div>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-gray-400 space-y-1">
            <div>Worker ID: {generation.worker_id}</div>
            <div>Tenant ID: {generation.tenant_id}</div>
            <div>Brand ID: {generation.brand_id}</div>
            <div>Created: {new Date(generation.created_at).toLocaleString()}</div>
            <div>Updated: {new Date(generation.updated_at).toLocaleString()}</div>
            {generation.context && <div>Context: {generation.context}</div>}
          </div>
        </div>
      </div>
    );
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {generations.length > 1 ? 'All Generations' : 'Generation Details'}
                </h2>
                <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('formatted')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'formatted' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Formatted
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`px-3 py-1 rounded ${
                      viewMode === 'raw' 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Raw JSON
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {viewMode === 'formatted' ? (
                  generations.map((generation, index) => (
                    <div key={index}>
                      {renderFormattedResult(generation)}
                    </div>
                  ))
                ) : (
                  <pre className="bg-gray-800 p-4 rounded overflow-auto">
                    {JSON.stringify(generations, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 