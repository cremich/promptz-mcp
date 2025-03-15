#!/usr/bin/env node

/**
 * MCP server for promptz.dev API integration.
 * This server allows AI assistants to access prompts from promptz.dev directly.
 *
 * Features:
 * - List available prompts
 * - Search for prompts by name, description, or tags
 * - Get a specific prompt by ID or name
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Import GraphQL client functions
import { listPrompts, searchPrompts, getPromptById, getPromptByName, Prompt } from "./graphql-client.js";

/**
 * Create an MCP server with tools capability for interacting with promptz.dev API
 */
const server = new Server(
  {
    name: "promptz.dev",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes tools for listing prompts, searching prompts, and getting a specific prompt.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "promptz/list",
        description: "List available prompts from promptz.dev",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Maximum number of prompts to return (default: 10)",
            },
            nextToken: {
              type: "string",
              description: "Pagination token for fetching the next set of results",
            },
          },
        },
      },
      {
        name: "promptz/search",
        description: "Search for prompts by name, description, or tags",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search term to look for in prompt name, description, or tags",
            },
            limit: {
              type: "number",
              description: "Maximum number of prompts to return (default: 10)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "promptz/get",
        description: "Get a specific prompt by ID or name",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID of the prompt to retrieve",
            },
            name: {
              type: "string",
              description: "Name of the prompt to retrieve",
            },
          },
          oneOf: [{ required: ["id"] }, { required: ["name"] }],
        },
      },
    ],
  };
});

/**
 * Format a prompt for display
 */
function formatPrompt(prompt: Prompt): string {
  return `
ID: ${prompt.id}
Name: ${prompt.name}
Description: ${prompt.description}
Tags: ${prompt.tags ? prompt.tags.join(", ") : "None"}
Prompt: ${prompt.instruction}
${prompt.sourceURL ? `Source URL: ${prompt.sourceURL}` : ""}
${prompt.howto ? `How to: ${prompt.howto}` : ""}
Public: ${prompt.public ? "Yes" : "No"}
Owner: ${prompt.owner_username}
Created: ${new Date(prompt.createdAt).toLocaleString()}
Updated: ${new Date(prompt.updatedAt).toLocaleString()}
`;
}

/**
 * Handler for tool execution.
 * Implements the promptz/list, promptz/search, and promptz/get tools.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "promptz/list": {
        const limit = request.params.arguments?.limit as number | undefined;
        const nextToken = request.params.arguments?.nextToken as string | undefined;

        const response = await listPrompts(limit, nextToken);
        const prompts = response.listPrompts.items;

        let result = `Found ${prompts.length} prompts:\n\n`;
        prompts.forEach((prompt, index) => {
          result += `${index + 1}. ${prompt.name} - ${prompt.description}\n`;
        });

        if (response.listPrompts.nextToken) {
          result += `\nMore prompts available. Use nextToken: ${response.listPrompts.nextToken}`;
        }

        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "promptz/search": {
        const query = String(request.params.arguments?.query);
        const limit = request.params.arguments?.limit as number | undefined;

        if (!query) {
          throw new Error("Search query is required");
        }

        const response = await searchPrompts(query, limit);
        const prompts = response.listPrompts.items;

        if (prompts.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No prompts found matching "${query}"`,
              },
            ],
          };
        }

        let result = `Found ${prompts.length} prompts matching "${query}":\n\n`;
        prompts.forEach((prompt, index) => {
          result += `${index + 1}. ${prompt.name} - ${prompt.description}\n`;
        });

        if (response.listPrompts.nextToken) {
          result += `\nMore results available. Use nextToken: ${response.listPrompts.nextToken}`;
        }

        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      case "promptz/get": {
        const id = request.params.arguments?.id as string | undefined;
        const name = request.params.arguments?.name as string | undefined;

        if (!id && !name) {
          throw new Error("Either prompt ID or name is required");
        }

        let prompt: Prompt | null = null;

        if (id) {
          const response = await getPromptById(id);
          prompt = response.getPrompt;
        } else if (name) {
          prompt = await getPromptByName(name);
        }

        if (!prompt) {
          return {
            content: [
              {
                type: "text",
                text: `Prompt not found: ${id || name}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: formatPrompt(prompt),
            },
          ],
        };
      }

      default:
        throw new Error("Unknown tool");
    }
  } catch (error) {
    console.error("[Error] Tool execution failed:", error);
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
  console.error("[Setup] Initializing promptz.dev MCP server...");
  console.error("[Setup] Required environment variables:");
  console.error("[Setup] - PROMPTZ_API_URL: API URL for promptz.dev GraphQL API");
  console.error("[Setup] - PROMPTZ_API_KEY: API Key for authentication");
  console.error("[Setup] You can get these settings from https://promptz.dev/mcp");

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[Setup] Server started successfully");
}

main().catch((error) => {
  console.error("[Error] Server initialization failed:", error);
  process.exit(1);
});
