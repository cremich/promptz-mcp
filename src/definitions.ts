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
