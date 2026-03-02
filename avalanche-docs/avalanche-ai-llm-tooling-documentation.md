# AI & LLM Integration (/docs/tooling/ai-llm)

---

title: AI & LLM Integration
description: Access Avalanche documentation programmatically for AI applications
icon: Bot

---

The Builder Hub provides AI-friendly access to documentation through standardized formats. Whether you're building a chatbot, using Claude/ChatGPT, or integrating with AI development tools, we offer multiple ways to access our docs.

## Endpoints Overview

| Endpoint                                                       | Purpose                           | Best For               |
| :------------------------------------------------------------- | :-------------------------------- | :--------------------- |
| [`/llms.txt`](/docs/tooling/ai-llm/llms-txt#llmstxt)           | Structured index of all docs      | Content discovery      |
| [`/llms-full.txt`](/docs/tooling/ai-llm/llms-txt#llms-fulltxt) | Complete docs in one file         | Full context loading   |
| [`/{path}.md`](/docs/tooling/ai-llm/llms-txt#individual-pages) | Markdown for any page             | Single page retrieval  |
| [`/api/mcp`](/docs/tooling/ai-llm/mcp-server)                  | MCP server for search & retrieval | Dynamic AI tool access |

## Quick Start

The fastest way to get started depends on your use case:

<Cards>
  <Card title="llms.txt Endpoints" href="/docs/tooling/ai-llm/llms-txt">
    Static endpoints for sitemap, full docs, and individual pages
  </Card>
  <Card title="MCP Server" href="/docs/tooling/ai-llm/mcp-server">
    Dynamic search and retrieval via Model Context Protocol
  </Card>
  <Card title="Security & Limits" href="/docs/tooling/ai-llm/security">
    Rate limits, CORS policy, and privacy information
  </Card>
</Cards>

## Standards

- [llms.txt](https://llmstxt.org/) - AI sitemap standard
- [Model Context Protocol](https://modelcontextprotocol.io/) - Anthropic's standard for AI tool access
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification) - MCP server protocol

# llms.txt Endpoints (/docs/tooling/ai-llm/llms-txt)

---

title: llms.txt Endpoints
description: Static endpoints for AI content discovery and retrieval

---

## llms.txt

A structured markdown index following the [llms.txt standard](https://llmstxt.org/). Use this for content discovery.

```
https://build.avax.network/llms.txt
```

Returns organized sections (Documentation, Academy, Integrations, Blog) with links and descriptions.

## llms-full.txt

All documentation content in a single markdown file for one-time context loading.

```
https://build.avax.network/llms-full.txt
```

Contains 1300+ pages. For models with limited context, use the [MCP server](/docs/tooling/ai-llm/mcp-server) or individual page endpoint instead.

## Individual Pages

Append `.md` to any page URL to get processed markdown:

```
https://build.avax.network/docs/primary-network/overview.md
https://build.avax.network/academy/blockchain-fundamentals/blockchain-intro.md
https://build.avax.network/blog/your-first-l1.md
https://build.avax.network/integrations/chainlink.md
```

Works with `/docs/`, `/academy/`, `/integrations/`, and `/blog/` paths. Returns clean markdown with JSX components stripped for optimal AI consumption.

# MCP Server (/docs/tooling/ai-llm/mcp-server)

---

title: MCP Server
description: Search and retrieve Avalanche documentation dynamically via Model Context Protocol

---

The [Model Context Protocol](https://modelcontextprotocol.io/) server enables AI systems to search and retrieve documentation dynamically.

**Endpoint:** `https://build.avax.network/api/mcp`

## Tools

| Tool                           | Purpose                                          |
| :----------------------------- | :----------------------------------------------- |
| `avalanche_docs_search`        | Search docs by query with optional source filter |
| `avalanche_docs_fetch`         | Get a specific page by URL path                  |
| `avalanche_docs_list_sections` | List all sections with page counts               |

## Claude Code Setup

Add the MCP server to your project:

```bash
claude mcp add avalanche-docs --transport http https://build.avax.network/api/mcp
```

Or add to your `.claude/settings.json`:

```json
{
  "mcpServers": {
    "avalanche-docs": {
      "transport": {
        "type": "http",
        "url": "https://build.avax.network/api/mcp"
      }
    }
  }
}
```

## Claude Desktop Setup

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "avalanche-docs": {
      "transport": {
        "type": "http",
        "url": "https://build.avax.network/api/mcp"
      }
    }
  }
}
```

## JSON-RPC Protocol

The MCP server uses JSON-RPC 2.0 for communication:

```bash
curl -X POST https://build.avax.network/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"avalanche_docs_search","arguments":{"query":"create L1","limit":5}}}'
```

**Response format:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "[{\"title\":\"Create an L1\",\"url\":\"/docs/avalanche-l1s/create\",\"description\":\"...\",\"score\":45}]"
      }
    ]
  }
}
```

## Search Examples

**Search all documentation:**

```bash
curl -X POST https://build.avax.network/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "avalanche_docs_search",
      "arguments": {
        "query": "smart contracts",
        "limit": 10
      }
    }
  }'
```

**Filter by source:**

```bash
# Search only academy content
curl -X POST https://build.avax.network/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "avalanche_docs_search",
      "arguments": {
        "query": "blockchain basics",
        "source": "academy",
        "limit": 5
      }
    }
  }'
```

**Fetch specific page:**

```bash
curl -X POST https://build.avax.network/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "avalanche_docs_fetch",
      "arguments": {
        "url": "/docs/primary-network/overview"
      }
    }
  }'
```

# Security & Limits (/docs/tooling/ai-llm/security)

---

title: Security & Limits
description: Rate limiting, CORS policy, and privacy information for AI endpoints

---

## Rate Limiting

- **60 requests per minute** per client (identified by origin or IP address)
- 429 status code with Retry-After header when exceeded
- RateLimit headers included in responses (Limit, Remaining, Reset)

## CORS Policy

Browser requests must originate from:

- `https://claude.ai`
- `https://build.avax.network`
- `http://localhost:3000` (development only)

Non-browser MCP clients (no Origin header) are always allowed.

## Privacy

We collect anonymized usage metrics including:

- Tool names and invocation counts
- Search result counts (not full query text)
- Latency measurements
- Client names (e.g., "claude-desktop")

We do NOT log:

- Full query text (truncated to 100 characters)
- Document content
- Raw IP addresses (hashed for rate limiting)

## Abuse Reporting

Report security issues or abuse to: **security@avalabs.org**
