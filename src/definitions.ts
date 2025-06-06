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
  author?: string;
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

export interface SearchPromptsResponse {
  searchPrompts: {
    results: Prompt[];
    nextToken?: string;
  };
}

export interface GetPromptResponse {
  listByName: {
    items: Prompt[];
  };
}

export interface ListRulesResponse {
  searchProjectRules: {
    results: ProjectRule[];
    nextToken?: string;
  };
}

export interface GetRuleResponse {
  listRuleByName: {
    items: Prompt[];
  };
}
