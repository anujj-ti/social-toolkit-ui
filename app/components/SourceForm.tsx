'use client';

import { useState } from 'react';

interface SourceFormProps {
  onSubmit: (tenantId: string, brandId: string, sourceId: string, apiKey: string) => Promise<void>;
  onListAll: (tenantId: string, brandId: string, apiKey: string) => Promise<void>;
}

export default function SourceForm({ onSubmit, onListAll }: SourceFormProps) {
  const [tenantId, setTenantId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(tenantId, brandId, sourceId, apiKey);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListAll = async () => {
    if (!tenantId || !brandId || !apiKey) return;
    setIsLoading(true);
    try {
      await onListAll(tenantId, brandId, apiKey);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Source Management</h2>
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
          <label htmlFor="brandId" className="block text-sm font-medium mb-1">
            Brand ID <span className="text-gray-400">(required)</span>
          </label>
          <input
            id="brandId"
            type="text"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="sourceId" className="block text-sm font-medium mb-1">
            Source ID <span className="text-gray-400">(required for single source)</span>
          </label>
          <input
            id="sourceId"
            type="text"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            disabled={isLoading}
            required
          />
          <p className="mt-1 text-sm text-gray-400">Optional when using List All Sources</p>
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
            {isLoading ? 'Loading...' : 'Get Source'}
          </button>
          <button
            type="button"
            onClick={handleListAll}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !tenantId || !brandId || !apiKey}
          >
            List All Sources
          </button>
        </div>
      </form>
    </div>
  );
} 