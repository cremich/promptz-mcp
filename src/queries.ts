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
