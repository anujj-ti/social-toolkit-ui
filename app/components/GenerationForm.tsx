'use client';

import { useState } from 'react';

interface GenerationFormProps {
  onCreate: (tenantId: string, brandId: string, workerId: string, apiKey: string, context?: string) => Promise<void>;
  onGet: (tenantId: string, brandId: string, workerId: string, generationId: string, apiKey: string) => Promise<void>;
  onListAll: (tenantId: string, brandId: string, workerId: string, apiKey: string) => Promise<void>;
  isLoading: boolean;
}

export default function GenerationForm({ onCreate, onGet, onListAll, isLoading }: GenerationFormProps) {
  const [tenantId, setTenantId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [generationId, setGenerationId] = useState('');
  const [context, setContext] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(tenantId, brandId, workerId, apiKey, context || undefined);
  };

  const handleGet = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGet(tenantId, brandId, workerId, generationId, apiKey);
  };

  const handleListAll = async () => {
    await onListAll(tenantId, brandId, workerId, apiKey);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Generation Management</h2>
      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-400">
          Create new generations, fetch specific generations, or list all generations for a worker.
          <br />
          <span className="mt-2 block font-medium text-yellow-400">Important:</span>
          <span className="block">• Context is used for creating a new generation, but is an Optional field</span>
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
          <label htmlFor="workerId" className="block text-sm font-medium mb-1">
            Worker ID <span className="text-gray-400">(required)</span>
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
        <div>
          <label htmlFor="generationId" className="block text-sm font-medium mb-1">
            Generation ID <span className="text-gray-400">(required for single generation)</span>
          </label>
          <input
            id="generationId"
            type="text"
            value={generationId}
            onChange={(e) => setGenerationId(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-400">Required when fetching a specific generation</p>
        </div>
        <div>
          <label htmlFor="context" className="block text-sm font-medium mb-1">
            Context <span className="text-gray-400">(used for create generation but is optional)</span>
          </label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 h-24"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-400">Only used when creating a new generation. Not needed for Get or List operations.</p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCreate}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={isLoading || !tenantId || !brandId || !workerId || !apiKey}
          >
            {isLoading ? 'Loading...' : 'Create Generation'}
          </button>
          <button
            type="button"
            onClick={handleGet}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={isLoading || !tenantId || !brandId || !workerId || !generationId || !apiKey}
          >
            {isLoading ? 'Loading...' : 'Get Generation'}
          </button>
          <button
            type="button"
            onClick={handleListAll}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !tenantId || !brandId || !workerId || !apiKey}
          >
            List All
          </button>
        </div>
      </form>
    </div>
  );
} 