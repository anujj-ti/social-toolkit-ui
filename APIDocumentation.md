API Reference
This document provides detailed information about the Brand Memory API endpoints.

Authorization
The API uses two types of authorization:

Public Endpoints - No authorization required

Creating a tenant (POST /tenant)
Admin Endpoints - Requires admin authorization

Listing all tenants (GET /tenant)
Contact vinayak.sachdeva@codenation.co.in for admin access
Tenant-Specific Endpoints - Requires tenant API key

All other endpoints
Use the API key received during tenant creation as a Bearer token
Using the API Key
For all tenant-specific endpoints, include the API key in the Authorization header:

Authorization: Bearer <your-tenant-api-key>

Base URL
All API endpoints are available at:

https://social-toolkit.ti.trilogy.com/

Vector Store
Brand Memory uses vector storage to store and manage analyzed source content. By default, it uses an internal vector store, but you can optionally configure OpenSearch as your vector store backend.

The vector store is essential for:

Storing embeddings of analyzed content
Enabling semantic search capabilities
Structuring brand-related information for quick retrieval
Supporting natural language querying of brand content
When creating a tenant, you can optionally provide OpenSearch configuration details:

POST /tenant
Content-Type: application/json

{
    "name": "Your Company",
    "description": "Your company description",
    "settings": {
        "vector_store_type": "opensearch",
        "vector_store_config": {
            "host": "your-opensearch-host",
            "port": 443,
            "region": "us-east-1",
            "index_name": "your-index"
        },
        "anthropic_api_key": "your-anthropic-key",
        "openai_api_key": "your-openai-key",
        "google_ai_api_key": "your-google-ai-key"
    },
    "concurrency_limits": {
        "TEXT": 10,
        "IMAGE": 5,
        "VIDEO": 3,
        "AUDIO": 3
    },
}

If OpenSearch configuration is not provided, the system will automatically use the default internal vector store.

Model Context Protocol (MCP)
All API endpoints described below are also available as MCP operations. MCP (Model Context Protocol) is a standardized way to interact with AI models and manage their context. Using MCP allows for better interoperability and standardization across different AI services.

Note: Currently MCP only supports local connections, so it doesn't support remote use of these tools.

Benefits of MCP
Standardized Interactions: MCP provides a consistent interface for working with different AI models and services
Context Management: Better handling of context windows and model memory
Interoperability: Seamlessly switch between different AI providers while maintaining the same interface
Enhanced Control: Fine-grained control over model parameters and context handling
MCP Operations
All API endpoints can be accessed through MCP operations. For example:

# Creating a tenant via MCP
tenant = session.call_tool("create_tenant", {
    "name": "Social Savvy",
    "description": "AI Podcast Studio",
    "settings": {
        "vector_store_type": "opensearch",
        # ... other settings ...
    }
})

Example Client

Setting up MCP
To use the MCP client:

Run the setup script:
./setup.sh

Start the MCP client:
./run.sh

Tenant Management
Create Tenant
This is a public endpoint that doesn't require authorization.

POST /tenant
Content-Type: application/json

{
    "name": "Your Company or Application",
    "description": "Your company or application description",
    "settings": {
        "vector_store_type": "opensearch",
        "vector_store_config": {
            "host": "your-opensearch-host",
            "port": 443,
            "region": "us-east-1",
            "index_name": "your-index"
        },
        "anthropic_api_key": "your-anthropic-key",
        "openai_api_key": "your-openai-key",
        "google_ai_api_key": "your-google-ai-key"
    },
    "concurrency_limits": {
        "TEXT": 10,
        "IMAGE": 5,
        "VIDEO": 3,
        "AUDIO": 3
    },
}

Response:

{
    "tenant_id": "t-123456",
    "api_key": "sk-tenant-abcdef123456",
    "name": "Your Company or Application",
    "description": "Your company or application description",
    "settings": {
        "vector_store_type": "opensearch",
        "vector_store_config": {
            "host": "your-opensearch-host",
            "port": 443,
            "region": "us-east-1",
            "index_name": "your-index"
        },
        "anthropic_api_key": "your-anthropic-key",
        "openai_api_key": "your-openai-key",
        "google_ai_api_key": "your-google-ai-key"
    },
    "concurrency_limits": {
        "TEXT": 10,
        "IMAGE": 5,
        "VIDEO": 3,
        "AUDIO": 3
    },
}

Get Tenant
Requires tenant authorization.

GET /tenant/{tenant_id}
Authorization: Bearer <tenant-api-key>

List Tenants
Requires admin authorization. Contact vinayak.sachdeva@codenation.co.in for admin access.

GET /tenant
Authorization: Bearer <admin-api-key>

Update Tenant
Requires tenant authorization.

PUT /tenant/{tenant_id}
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

Delete Tenant
Requires tenant authorization.

DELETE /tenant/{tenant_id}
Authorization: Bearer <tenant-api-key>

Brand Management
Create Brand
Requires tenant authorization.

POST /tenant/{tenant_id}/brand
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

{
    "name": "Your Brand",
    "description": "Your brand description",
    "settings": {
        // Optional brand-specific settings
    }
}

Get Brand
Requires tenant authorization.

GET /tenant/{tenant_id}/brand/{brand_id}
Authorization: Bearer <tenant-api-key>

List Brands
Requires tenant authorization.

GET /tenant/{tenant_id}/brand
Authorization: Bearer <tenant-api-key>

Update Brand
Requires tenant authorization.

PUT /tenant/{tenant_id}/brand/{brand_id}
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

{
    "name": "Updated Brand",
    "description": "Updated description",
    "settings": {
        // Updated settings
    }
}

Delete Brand
Requires tenant authorization.

DELETE /tenant/{tenant_id}/brand/{brand_id}
Authorization: Bearer <tenant-api-key>

Trigger Brand Compass
Requires tenant authorization.

POST /tenant/{tenant_id}/brand/{brand_id}/compass/trigger
Authorization: Bearer <tenant-api-key>

Get Brand Compass
Requires tenant authorization.

GET /tenant/{tenant_id}/brand/{brand_id}/compass
Authorization: Bearer <tenant-api-key>

Response:

{
    "status": "PROCESSING",
    "generations": [...],
    "triggered_at": "2024-01-08T12:00:00Z",
    "completed_at": null,
    "progress": {
        "total_workers": 5,
        "completed_workers": 2,
        "percent_complete": 40
    }
}

Source Management
Add Source
Requires tenant authorization.

POST /tenant/{tenant_id}/brand/{brand_id}/source
Authorization: Bearer <tenant-api-key>
Content-Type: multipart/form-data

{
    "name": "Sample Content",
    "description": "Content description",
    "source_type": "SAMPLE", // SAMPLE, GUIDELINES, or KNOWLEDGE
    "content_type": "TEXT", // TEXT, IMAGE, AUDIO, or VIDEO
    "file": <file-data>
    // OR
    "url": "https://example.com/content",
    // OR
    "text": "Direct text content..."
}

Get Source
Requires tenant authorization.

GET /tenant/{tenant_id}/brand/{brand_id}/source/{source_id}
Authorization: Bearer <tenant-api-key>

List Sources
Requires tenant authorization.

GET /tenant/{tenant_id}/brand/{brand_id}/source
Authorization: Bearer <tenant-api-key>

Query parameters:

source_type: Filter by source type
status: Filter by status
Delete Source
Requires tenant authorization.

DELETE /tenant/{tenant_id}/brand/{brand_id}/source/{source_id}
Authorization: Bearer <tenant-api-key>

Reprocess Source
Requires tenant authorization.

POST /tenant/{tenant_id}/brand/{brand_id}/source/{source_id}/reprocess
Authorization: Bearer <tenant-api-key>

Prompt Management
Create Prompt
Requires tenant authorization.

POST /tenant/{tenant_id}/prompt
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

{
    "name": "Voice Analysis",
    "description": "Analyze content tone and voice",
    "content_type": "TEXT",
    "prompt_text": "Analyze this content and describe how it reflects our brand voice",
    "settings": {
        // Optional prompt-specific settings
    }
}

Get Prompt
Requires tenant authorization.

GET /tenant/{tenant_id}/prompt/{prompt_id}
Authorization: Bearer <tenant-api-key>

List Prompts
Requires tenant authorization.

GET /tenant/{tenant_id}/prompt
Authorization: Bearer <tenant-api-key>

Query parameters:

content_type: Filter by content type
Update Prompt
Requires tenant authorization.

PUT /tenant/{tenant_id}/prompt/{prompt_id}
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

{
    "name": "Updated Name",
    "description": "Updated description",
    "prompt_text": "Updated prompt text"
}

Delete Prompt
Requires tenant authorization.

DELETE /tenant/{tenant_id}/prompt/{prompt_id}
Authorization: Bearer <tenant-api-key>

Worker Management
Create Worker
Requires tenant authorization.

POST /tenant/{tenant_id}/worker
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

{
    "name": "Social Media Generator",
    "description": "Generate social media posts",
    "output_type": "TEXT",
    "prompt": "Create a social media post that matches our brand voice"
}

Get Worker
Requires tenant authorization.

GET /tenant/{tenant_id}/worker/{worker_id}
Authorization: Bearer <tenant-api-key>

List Workers
Requires tenant authorization.

GET /tenant/{tenant_id}/worker
Authorization: Bearer <tenant-api-key>

Query parameters:

output_type: Filter by output type
Update Worker
Requires tenant authorization.

PUT /tenant/{tenant_id}/worker/{worker_id}
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

{
    "name": "Updated Name",
    "description": "Updated description",
    "prompt": "Updated prompt"
}

Delete Worker
Requires tenant authorization.

DELETE /tenant/{tenant_id}/worker/{worker_id}
Authorization: Bearer <tenant-api-key>

Generation Management
Create Generation
Requires tenant authorization.

POST /tenant/{tenant_id}/brand/{brand_id}/worker/{worker_id}/generation
Authorization: Bearer <tenant-api-key>
Content-Type: application/json

{
    "context": "Optional context for generation"
}

Get Generation
Requires tenant authorization.

GET /tenant/{tenant_id}/brand/{brand_id}/worker/{worker_id}/generation/{generation_id}
Authorization: Bearer <tenant-api-key>

List Generations
Requires tenant authorization.

GET /tenant/{tenant_id}/brand/{brand_id}/worker/{worker_id}/generation
Authorization: Bearer <tenant-api-key>

API Configuration
Brand Memory uses different AI providers for specific tasks:

Model Usage
Text Analysis & Generation: Uses Anthropic's Claude 3.5 Sonnet model (claude-3-5-sonnet-20241022)

Handles all text-based operations
Requires Anthropic API key
Text Embeddings: Uses OpenAI's embedding model (text-embedding-3-large)

Creates vector representations of text content
Used for semantic search and content organization
Requires OpenAI API key
Multi-modal Content: Uses Google's Gemini model (gemini-1.5-pro-001)

Processes images, audio, and video content
Handles analysis of non-text media
Requires Google AI API key
Concurrency Management
Each tenant can optionally configure concurrency limits per content type. If not specified, the system will use default values:

"concurrency_limits": {
    "TEXT": 10,    // Maximum parallel text operations
    "IMAGE": 5,    // Maximum parallel image operations
    "VIDEO": 3,    // Maximum parallel video operations
    "AUDIO": 3     // Maximum parallel audio operations
}

These limits help:

Manage API rate limits across providers
Control resource utilization
Ensure stable system performance
Prevent overloading of processing queues
If not specified, the system will use default concurrency values that are suitable for most use cases.