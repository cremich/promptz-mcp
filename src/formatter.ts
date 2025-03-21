import { Prompt, PromptMessage } from "@modelcontextprotocol/sdk/types.js";
import { Prompt as PromptzPrompt } from "./definitions.js";

export function toMCPPrompt(prompt: PromptzPrompt): Prompt {
  return {
    name: prompt.name,
    description: prompt.description,
  };
}

export function toMCPPromptMessage(prompt: PromptzPrompt): PromptMessage {
  return {
    role: "user",
    content: {
      type: "text",
      text: prompt.instruction,
    },
  };
}
