// Types for API responses
export interface Prompt {
  id?: string;
  name: string;
  description: string;
  tags?: string[];
  instruction: string;
  sourceURL?: string;
  howto?: string;
  public?: boolean;
  owner_username?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectRule = {
  id?: string;
  name: string;
  description: string;
  tags?: string[];
  content: string;
  owner_username?: string;
  public?: boolean;
  sourceURL?: string;
  createdAt?: string;
  updatedAt?: string;
};

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

export interface ListRulesResponse {
  listProjectRules: {
    items: ProjectRule[];
    nextToken?: string;
  };
}

export interface GetRuleResponse {
  listRuleByName: {
    items: Prompt[];
  };
}
