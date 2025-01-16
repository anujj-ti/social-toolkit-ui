'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import PromptForm from '@/app/components/PromptForm';
import { Prompt } from '@/types';

export default function PromptManagement() {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());

  const handlePromptFetch = async (tenantId: string, promptId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/prompt?tenantId=${tenantId}&promptId=${promptId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prompt');
      }
      
      setPrompts([data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPrompts(null);
    }
  };

  const handleListAll = async (tenantId: string, apiKey: string) => {
    try {
      const response = await fetch(`/api/prompt/list?tenantId=${tenantId}&apiKey=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prompts');
      }
      
      setPrompts(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPrompts(null);
    }
  };

  const togglePrompt = (promptId: string) => {
    const newExpanded = new Set(expandedPrompts);
    if (newExpanded.has(promptId)) {
      newExpanded.delete(promptId);
    } else {
      newExpanded.add(promptId);
    }
    setExpandedPrompts(newExpanded);
  };

  const renderFormattedPrompt = (prompt: Prompt) => {
    const isExpanded = expandedPrompts.has(prompt.prompt_id);

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-400">{prompt.name}</h3>
            <p className="text-gray-400 mt-1">{prompt.description}</p>
          </div>
          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
            {prompt.content_type}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <button
              onClick={() => togglePrompt(prompt.prompt_id)}
              className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-2 hover:text-purple-200"
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              <span>Prompt Text</span>
            </button>
            {isExpanded && (
              <div className="bg-gray-700/50 rounded-lg p-4 whitespace-pre-wrap">
                {prompt.prompt_text.split('\n').map((line, i) => {
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
            <div>Prompt ID: {prompt.prompt_id}</div>
            <div>Tenant ID: {prompt.tenant_id}</div>
            <div>Status: {prompt.status}</div>
            <div>Created: {new Date(prompt.created_at).toLocaleString()}</div>
            <div>Updated: {new Date(prompt.updated_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Prompt Management</h1>
        
        <div className="space-y-6">
          <PromptForm onSubmit={handlePromptFetch} onListAll={handleListAll} />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {prompts && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {prompts.length > 1 ? 'All Prompts' : 'Prompt Details'}
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
                  prompts.map((prompt, index) => (
                    <div key={index}>
                      {renderFormattedPrompt(prompt)}
                    </div>
                  ))
                ) : (
                  <pre className="bg-gray-800 p-4 rounded overflow-auto">
                    {JSON.stringify(prompts, null, 2)}
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