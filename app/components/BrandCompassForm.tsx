'use client';

import { useState } from 'react';

interface BrandCompassFormProps {
  onTrigger: (tenantId: string, brandId: string, apiKey: string) => Promise<void>;
  onFetchStatus: (tenantId: string, brandId: string, apiKey: string) => Promise<void>;
  isLoading: boolean;
}

export default function BrandCompassForm({ onTrigger, onFetchStatus, isLoading }: BrandCompassFormProps) {
  const [tenantId, setTenantId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    await onTrigger(tenantId, brandId, apiKey);
  };

  const handleFetchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    await onFetchStatus(tenantId, brandId, apiKey);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Brand Compass Management</h2>
      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-400">
          Note: The Brand Compass process may take several minutes to complete. You can check its status using the &quot;Get Status&quot; button.
          {/* Add any other helpful information here */}
        </p>
      </div>
      <form className="space-y-4">
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
            type="button"
            onClick={handleTrigger}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={isLoading || !tenantId || !brandId || !apiKey}
          >
            {isLoading ? 'Loading...' : 'Trigger Compass'}
          </button>
          <button
            type="button"
            onClick={handleFetchStatus}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !tenantId || !brandId || !apiKey}
          >
            {isLoading ? 'Loading...' : 'Get Status'}
          </button>
        </div>
      </form>
    </div>
  );
} 