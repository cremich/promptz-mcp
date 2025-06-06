[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/cremich-promptz-mcp-badge.png)](https://mseep.ai/app/cremich-promptz-mcp)

# promptz.dev MCP Server

Access prompts from promptz.dev directly within Amazon Q Developer.

This MCP server allows to access prompts from the promptz.dev API without copy-pasting, reducing context switching and friction in your development workflow.

## Features

The promptz.dev MCP Server provides two main capabilities:

1. **Prompts** - Executable functions to search and execute prompts.
2. **Rules** - Executable functions to search for project rules and by integrating with other tools adding/updating them in your workspace.

## Example Usage

Once the server is connected to Amazon Q Developer, you can use it with natural language like:

- "Search for CLI prompts about JavaScript"
- "Show me the prompt called 'React Component Documentation'"
- "Use the React Component Documentation prompt to improve my documentation"
- "Find project rules for CDK Development"
- "Add the CDK Project Structure project rule to my workspace"

## Installation

### Step 1: Get API Credentials

1. Navigate to [https://promptz.dev/mcp](https://promptz.dev/mcp)
2. Copy the MCP settings like API Key, API URL or the sample MCP configuration snippet.

### Step 2: Install the MCP Server

Open the Amazon Q Developer MCP client settings file located at `~/.aws/amazonq/mcp.json`

#### Option 1: Using npx (Recommended)

The easiest way to use the server is with npx, which doesn't require installation:

1. Add the following configuration to your Amazon Q Developer MCP client's settings file:

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

### Troubleshooting

If you encounter issues with the server:

1. Check that your API credentials are correct
2. Ensure the server is properly configured in your MCP client
3. Look for error messages in the logs located ad `~/.promptz/logs/mcp-server.log`
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

## Security Considerations

- This server only provides read access to prompts and does not implement any write operations
- API credentials are stored in your MCP client's configuration file
- All communication with the promptz.dev API is done via HTTPS
- The server logs to a file in your home directory (~/.promptz/logs/mcp-server.log)
