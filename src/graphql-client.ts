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
  query ListPrompts($filter: ModelPromptFilterInput, $limit: Int, $nextToken: String) {
    listPrompts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        tags
        instruction
        public
        owner_username
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_PROMPT_QUERY = `
  query GetPrompt($id: ID!) {
    getPrompt(id: $id) {
      id
      name
      description
      tags
      instruction
      sourceURL
      howto
      public
      owner_username
      createdAt
      updatedAt
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
  getPrompt: Prompt;
}

// API functions
export async function listPrompts(limit?: number, nextToken?: string): Promise<ListPromptsResponse> {
  try {
    console.error("[API] Listing prompts");
    const filter: FilterCondition = {
      public: { eq: true },
    };

    return await graphqlClient.request<ListPromptsResponse>(LIST_PROMPTS_QUERY, { filter, limit, nextToken });
  } catch (error) {
    console.error("[Error] Failed to list prompts:", error);
    throw new Error(`Failed to list prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function searchPrompts(query: string): Promise<ListPromptsResponse> {
  try {
    console.error("[API] Searching prompts with query:", query);

    // Create filter for searching in name, description, or tags
    // Base filter
    const filter: FilterCondition = {
      public: { eq: true },
    };

    // Build query filter
    filter.and = buildTextSearchFilter(query);

    return await graphqlClient.request<ListPromptsResponse>(LIST_PROMPTS_QUERY, { filter });
  } catch (error) {
    console.error("[Error] Failed to search prompts:", error);
    throw new Error(`Failed to search prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getPromptById(id: string): Promise<GetPromptResponse> {
  try {
    console.error("[API] Getting prompt by ID:", id);
    return await graphqlClient.request<GetPromptResponse>(GET_PROMPT_QUERY, { id });
  } catch (error) {
    console.error("[Error] Failed to get prompt:", error);
    throw new Error(`Failed to get prompt: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getPromptByName(name: string): Promise<Prompt | null> {
  try {
    console.error("[API] Getting prompt by name:", name);

    // Search for prompts with the exact name
    const filter: FilterCondition = {
      public: { eq: true },
    };
    filter.and = { name: { eq: name } };
    const response = await graphqlClient.request<ListPromptsResponse>(LIST_PROMPTS_QUERY, { filter });

    const prompts = response.listPrompts.items;
    if (prompts.length === 0) {
      return null;
    }

    return prompts[0];
  } catch (error) {
    console.error("[Error] Failed to get prompt by name:", error);
    throw new Error(`Failed to get prompt by name: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function getCaseVariations(text: string): string[] {
  return [text.toLowerCase(), text.toUpperCase(), text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()];
}

type FilterCondition = Record<string, unknown>;

// Handle text search conditions
function buildTextSearchFilter(query: string): FilterCondition {
  const variations = getCaseVariations(query);
  return {
    or: variations.flatMap((variant) => [{ name: { contains: variant } }, { description: { contains: variant } }]),
  };
}
