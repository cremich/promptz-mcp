import {
  GetPromptRequest,
  GetPromptResult,
  ListPromptsRequest,
  ListPromptsResult,
} from "@modelcontextprotocol/sdk/types.js";
import { getPromptByName, listPrompts } from "./graphql-client.js";
import { toMCPPrompt, toMCPPromptMessage } from "./formatter.js";

export async function listPromptsHandler(request: ListPromptsRequest): Promise<ListPromptsResult> {
  let cursor = request.params?.cursor;
  const response = await listPrompts(cursor);
  const p = response.listPrompts.items;

  return {
    prompts: p.map((prompt) => toMCPPrompt(prompt)),
    nextCursor: response.listPrompts.nextToken || undefined,
  };
}

export async function getPromptHandler(request: GetPromptRequest): Promise<GetPromptResult> {
  const prompt = await getPromptByName(request.params.name);

  if (!prompt) {
    throw new Error(`Prompt not found: ${request.params.name}`);
  }

  // Convert the prompt to MCP prompt template format
  return {
    messages: [toMCPPromptMessage(prompt)],
    description: prompt.description,
  };
}
