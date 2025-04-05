# promptz.dev MCP Server

[![smithery badge](https://smithery.ai/badge/@cremich/promptz-mcp)](https://smithery.ai/server/@cremich/promptz-mcp)

Access prompts from promptz.dev directly from your AI assistants.

This MCP server allows to access prompts from the promptz.dev API without copy-pasting, reducing context switching and friction in your development workflow.

## Features

The promptz.dev MCP Server provides two main capabilities:

1. **Tools** - Executable functions that allow AI assistants to interact with the promptz.dev API
2. **Prompts** - Direct access to prompts as MCP prompt templates

## Tools and Prompts API

### Tools

The server exposes the following tools through the MCP protocol:

#### `list_prompts`

Lists available prompts from the promptz.dev platform.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "cursor": {
      "type": "string",
      "description": "Pagination token for fetching the next set of results"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Filter prompts by tags (e.g. ['CLI', 'JavaScript'])"
    }
  }
}
```

**Example Usage:**

```
// List all prompts
list_prompts()

// List prompts with pagination
list_prompts({ "cursor": "next-page-token" })

// Filter prompts by tags
list_prompts({ "tags": ["JavaScript", "CLI"] })
```

**Response Format:**

```json
{
  "prompts": [
    {
      "name": "React Component Generator",
      "description": "Generates React components based on specifications",
      "tags": ["React", "JavaScript", "Frontend"]
    }
    // More prompts...
  ],
  "nextCursor": "optional-pagination-token"
}
```

#### `get_prompt`

Retrieves a specific prompt by name.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the prompt to retrieve"
    }
  },
  "required": ["name"]
}
```

**Example Usage:**

```
get_prompt({ "name": "React Component Generator" })
```

**Response Format:**

```json
{
  "name": "React Component Generator",
  "description": "Generates React components based on specifications",
  "instruction": "Create a React component that...",
  "tags": ["React", "JavaScript", "Frontend"]
}
```

### Prompts API

The server also implements the MCP Prompts capability, which allows AI assistants to directly access prompts as templates:

- **List Prompts**: Returns available prompts in MCP prompt template format
- **Get Prompt**: Returns a specific prompt as an MCP prompt template that can be directly used by the AI assistant

## Installation

### Installing via Smithery

To install promptz.dev MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@cremich/promptz-mcp):

```bash
npx -y @smithery/cli install @cremich/promptz-mcp --client claude
```

### Step 1: Get API Credentials

1. Navigate to [https://promptz.dev/mcp](https://promptz.dev/mcp)
2. Copy the MCP settings like API Key, API URL or the sample MCP configuration snippet.

### Step 2: Install the MCP Server

#### Option 1: Using npx (Recommended)

The easiest way to use the server is with npx, which doesn't require installation:

1. Add the following configuration to your MCP client's settings file:

```json
{
  "mcpServers": {
    "promptz.dev": {
      "command": "npx",
      "args": ["-y", "@promptz/mcp"],
      "env": {
        "PROMPTZ_API_URL": "your-api-url-from-promptz.dev",
        "PROMPTZ_API_KEY": "your-api-key-from-promptz.dev"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### Option 2: Local Installation

1. Clone the repository:

```bash
git clone https://github.com/cremich/promptz-mcp.git
cd promptz-mcp
```

2. Install dependencies and build:

```bash
npm install
npm run build
```

3. Add the following configuration to your MCP client's settings file:

```json
{
  "mcpServers": {
    "promptz.dev": {
      "command": "node",
      "args": ["/path/to/promptz-mcp/build/index.js"],
      "env": {
        "PROMPTZ_API_URL": "your-api-url-from-promptz.dev",
        "PROMPTZ_API_KEY": "your-api-key-from-promptz.dev"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Step 3: Configure Your MCP Client

#### Claude Desktop

Add the server configuration to the Claude Desktop config file:

- **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

If the file doesn't exist, create it with the following content:

```json
{
  "mcpServers": {
    "promptz.dev": {
      "command": "npx",
      "args": ["-y", "@promptz/mcp"],
      "env": {
        "PROMPTZ_API_URL": "your-api-url-from-promptz.dev",
        "PROMPTZ_API_KEY": "your-api-key-from-promptz.dev"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### Other MCP Clients

For other MCP clients, refer to their documentation for how to configure MCP servers.

### Troubleshooting

If you encounter issues with the server:

1. Check that your API credentials are correct
2. Ensure the server is properly configured in your MCP client
3. Look for error messages in the logs
4. Use the MCP Inspector for debugging:

```bash
# Run with environment variables
PROMPTZ_API_URL="your-api-url" PROMPTZ_API_KEY="your-api-key" npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Development

For those who want to contribute or modify the server:

```bash
# Install dependencies
npm install

# Build the server
npm run build

# For development with auto-rebuild
npm run watch

# Run tests
npm test
```

## Example Usage

Once the server is connected to your MCP client, you can use it with natural language:

- "List available prompts from promptz.dev"
- "Search for CLI prompts about JavaScript"
- "Show me the prompt called 'React Component Documentation'"
- "Use the React Component Documentation prompt to improve my documentation"

## Security Considerations

- This server only provides read access to prompts and does not implement any write operations
- API credentials are stored in your MCP client's configuration file
- All communication with the promptz.dev API is done via HTTPS
- The server logs to a file in your home directory (~/.promptz/logs/mcp-server.log)
