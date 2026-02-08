# Prime Security (Under Pressure Looming)

The base layer for our future, impenetrable universal undercore.

A self-organizing, multi-agent security framework designed to be resilient, modular, and self-improving while operating within the constraints of the [Core Directive](./CORE_DIRECTIVE.md).

[![CI/CD Pipeline](https://github.com/dshvvvshr/Prime-security/actions/workflows/ci.yml/badge.svg)](https://github.com/dshvvvshr/Prime-security/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Vision

Prime Security implements principles from autonomic computing, multi-agent AI systems, and self-organizing systems to create a security framework that can:

- **Self-configure**: Adapt to new environments and requirements
- **Self-heal**: Detect and recover from failures automatically  
- **Self-optimize**: Improve performance over time
- **Self-protect**: Defend against threats and maintain integrity

All while operating within the immutable boundaries defined by the **Core Directive**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Core Directive Layer                      │
│        (Immutable principles governing all behavior)         │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│  Multi-Agent   │   │  Self-Building  │   │    Security    │
│  Coordination  │◄──┤    & Repair     │──►│    Services    │
└────────────────┘   └─────────────────┘   └────────────────┘
```

See [Architecture Documentation](./notes/ARCHITECTURE_DRAFT.md) for details.

---

## 🚀 Quick Start

### Installation

```bash
npm install prime-security
```

### Basic Usage

```typescript
import { primeSecurity, crypto, auditLogger } from 'prime-security';

// Initialize the system
await primeSecurity.initialize();
await primeSecurity.start();

// Use security primitives
const hashed = crypto.hash('sensitive data');
const random = crypto.generateSecureRandom(32);

// System automatically logs to audit trail
console.log(auditLogger.count()); // View audit events

// Graceful shutdown
await primeSecurity.stop();
```

### Custom Module

```typescript
import { registry, Module } from 'prime-security';

const myModule: Module = {
  name: 'custom-module',
  version: '1.0.0',
  dependencies: ['core-security'],
  
  init: async () => {
    console.log('Initializing custom module');
  },
  
  start: async () => {
    console.log('Custom module started');
  },
  
  stop: async () => {
    console.log('Custom module stopped');
  }
};

registry.register(myModule);
```

---

## 📚 Core Concepts

### Digital DNA

The system's architecture is represented as a "blueprint" (Digital DNA) that can reconstruct and extend the system:

```typescript
import { DNAManager } from 'prime-security';

const dna = DNAManager.createMinimal();
console.log(dna.modules); // See registered modules
```

### Module Registry

Dynamic plugin system with lifecycle management:
- **Init**: Prepare resources
- **Start**: Begin operation
- **Stop**: Graceful shutdown  
- **Destroy**: Cleanup

### Audit Logging

All critical operations are logged for compliance:

```typescript
import { auditLogger, AuditLevel } from 'prime-security';

auditLogger.log(
  AuditLevel.INFO,
  'my-component',
  'user-login',
  { userId: '123', ip: '192.168.1.1' }
);

// Query audit trail
const recent = auditLogger.query({ 
  component: 'my-component',
  since: new Date(Date.now() - 3600000),
  limit: 100
});
```

### Compliance Checking

Verify Core Directive adherence:

```typescript
import { complianceChecker } from 'prime-security';

const isCompliant = await complianceChecker.isCompliant();
const results = await complianceChecker.runAll();
```

---

## 🛠️ Development

### Setup

```bash
git clone https://github.com/dshvvvshr/Prime-security.git
cd Prime-security
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test                # Run tests
npm run test:coverage   # With coverage
npm run test:watch      # Watch mode
```

### Lint

```bash
npm run lint            # Check code
npm run lint:fix        # Fix issues
npm run format          # Format with Prettier
```

---

## 📖 Documentation

- **[Core Directive](./CORE_DIRECTIVE.md)** - Foundational principles (required reading)
- **[Architecture](./notes/ARCHITECTURE_DRAFT.md)** - System design and components
- **[Research Foundations](./UNDER_PRESSURE_LOOMING.md)** - Theoretical background and tools
- **[OpenSSL Development Guide](./docs/OPENSSL_DEVELOPMENT.md)** - Working with OpenSSL source code
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[License](./LICENSE)** - MIT License

---

## 🔐 Security

Security is not a feature—it's the foundation. This project implements:

- **Defense in depth**: Multiple security layers
- **Zero trust**: Verify all requests
- **Encryption**: AES-256-GCM for data, TLS 1.3 for transport
- **Input validation**: All inputs sanitized and validated
- **Audit logging**: Immutable audit trail
- **Compliance checks**: Automated Core Directive verification

**Report vulnerabilities privately** to project maintainers.

---

## 🌟 Key Features

- ✅ Cryptographic primitives (AES, SHA, HMAC, PBKDF2)
- ✅ Input validation and sanitization
- ✅ Module registry with dependency resolution
- ✅ Audit logging and compliance checking
- ✅ Self-healing and autonomic capabilities (in progress)
- ✅ Multi-agent coordination framework (planned)
- ✅ Content access layer (planned)
- ✅ Distributed deployment support (future)

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (Current)
- [x] Core security primitives
- [x] Module registry system
- [x] Basic governance and compliance
- [x] Digital DNA blueprint
- [x] Audit logging
- [x] GitHub Actions CI/CD

### Phase 2: Enhancement
- [ ] LangChain/LangGraph integration
- [ ] Advanced self-healing mechanisms
- [ ] Content access layer implementation
- [ ] Comprehensive monitoring and metrics
- [ ] Additional compliance checks

### Phase 3: Distribution
- [ ] P2P capabilities
- [ ] Edge deployment support
- [ ] Decentralized governance
- [ ] Blockchain integration

### Phase 4: Emergence (Speculative)
- [ ] Neural cellular automata patterns
- [ ] Quantum-augmented security
- [ ] Neuromorphic computing integration
- [ ] Advanced AI governance mesh

---

## 🤝 Contributing

We welcome contributions! Please read:

1. [Core Directive](./CORE_DIRECTIVE.md) - Understand the principles
2. [Contributing Guide](./CONTRIBUTING.md) - Follow the process
3. [Architecture](./notes/ARCHITECTURE_DRAFT.md) - Learn the design

All contributions must align with the Core Directive.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

Inspired by:
- IBM's Autonomic Computing
- Multi-agent AI frameworks (LangChain, AutoGen, Agora)
- Self-organizing systems and cybernetics
- Modular robotics and robot metabolism
- Neural cellular automata

---

**Built with ❤️ for a secure, self-organizing future.**
# Brave Search MCP Server

A Model Context Protocol (MCP) server implementation for Brave Search API. This server enables AI applications and agents to perform privacy-focused web searches through the standardized MCP interface.

## Features

- **Web Search**: General web search with rich filtering and pagination
- **Local Search**: Find local businesses and services
- **Image Search**: Search for images with metadata
- **Video Search**: Search for video content
- **News Search**: Search for recent news articles
- **Summarizer**: Get AI-generated summaries for search queries

## Prerequisites

- Node.js 18 or higher
- A Brave Search API key (get one at https://brave.com/search/api/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dshvvvshr/Prime-security.git
cd Prime-security
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Brave Search API key to `.env`:
```
BRAVE_API_KEY=your_api_key_here
```

5. Build the project:
```bash
npm run build
```

## Usage

### Running the Server

Start the MCP server in STDIO mode (default):
```bash
npm start
```

Or use the development mode with auto-reload:
```bash
npm run dev
```

### Available Tools

#### 1. brave_web_search
Search the web using Brave Search.

**Parameters:**
- `q` (required): Search query
- `country` (optional): Country code (e.g., "US", "GB")
- `search_lang` (optional): Search language (e.g., "en", "es")
- `count` (optional): Number of results (1-20)
- `offset` (optional): Pagination offset
- `safesearch` (optional): Safe search level ("off", "moderate", "strict")
- `freshness` (optional): Time filter ("pd" = past day, "pw" = past week, "pm" = past month, "py" = past year)

#### 2. brave_local_search
Search for local businesses and places.

**Parameters:**
- `q` (required): Search query
- `count` (optional): Number of results (1-20)

#### 3. brave_image_search
Search for images.

**Parameters:**
- `q` (required): Search query
- `count` (optional): Number of results (1-150)
- `safesearch` (optional): Safe search level

#### 4. brave_video_search
Search for videos.

**Parameters:**
- `q` (required): Search query
- `count` (optional): Number of results (1-20)
- `safesearch` (optional): Safe search level

#### 5. brave_news_search
Search for news articles.

**Parameters:**
- `q` (required): Search query
- `count` (optional): Number of results (1-20)
- `freshness` (optional): Time filter

#### 6. brave_summarizer
Get AI-generated summaries.

**Parameters:**
- `key` (required): Summarizer key or search query
- `entity_info` (optional): Include entity information

## Integration with MCP Clients

### Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "node",
      "args": ["/path/to/Prime-security/dist/index.js"],
      "env": {
        "BRAVE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Other MCP Clients

This server uses STDIO transport and can be integrated with any MCP-compatible client. Refer to your client's documentation for specific integration instructions.

## API Rate Limits

Brave Search API has the following rate limits:

- **Free Tier**: 1 request/second, 2,000 queries/month
- **Base Tier**: Higher limits available
- **Pro/Enterprise**: Custom limits

## Privacy

This implementation uses Brave Search, which is privacy-focused and does not track users or build search profiles.

## Development

### Project Structure

```
Prime-security/
├── src/
│   ├── index.ts           # Main server entry point
│   ├── config.ts          # Configuration management
│   ├── brave-api.ts       # Brave API client
│   └── tools/             # Tool implementations
│       ├── web-search.ts
│       ├── local-search.ts
│       ├── image-search.ts
│       ├── video-search.ts
│       ├── news-search.ts
│       └── summarizer.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Running in Development

```bash
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the Brave Search API documentation: https://brave.com/search/api/

## Acknowledgments

- Built on the [Model Context Protocol](https://modelcontextprotocol.io)
- Powered by [Brave Search API](https://brave.com/search/api/)
