import { CallToolRequest, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { listPrompts, getPromptByName } from "./graphql-client.js";

export async function listPromptsToolHandler(request: CallToolRequest): Promise<CallToolResult> {
  const nextToken = request.params.arguments?.nextToken as string | undefined;
  const tags = request.params.arguments?.tags as string[] | undefined;
  const response = await listPrompts(nextToken, tags);
  const prompts = response.listPrompts.items;

  const result = {
    prompts: prompts.map((prompt) => ({
      name: prompt.name,
      description: prompt.description,
      tags: prompt.tags || [],
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

export async function getPromptToolHandler(request: CallToolRequest): Promise<CallToolResult> {
  const name = request.params.arguments?.name as string | undefined;

  if (!name) {
    throw new Error("Prompt name is required");
  }
  const prompt = await getPromptByName(name);
  if (!prompt) {
    throw new Error(`Prompt not found: ${name}`);
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(prompt, null, 2),
      },
    ],
  };
}
