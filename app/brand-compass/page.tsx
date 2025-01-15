'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import BrandCompassForm from '@/app/components/BrandCompassForm';
import { BrandCompass } from '@/types';

export default function BrandCompassManagement() {
  const [compass, setCompass] = useState<BrandCompass | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const handleTrigger = async (tenantId: string, brandId: string, apiKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/brand-compass/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId, brandId, apiKey }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to trigger brand compass');
      }
      
      setError('');
      // After triggering, fetch the initial status
      await handleFetchStatus(tenantId, brandId, apiKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCompass(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchStatus = async (tenantId: string, brandId: string, apiKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/brand-compass/status?tenantId=${tenantId}&brandId=${brandId}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch brand compass status');
      }
      
      setCompass(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCompass(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedGenerations = () => {
    if (!compass?.generations?.length) return null;

    return (
      <div className="space-y-6">
        {compass.generations.map((gen, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6">
            <div className="mb-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Prompt</h3>
                <div className="bg-gray-700/50 rounded-lg p-4 text-sm">
                  {gen.prompt.split('\n').map((line, i) => {
                    // Handle different types of lines
                    if (line.startsWith('##')) {
                      return (
                        <h4 key={i} className="text-lg font-semibold text-purple-300 mt-4 mb-2">
                          {line.replace('##', '').trim()}
                        </h4>
                      );
                    }
                    if (line.startsWith('#')) {
                      return (
                        <h3 key={i} className="text-xl font-semibold text-purple-300 mt-4 mb-2">
                          {line.replace('#', '').trim()}
                        </h3>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <li key={i} className="ml-4 mb-1">
                          {line.replace('- ', '')}
                        </li>
                      );
                    }
                    if (line.trim() === '') {
                      return <div key={i} className="h-2" />;
                    }
                    return (
                      <p key={i} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Response</h3>
                {gen.result?.status === 'success' && (
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    {gen.result.content.split('\n').map((line, i) => {
                      // Handle different types of lines in the response
                      if (line.startsWith('##')) {
                        return (
                          <h4 key={i} className="text-lg font-semibold text-purple-300 mt-4 mb-2">
                            {line.replace('##', '').trim()}
                          </h4>
                        );
                      }
                      if (line.startsWith('#')) {
                        return (
                          <h3 key={i} className="text-xl font-semibold text-purple-300 mt-4 mb-2">
                            {line.replace('#', '').trim()}
                          </h3>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={i} className="ml-4 mb-1">
                            {line.replace('- ', '')}
                          </li>
                        );
                      }
                      if (line.trim() === '') {
                        return <div key={i} className="h-2" />;
                      }
                      return (
                        <p key={i} className="mb-2 last:mb-0">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                )}
                {gen.result?.status !== 'success' && (
                  <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
                    Generation failed
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <div>Status: {gen.status}</div>
                <div>Created: {new Date(gen.created_at).toLocaleString()}</div>
                {gen.updated_at && (
                  <div>Updated: {new Date(gen.updated_at).toLocaleString()}</div>
                )}
                {gen.result?.metadata && (
                  <div>Model: {gen.result.metadata.model}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Brand Compass</h1>
        
        <div className="space-y-6">
          <BrandCompassForm 
            onTrigger={handleTrigger} 
            onFetchStatus={handleFetchStatus}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {compass && (
            <div className="p-6 bg-gray-900 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Brand Compass Status</h2>
                {compass.generations.length > 0 && (
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
                )}
              </div>
              
              <div className="bg-gray-800 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded ${
                    compass.status === 'COMPLETED' ? 'bg-green-600' :
                    compass.status === 'PROCESSING' ? 'bg-blue-600' :
                    'bg-red-600'
                  }`}>
                    {compass.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Triggered At:</span>
                    <span className="ml-2">{new Date(compass.triggered_at).toLocaleString()}</span>
                  </div>
                  {compass.completed_at && (
                    <div>
                      <span className="font-medium">Completed At:</span>
                      <span className="ml-2">{new Date(compass.completed_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {compass.status === 'PROCESSING' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress: {compass.progress.percent_complete}%</span>
                      <span>{compass.progress.completed_workers} / {compass.progress.total_workers} workers</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${compass.progress.percent_complete}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {compass.generations.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-2">Generations</h3>
                  {viewMode === 'formatted' ? (
                    renderFormattedGenerations()
                  ) : (
                    <pre className="bg-gray-800 p-4 rounded overflow-auto">
                      {JSON.stringify(compass.generations, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 