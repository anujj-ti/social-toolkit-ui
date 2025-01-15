'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import WorkerForm from '@/app/components/WorkerForm';
import { Worker } from '@/types';

export default function WorkerManagement() {
  const [workers, setWorkers] = useState<Worker[] | null>(null);
  const [error, setError] = useState<string>('');

  const handleWorkerFetch = async (tenantId: string, workerId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/worker?tenantId=${tenantId}&workerId=${workerId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch worker');
      }
      
      setWorkers([data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWorkers(null);
    }
  };

  const handleListAll = async (tenantId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/worker/list?tenantId=${tenantId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workers');
      }
      
      setWorkers(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWorkers(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Worker Management</h1>
        
        <div className="space-y-6">
          <WorkerForm onSubmit={handleWorkerFetch} onListAll={handleListAll} />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {workers && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                {workers.length > 1 ? 'All Workers' : 'Worker Details'}
              </h2>
              <pre className="bg-gray-800 p-4 rounded overflow-auto">
                {JSON.stringify(workers, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 