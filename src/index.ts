#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GetPromptRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

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
    },
  }
);

//     tools: [
//       {
//         name: "promptz/list",
//         description: "List available prompts from promptz.dev",
//         inputSchema: {
//           type: "object",
//           properties: {
//             limit: {
//               type: "number",
//               description: "Maximum number of prompts to return (default: 10)",
//             },
//             nextToken: {
//               type: "string",
//               description: "Pagination token for fetching the next set of results",
//             },
//           },
//         },
//       },
//       {
//         name: "promptz/search",
//         description: "Search for prompts by name, description, or tags",
//         inputSchema: {
//           type: "object",
//           properties: {
//             query: {
//               type: "string",
//               description: "Search term to look for in prompt name, description, or tags",
//             },
//           },
//           required: ["query"],
//         },
//       },
//       {
//         name: "promptz/get",
//         description: "Get a specific prompt by ID or name",
//         inputSchema: {
//           type: "object",
//           properties: {
//             id: {
//               type: "string",
//               description: "ID of the prompt to retrieve",
//             },
//             name: {
//               type: "string",
//               description: "Name of the prompt to retrieve",
//             },
//           },
//           oneOf: [{ required: ["id"] }, { required: ["name"] }],
//         },
//       },
//     ],
//   };
// });

/**
 * Handler that lists available prompts.
 * Exposes prompts from promptz.dev as MCP prompt templates.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  try {
    console.error("[API] Listing available prompts");
    let cursor: string | undefined;
    let hasMorePages: boolean = true;
    const prompts = [];

    do {
      const response = await listPrompts(10, cursor);
      const p = response.listPrompts.items;
      prompts.push(...p);

      if (response.listPrompts.nextToken) {
        cursor = response.listPrompts.nextToken;
      } else {
        hasMorePages = false;
      }
    } while (hasMorePages);

    return {
      prompts: prompts.map((prompt) => ({
        name: prompt.name,
        description: prompt.description,
      })),
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
