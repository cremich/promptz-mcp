import { CallToolRequest, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { searchPrompts, getPromptByName, listRules, getRuleByName } from "./graphql-client.js";

export async function listPromptsToolHandler(request: CallToolRequest): Promise<CallToolResult> {
  const nextToken = request.params.arguments?.nextToken as string | undefined;
  const tags = request.params.arguments?.tags as string[] | undefined;
  const response = await searchPrompts(nextToken, tags);
  const prompts = response.searchPrompts.results;

  const result = {
    prompts: prompts.map((prompt) => ({
      name: prompt.name,
      description: prompt.description,
      tags: prompt.tags || [],
      author: prompt.author,
    })),
    nextCursor: response.searchPrompts.nextToken || undefined,
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

  const promptData = {
    name: prompt.name,
    description: prompt.description,
    tags: prompt.tags || [],
    author: prompt.author?.displayName,
    instruction: prompt.instruction,
    howto: prompt.howto || "",
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(promptData, null, 2),
      },
    ],
  };
}

export async function listRulesToolHandler(request: CallToolRequest): Promise<CallToolResult> {
  const nextToken = request.params.arguments?.nextToken as string | undefined;
  const tags = request.params.arguments?.tags as string[] | undefined;
  const response = await listRules(nextToken, tags);
  const rules = response.searchProjectRules.results;

  const result = {
    rules: rules.map((rule) => ({
      name: rule.name,
      description: rule.description,
      tags: rule.tags || [],
    })),
    nextCursor: response.searchProjectRules.nextToken || undefined,
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

export async function getRuleToolHandler(request: CallToolRequest): Promise<CallToolResult> {
  const name = request.params.arguments?.name as string | undefined;

  if (!name) {
    throw new Error("Rule name is required");
  }
  const rule = await getRuleByName(name);
  if (!rule) {
    throw new Error(`Rule not found: ${name}`);
  }

  const ruleData = {
    name: rule.name,
    description: rule.description,
    tags: rule.tags || [],
    author: rule.author?.displayName,
    content: rule.content,
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(ruleData, null, 2),
      },
    ],
  };
}
