// GraphQL queries
export const LIST_PROMPTS_QUERY = `
  query ListPrompts($nextToken: String, $filter: ModelPromptFilterInput) {
    listPrompts(nextToken: $nextToken, filter: $filter) {
      items {
        name
        description
        instruction
        tags
        public
        owner_username
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
        tags
        howto
        owner_username
      }
    }
  }
`;
