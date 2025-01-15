'use client';

import { useState } from 'react';

interface WorkerFormProps {
  onSubmit: (tenantId: string, workerId: string, apiKey: string) => Promise<void>;
  onListAll: (tenantId: string, apiKey: string) => Promise<void>;
}

export default function WorkerForm({ onSubmit, onListAll }: WorkerFormProps) {
  const [tenantId, setTenantId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(tenantId, workerId, apiKey);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListAll = async () => {
    if (!tenantId || !apiKey) return;
    setIsLoading(true);
    try {
      await onListAll(tenantId, apiKey);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Worker Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tenantId" className="block text-sm font-medium mb-1">
            Tenant ID <span className="text-gray-400">(required)</span>
          </label>
          <input
            id="tenantId"
            type="text"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="workerId" className="block text-sm font-medium mb-1">
            Worker ID <span className="text-gray-400">(required for single worker)</span>
          </label>
          <input
            id="workerId"
            type="text"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            disabled={isLoading}
            required
          />
          <p className="mt-1 text-sm text-gray-400">Optional when using List All Workers</p>
        </div>
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
            API Key <span className="text-gray-400">(required)</span>
          </label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            disabled={isLoading}
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Worker'}
          </button>
          <button
            type="button"
            onClick={handleListAll}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !tenantId || !apiKey}
          >
            List All Workers
          </button>
        </div>
      </form>
    </div>
  );
} 