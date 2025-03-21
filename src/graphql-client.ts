import { GraphQLClient } from "graphql-request";

// GraphQL client configuration using environment variables
const API_URL = process.env.PROMPTZ_API_URL;
const API_KEY = process.env.PROMPTZ_API_KEY;

// Validate environment variables
if (!API_URL) {
  throw new Error(
    "PROMPTZ_API_URL environment variable is not set. Please configure it in your MCP settings. You can get the required settings from https://promptz.dev/mcp"
  );
}

if (!API_KEY) {
  throw new Error(
    "PROMPTZ_API_KEY environment variable is not set. Please configure it in your MCP settings. You can get the required settings from https://promptz.dev/mcp"
  );
}

console.error("[Config] Using API URL:", API_URL);
console.error("[Config] API Key configured:", "Yes");

// Create GraphQL client with API key authentication
export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    "x-api-key": API_KEY,
  },
});

// GraphQL queries
export const LIST_PROMPTS_QUERY = `
  query ListPrompts($nextToken: String) {
    listPrompts(nextToken: $nextToken) {
      items {
        name
        description
        instruction
        public
      }
      nextToken
    }
  }
`;

export const GET_PROMPT_BY_NAME = `
  query GetPromptByName($name: String!) {
    listByName(name: $name) {
      items {
        name
        description
        instruction
      }
    }
  }
`;

// Types for API responses
export interface Prompt {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  instruction: string;
  sourceURL?: string;
  howto?: string;
  public?: boolean;
  owner_username: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListPromptsResponse {
  listPrompts: {
    items: Prompt[];
    nextToken?: string;
  };
}

export interface GetPromptResponse {
  listByName: {
    items: Prompt[];
  };
}

// API functions
export async function listPrompts(nextToken?: string): Promise<ListPromptsResponse> {
  try {
    console.error("[API] Listing prompts");
    const response = await graphqlClient.request<ListPromptsResponse>(LIST_PROMPTS_QUERY, { nextToken });

    return {
      listPrompts: {
        items: response.listPrompts.items.filter((p) => p.public === true),
        nextToken: response.listPrompts.nextToken,
      },
    };
  } catch (error) {
    console.error("[Error] Failed to list prompts:", error);
    throw new Error(`Failed to list prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getPromptByName(name: string): Promise<Prompt | null> {
  try {
    console.error("[API] Getting prompt by name:", name);

    // Search for prompts with the exact name
    const response = await graphqlClient.request<GetPromptResponse>(GET_PROMPT_BY_NAME, { name });

    const prompts = response.listByName.items;
    if (prompts.length === 0) {
      return null;
    }

    return prompts[0];
  } catch (error) {
    console.error("[Error] Failed to get prompt by name:", error);
    throw new Error(`Failed to get prompt by name: ${error instanceof Error ? error.message : String(error)}`);
  }
}
