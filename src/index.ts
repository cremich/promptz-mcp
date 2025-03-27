#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { logger } from "./logger.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { getPromptToolHandler, getRuleToolHandler, listPromptsToolHandler, listRulesToolHandler } from "./tools.js";

/**
 * Create an MCP server with prompts capability for interacting with promptz.dev API
 */
const server = new Server(
  {
    name: "promptz.dev",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

/**
 * Handler that lists available tools.
 * Exposes tools for listing prompts, searching prompts, and getting a specific prompt.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_prompts",
        description: "List available prompts from promptz.dev",
        inputSchema: {
          type: "object",
          properties: {
            cursor: {
              type: "string",
              description: "Pagination token for fetching the next set of results",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter prompts by tags (e.g. ['CLI', 'JavaScript'])",
            },
          },
        },
      },
      {
        name: "get_prompt",
        description: "Get a specific prompt by ID or name",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the prompt to retrieve",
            },
          },
        },
      },
      {
        name: "list_rules",
        description: "List available project rules from promptz.dev",
        inputSchema: {
          type: "object",
          properties: {
            cursor: {
              type: "string",
              description: "Pagination token for fetching the next set of results",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter rules by tags (e.g. ['CDK', 'React'])",
            },
          },
        },
      },
      {
        name: "get_rule",
        description: "Get a specific project rule by name",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the rule to retrieve",
            },
          },
        },
      },
    ],
  };
});

/**
 * Handler for tool execution.
 * Implements the list_prompts and get_prompt tools.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "list_prompts": {
        return await listPromptsToolHandler(request);
      }
      case "get_prompt": {
        return await getPromptToolHandler(request);
      }
      case "list_rules": {
        return await listRulesToolHandler(request);
      }
      case "get_rule": {
        return await getRuleToolHandler(request);
      }
      default:
        throw new Error("Unknown tool");
    }
  } catch (error) {
    logger.error(`[Error] Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  logger.info("[Setup] Initializing promptz.dev MCP server...");
  logger.info("[Setup] Required environment variables:");
  logger.info("[Setup] - PROMPTZ_API_URL: API URL for promptz.dev GraphQL API");
  logger.info("[Setup] - PROMPTZ_API_KEY: API Key for authentication");
  logger.info("[Setup] You can get these settings from https://promptz.dev/mcp");

  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("[Setup] Server started successfully");
}

main().catch((error) => {
  logger.error(`[Error] Server initialization failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
