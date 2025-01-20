'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import SourceForm from '@/app/components/SourceForm';
import { Source } from '@/types';

export default function SourceManagement() {
  const [sources, setSources] = useState<Source[] | null>(null);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [expandedAnalysis, setExpandedAnalysis] = useState<Set<string>>(new Set());

  const handleSourceFetch = async (tenantId: string, brandId: string, sourceId: string, apiKey: string) => {
    try {
      const response = await fetch(
        `/api/source?tenantId=${tenantId}&brandId=${brandId}&sourceId=${sourceId}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch source');
      }
      
      setSources([data]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSources(null);
    }
  };

  const handleListAll = async (tenantId: string, brandId: string, apiKey: string) => {
    try {
      const response = await fetch(
        `/api/source/list?tenantId=${tenantId}&brandId=${brandId}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sources');
      }
      
      setSources(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSources(null);
    }
  };

  const toggleAnalysis = (sourceId: string) => {
    const newExpanded = new Set(expandedAnalysis);
    if (newExpanded.has(sourceId)) {
      newExpanded.delete(sourceId);
    } else {
      newExpanded.add(sourceId);
    }
    setExpandedAnalysis(newExpanded);
  };

  const renderFormattedSource = (source: Source) => {
    const isExpanded = expandedAnalysis.has(source.source_id);
    const hasAnalysisResults = source.analysis_results && Object.keys(source.analysis_results).length > 0;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-400">{source.name}</h3>
            <p className="text-gray-400 mt-1">{source.description}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              source.status === 'COMPLETED' ? 'bg-green-600' : 
              source.status === 'FAILED' ? 'bg-red-600' : 'bg-yellow-600'
            }`}>
              {source.status}
            </span>
            <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
              {source.content_type}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-400 space-y-1">
            <div>Source ID: {source.source_id}</div>
            <div>Tenant ID: {source.tenant_id}</div>
            <div>Brand ID: {source.brand_id}</div>
            <div>Source Type: {source.source_type}</div>
            {source.url && <div>URL: {source.url}</div>}
            {source.text && (
              <div>
                <div className="font-medium mb-1">Text Content:</div>
                <div className="bg-gray-700/50 rounded-lg p-4 whitespace-pre-wrap">
                  {source.text}
                </div>
              </div>
            )}
            
            {hasAnalysisResults && (
              <div>
                <button
                  onClick={() => toggleAnalysis(source.source_id)}
                  className="flex items-center gap-2 text-lg font-semibold text-purple-300 mb-2 hover:text-purple-200"
                >
                  <span>{isExpanded ? '▼' : '▶'}</span>
                  <span>Analysis Results</span>
                  <span className="text-sm text-gray-400">
                    ({source.num_analysis_prompts_triggered} prompts)
                  </span>
                </button>
                {isExpanded && (
                  <div className="space-y-4">
                    {Object.entries(source.analysis_results!).map(([promptId, result]) => (
                      <div key={promptId} className="bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-purple-300 mb-2">Prompt Id: {promptId}</h4>
                        <div className="whitespace-pre-wrap">
                          {result.analysis.split('\n').map((line, i) => {
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
                        <div className="mt-2 text-sm text-gray-400">
                          Status: {result.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Source Management</h1>
        
        <div className="space-y-6">
          <SourceForm onSubmit={handleSourceFetch} onListAll={handleListAll} />
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {sources && (
            <div className="p-6 bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {sources.length > 1 ? 'All Sources' : 'Source Details'}
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
                  sources.map((source, index) => (
                    <div key={index}>
                      {renderFormattedSource(source)}
                    </div>
                  ))
                ) : (
                  <pre className="bg-gray-800 p-4 rounded overflow-auto">
                    {JSON.stringify(sources, null, 2)}
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