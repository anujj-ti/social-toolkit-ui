'use client';

import { useState } from 'react';

interface WorkerFormProps {
  onSubmit: (tenantId: string, workerId: string, apiKey: string) => Promise<void>;
  onListAll: (tenantId: string, apiKey: string) => Promise<void>;
  onCreate: (tenantId: string, apiKey: string, workerData: {
    name: string;
    description: string;
    output_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
    prompt: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export default function WorkerForm({ onSubmit, onListAll, onCreate, isLoading }: WorkerFormProps) {
  const [tenantId, setTenantId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newWorker, setNewWorker] = useState<{
    name: string;
    description: string;
    output_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
    prompt: string;
  }>({
    name: '',
    description: '',
    output_type: 'TEXT',
    prompt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(tenantId, workerId, apiKey);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleListAll = async () => {
    if (!tenantId || !apiKey) return;
    try {
      await onListAll(tenantId, apiKey);
    } catch (error) {
      console.error('List all error:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(tenantId, apiKey, newWorker);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Worker Management</h2>
      
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {isCreating ? '← Back to Search' : '+ Create New Worker'}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleCreate} className="space-y-4">
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
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name <span className="text-gray-400">(required)</span>
            </label>
            <input
              id="name"
              type="text"
              value={newWorker.name}
              onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description <span className="text-gray-400">(required)</span>
            </label>
            <input
              id="description"
              type="text"
              value={newWorker.description}
              onChange={(e) => setNewWorker({...newWorker, description: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="output_type" className="block text-sm font-medium mb-1">
              Output Type <span className="text-gray-400">(required)</span>
            </label>
            <select
              id="output_type"
              value={newWorker.output_type}
              onChange={(e) => setNewWorker({
                ...newWorker, 
                output_type: e.target.value as 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO'
              })}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              disabled={isLoading}
              required
            >
              <option value="TEXT">TEXT</option>
              <option value="IMAGE">IMAGE</option>
              <option value="VIDEO">VIDEO</option>
              <option value="AUDIO">AUDIO</option>
            </select>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Prompt <span className="text-gray-400">(required)</span>
            </label>
            <textarea
              id="prompt"
              value={newWorker.prompt}
              onChange={(e) => setNewWorker({...newWorker, prompt: e.target.value})}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 h-32"
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Worker'}
          </button>
        </form>
      ) : (
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
      )}
    </div>
  );
} 