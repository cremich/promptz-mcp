#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import GraphQL client functions
import { listPrompts, getPromptByName, Prompt } from "./graphql-client.js";

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
        name: "list_prompts",
        description: "List available prompts from promptz.dev",
        inputSchema: {
          type: "object",
          properties: {
            cursor: {
              type: "string",
              description: "Pagination token for fetching the next set of results",
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
 * Implements the promptz/list, promptz/search, and promptz/get tools.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "list_prompts": {
        const nextToken = request.params.arguments?.nextToken as string | undefined;
        const response = await listPrompts(nextToken);
        const prompts = response.listPrompts.items;

        const result = {
          prompts: prompts.map((prompt) => ({
            name: prompt.name,
            description: prompt.description,
          })),
          nextCursor: response.listPrompts.nextToken || undefined,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_prompt": {
        const name = request.params.arguments?.name as string | undefined;

        if (!name) {
          throw new Error("Either prompt ID or name is required");
        }

        let prompt: Prompt | null = null;
        prompt = await getPromptByName(name);

        if (!prompt) {
          return {
            content: [
              {
                type: "text",
                text: `Prompt not found: ${name}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: prompt.instruction,
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
 * Handler that lists available prompts.
 * Exposes prompts from promptz.dev as MCP prompt templates.
 */
server.setRequestHandler(ListPromptsRequestSchema, async (request) => {
  try {
    console.error("[API] Listing available prompts");
    let cursor = request.params?.cursor;
    const response = await listPrompts(cursor);
    const p = response.listPrompts.items;

    return {
      prompts: p.map((prompt) => ({
        name: prompt.name,
        description: prompt.description,
      })),
      nextCursor: response.listPrompts.nextToken || undefined,
    };
  } catch (error) {
    console.error("[Error] Failed to list prompts:", error);
    throw new Error(`Failed to list prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
});

/**
 * Handler for retrieving a specific prompt.
 * Converts promptz.dev prompts to MCP prompt template format.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  try {
    console.error("[API] Getting prompt:", request.params.name);

    let prompt: Prompt | null = null;

    // Try to get the prompt by name
    prompt = await getPromptByName(request.params.name);

    if (!prompt) {
      throw new Error(`Prompt not found: ${request.params.name}`);
    }

    // Process any arguments provided in the request
    let instruction = prompt.instruction;

    // Convert the prompt to MCP prompt template format
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: instruction,
          },
        },
      ],
      description: prompt.description,
    };
  } catch (error) {
    console.error("[Error] Failed to get prompt:", error);
    throw new Error(`Failed to get prompt: ${error instanceof Error ? error.message : String(error)}`);
  }
});
/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  /*
   * The MCP SDK's StdioServerTransport uses standard input/output streams (stdin/stdout) for JSON-RPC communication between the client and server:
   *  - stdout (console.log) - Used for the actual JSON-RPC protocol messages
   *  - stderr (console.error) - Used for logging and debugging information
   * When you use console.log for logging, those messages are sent through stdout, which is the same channel used for the JSON-RPC protocol.
   * The client then tries to parse your log messages as JSON, resulting in a syntax error "Error from MCP server: SyntaxError: Unexpected token ... is not valid JSON"
   */
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
