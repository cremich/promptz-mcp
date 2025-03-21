#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { logger } from "./logger.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { getPromptToolHandler, listPromptsToolHandler } from "./tools.js";
import { getPromptHandler, listPromptsHandler } from "./prompts.js";

/**
 * Create an MCP server with prompts capability for interacting with promptz.dev API
 */
const server = new Server(
  {
    name: "promptz.dev",
    version: "0.1.0",
  },
  {
    capabilities: {
      prompts: {},
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
 * Handler that lists available prompts.
 * Exposes prompts from promptz.dev as MCP prompt templates.
 */
server.setRequestHandler(ListPromptsRequestSchema, async (request) => {
  try {
    logger.info("[API] Listing available prompts");
    return await listPromptsHandler(request);
  } catch (error) {
    logger.error(`[Error] Failed to list prompts: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to list prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
});

/**
 * Handler for retrieving a specific prompt.
 * Converts promptz.dev prompts to MCP prompt template format.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  try {
    logger.info(`[API] Getting prompt: ${request.params.name}`);
    return await getPromptHandler(request);
  } catch (error) {
    logger.error(`[Error] Failed to get prompt: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to get prompt: ${error instanceof Error ? error.message : String(error)}`);
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
