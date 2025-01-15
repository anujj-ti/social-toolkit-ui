'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import BrandCompassForm from '@/app/components/BrandCompassForm';
import { BrandCompass } from '@/types';

export default function BrandCompassManagement() {
  const [compass, setCompass] = useState<BrandCompass | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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
              <h2 className="text-xl font-bold">Brand Compass Status</h2>
              
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
                  <pre className="bg-gray-800 p-4 rounded overflow-auto">
                    {JSON.stringify(compass.generations, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 