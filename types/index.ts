export interface Tenant {
  tenant_id: string;
  api_key: string;
  name: string;
  description: string;
  settings: {
    vector_store_type: string;
    vector_store_config?: {
      host: string;
      port: number;
      region: string;
      index_name: string;
    };
    anthropic_api_key?: string;
    openai_api_key?: string;
    google_ai_api_key?: string;
  };
  concurrency_limits: {
    TEXT: number;
    IMAGE: number;
    VIDEO: number;
    AUDIO: number;
  };
}

export interface Brand {
  brand_id: string;
  tenant_id: string;
  name: string;
  description: string;
  settings?: {
    [key: string]: any;
  };
}

export interface Prompt {
  prompt_id: string;
  tenant_id: string;
  name: string;
  description: string;
  content_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
  prompt_text: string;
  settings?: {
    [key: string]: any;
  };
}

export interface Worker {
  worker_id: string;
  tenant_id: string;
  name: string;
  description: string;
  output_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
  prompt: string;
  settings?: {
    [key: string]: any;
  };
}

export interface Source {
  source_id: string;
  tenant_id: string;
  brand_id: string;
  name: string;
  description: string;
  source_type: 'SAMPLE' | 'GUIDELINES' | 'KNOWLEDGE';
  content_type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  url?: string;
  text?: string;
} 