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
