'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import WorkerForm from '@/app/components/WorkerForm';
import { Worker } from '@/types';

export default function WorkerManagement() {
  const [workers, setWorkers] = useState<Worker[] | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());

  const handleWorkerFetch = async (tenantId: string, workerId: string, apiKey: string) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleListAll = async (tenantId: string, apiKey: string) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const togglePrompt = (workerId: string) => {
    const newExpanded = new Set(expandedPrompts);
    if (newExpanded.has(workerId)) {
      newExpanded.delete(workerId);
    } else {
      newExpanded.add(workerId);
    }
    setExpandedPrompts(newExpanded);
  };

  const renderFormattedWorker = (worker: Worker) => {
    const isExpanded = expandedPrompts.has(worker.worker_id);

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-400">{worker.name}</h3>
            <p className="text-gray-400 mt-1">{worker.description}</p>
          </div>
          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
            {worker.output_type}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => togglePrompt(worker.worker_id)}
              className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-2 hover:text-purple-200"
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              <span>Prompt</span>
            </button>
            {isExpanded && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                {worker.prompt.split('\n').map((line, i) => {
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
            )}
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <div>Worker ID: {worker.worker_id}</div>
            <div>Tenant ID: {worker.tenant_id}</div>
            <div>Created: {new Date(worker.created_at).toLocaleString()}</div>
            <div>Updated: {new Date(worker.updated_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Worker Management</h1>
        
        <div className="space-y-6">
          <WorkerForm 
            onSubmit={handleWorkerFetch}
            onListAll={handleListAll}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {workers && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {workers.length > 1 ? 'All Workers' : 'Worker Details'}
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
                  workers.map((worker, index) => (
                    <div key={index}>
                      {renderFormattedWorker(worker)}
                    </div>
                  ))
                ) : (
                  <pre className="bg-gray-800 p-4 rounded overflow-auto">
                    {JSON.stringify(workers, null, 2)}
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