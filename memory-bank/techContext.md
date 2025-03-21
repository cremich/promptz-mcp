# Technical Context: promptz.dev MCP Server

## Technologies Used

### Core Technologies

1. **TypeScript**: The server is written in TypeScript, providing strong typing and modern JavaScript features.
2. **Node.js**: The runtime environment for executing the server.
3. **MCP SDK**: The Model Context Protocol SDK for implementing MCP servers.
4. **GraphQL**: Used for communicating with the promptz.dev API.
5. **JSON-RPC**: The underlying protocol used by MCP for client-server communication.

### Key Libraries

1. **@modelcontextprotocol/sdk**: The official MCP SDK for implementing MCP servers.
2. **graphql-request**: A minimal GraphQL client for making requests to the promptz.dev API.

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or another package manager

### Installation

```bash
# Install dependencies
npm install

# Build the server
npm run build

# For development with auto-rebuild
npm run watch
```

### Environment Variables

The server requires the following environment variables:

- `PROMPTZ_API_URL`: The URL of the promptz.dev GraphQL API
- `PROMPTZ_API_KEY`: API key for authentication with the promptz.dev API

These can be obtained from [https://promptz.dev/mcp](https://promptz.dev/mcp).

### Project Structure

```
promptz-mcp/
├── build/              # Compiled JavaScript files
├── docs/               # Documentation
│   ├── mcp/            # MCP-related documentation
│   └── promptz-api/    # promptz.dev API documentation
├── src/                # Source code
│   ├── index.ts        # Main server implementation
│   └── graphql-client.ts # GraphQL client for promptz.dev API
├── package.json        # Project metadata and dependencies
└── tsconfig.json       # TypeScript configuration
```

## Technical Constraints

1. **stdio Communication**: The server communicates with MCP clients using standard input/output streams, which means:

   - Console.log cannot be used for debugging (interferes with JSON-RPC messages)
   - All logging must be done to stderr (console.error)
   - The server process must remain running to maintain the connection

2. **API Limitations**:

   - The promptz.dev API may have rate limits
   - API responses may change over time
   - Authentication is required for all API requests

3. **MCP Protocol Constraints**:

   - Must adhere to the MCP specification
   - Limited to capabilities defined in the MCP protocol
   - Must handle request/response lifecycle according to the protocol

4. **Environment Constraints**:
   - Must work across different operating systems
   - Cannot rely on local file system for persistent storage
   - Must handle environment variables securely

## Dependencies

### Production Dependencies

- **@modelcontextprotocol/sdk**: The official MCP SDK for implementing MCP servers.
- **graphql-request**: A minimal GraphQL client for making requests to the promptz.dev API.

### Development Dependencies

- **typescript**: The TypeScript compiler.
- **@types/node**: TypeScript type definitions for Node.js.
- **ts-node**: TypeScript execution environment for development.
- **nodemon**: Tool for automatically restarting the server during development.

## Deployment

The server can be deployed in several ways:

1. **Local Installation**: Users can install the package locally and run it.
2. **npx Execution**: Users can run the server directly using npx without installation.
3. **Global Installation**: Users can install the package globally.

Configuration is done through the MCP client's settings file:

- **Claude Desktop**:
  - MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
  - Windows: `%APPDATA%/Claude/claude_desktop_config.json`

## Testing and Debugging

### MCP Inspector

The MCP Inspector tool can be used for debugging:

```bash
# Run with environment variables
PROMPTZ_API_URL="your-api-url" PROMPTZ_API_KEY="your-api-key" npm run inspector
```

This provides a web interface for inspecting MCP messages and testing the server.

### Logging

The server uses console.error for logging, with prefixes to indicate the log type:

- `[Setup]`: Initialization and configuration logs
- `[API]`: API request and response logs
- `[Error]`: Error logs
- `[Config]`: Configuration-related logs
