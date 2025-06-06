// GraphQL queries
export const SEARCH_PROMPTS_QUERY = `
  query SearchPrompts($nextToken: String, $tags: [String]) {
    searchPrompts(tags: $tags, nextToken: $nextToken) {
      results {
        createdAt
        description
        id
        name
        slug
        tags
        updatedAt
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

export const SEARCH_RULES = `
  query SearchRules($nextToken: String, $tags: [String]) {
    searchProjectRules(nextToken: $nextToken, tags: $tags) {
      results {
        createdAt
        description
        id
        name
        slug
        tags
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_RULE_BY_NAME = `
  query GetRuleByName($name: String!) {
    listRuleByName(name: $name) {
      items {
        name
        description
        content
        tags
        public
        owner_username
      }
    }
  }
`;
