'use client';

import { useState } from 'react';

interface SourceFormProps {
  onSubmit: (tenantId: string, brandId: string, sourceId: string, apiKey: string) => Promise<void>;
}

export default function SourceForm({ onSubmit }: SourceFormProps) {
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

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Fetch Source Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tenantId" className="block text-sm font-medium mb-1">
            Tenant ID
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
            Brand ID
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
            Source ID
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
        </div>
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
            API Key
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
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
} 