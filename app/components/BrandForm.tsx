'use client';

import { useState } from 'react';

interface BrandFormProps {
  onSubmit: (tenantId: string, brandId: string, apiKey: string) => Promise<void>;
}

export default function BrandForm({ onSubmit }: BrandFormProps) {
  const [tenantId, setTenantId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(tenantId, brandId, apiKey);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Fetch Brand Details</h2>
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