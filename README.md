# promptz.dev MCP Server

Access prompts from promptz.dev directly from your AI assistants.

This MCP server allows developers to access prompts from the promptz.dev API without copy-pasting, reducing context switching and friction in their workflow.

## Features

### Tools

- `list_prompts` - List available prompts from promptz.dev

  - Optional parameters: `cursor` (pagination token)
  - Returns a list of prompts with their names and descriptions

- `get_prompt` - Get a specific prompt by name

  - Required parameter: `name`
  - Returns the prompt

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "promptz.dev": {
      "command": "npx",
      "args": ["-y", "@promptz/mcp"],
      "env": {
        "PROMPTZ_API_URL": "...",
        "PROMPTZ_API_KEY": "..."
      }
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
# Run with environment variables
PROMPTZ_API_URL="your-api-url" PROMPTZ_API_KEY="your-api-key" npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser. Make sure to provide the required environment variables when running the inspector.

## API Authentication

This server uses an API key to authenticate with the promptz.dev GraphQL API. The API credentials are configured using environment variables:

- `PROMPTZ_API_URL`: The URL of the promptz.dev GraphQL API
- `PROMPTZ_API_KEY`: Your API key for authentication

You can get these credentials from [https://promptz.dev/mcp](https://promptz.dev/mcp).

## Example Usage

Once the server is connected to your MCP client, you can use it with natural language:

- "List available prompts from promptz.dev"
- "Search for prompts about JavaScript"
- "Show me the prompt called 'React Component Generator'"

## Security Considerations

This server only provides read access to prompts and does not implement any write operations.
