import { cacheExchange, createClient, fetchExchange, gql } from "@urql/core";
import { logger } from "./logger.js";
import { SearchPromptsResponse, ListRulesResponse, ProjectRule, Prompt } from "./definitions.js";
import { SEARCH_PROMPTS_QUERY, GET_PROMPT_BY_NAME, SEARCH_RULES, GET_RULE_BY_NAME } from "./queries.js";

// GraphQL client configuration using environment variables
const API_URL = process.env.PROMPTZ_API_URL;
const API_KEY = process.env.PROMPTZ_API_KEY;

// Validate environment variables
if (!API_URL) {
  throw new Error(
    "PROMPTZ_API_URL environment variable is not set. Please configure it in your MCP settings. You can get the required settings from https://promptz.dev/mcp",
  );
}

if (!API_KEY) {
  throw new Error(
    "PROMPTZ_API_KEY environment variable is not set. Please configure it in your MCP settings. You can get the required settings from https://promptz.dev/mcp",
  );
}

logger.info(`[Config] Using API URL: ${API_URL}`);
logger.info("[Config] API Key configured: Yes");

// Create URQL client with API key authentication
export const client = createClient({
  url: API_URL,
  fetchOptions: {
    headers: {
      "x-api-key": API_KEY,
    },
  },
  exchanges: [cacheExchange, fetchExchange],
});

// API functions
export async function searchPrompts(nextToken?: string, tags?: string[]): Promise<SearchPromptsResponse> {
  try {
    logger.info("[API] Listing prompts" + (tags ? ` with tags: ${tags.join(", ")}` : ""));

    const { data, error } = await client.query(
      gql`
        ${SEARCH_PROMPTS_QUERY}
      `,
      { nextToken, tags },
    );

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    logger.error(`[Error] Failed to list prompts: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to list prompts: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getPromptByName(name: string): Promise<Prompt | null> {
  try {
    logger.info(`[API] Getting prompt by name: ${name}`);

    // Search for prompts with the exact name
    const { data, error } = await client.query(
      gql`
        ${GET_PROMPT_BY_NAME}
      `,
      { name },
    );

    if (error) {
      throw error;
    }

    const prompts = data.listByName.items;
    if (prompts.length === 0) {
      return null;
    }

    let prompt = prompts[0];

    return prompt;
  } catch (error) {
    logger.error(`[Error] Failed to get prompt by name: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to get prompt by name: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function listRules(nextToken?: string, tags?: string[]): Promise<ListRulesResponse> {
  try {
    logger.info("[API] Listing rules" + (tags ? ` with tags: ${tags.join(", ")}` : ""));

    const { data, error } = await client.query(
      gql`
        ${SEARCH_RULES}
      `,
      { nextToken, tags },
    );

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    logger.error(`[Error] Failed to list project rules: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to list project rules: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getRuleByName(name: string): Promise<ProjectRule | null> {
  try {
    logger.info(`[API] Getting rule by name: ${name}`);

    // Search for prompts with the exact name
    const { data, error } = await client.query(
      gql`
        ${GET_RULE_BY_NAME}
      `,
      { name },
    );

    if (error) {
      throw error;
    }

    const rules = data.listRuleByName.items;
    if (rules.length === 0) {
      return null;
    }

    return rules[0];
  } catch (error) {
    logger.error(`[Error] Failed to get rule by name: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to get rule by name: ${error instanceof Error ? error.message : String(error)}`);
  }
}
