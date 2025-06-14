import { CallToolRequest, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getPromptToolHandler, listPromptsToolHandler, listRulesToolHandler, getRuleToolHandler } from "../tools.js";
import { getPromptByName, searchPrompts, listRules, getRuleByName } from "../graphql-client.js";

// Mock the graphql-client module
jest.mock("../graphql-client.js", () => ({
  searchPrompts: jest.fn(),
  getPromptByName: jest.fn(),
  listRules: jest.fn(),
  getRuleByName: jest.fn(),
}));

describe("listPromptsToolHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted prompts without nextToken", async () => {
    const mockPrompts = {
      searchPrompts: {
        results: [
          { name: "prompt1", description: "desc1", tags: ["tag1"] },
          { name: "prompt2", description: "desc2", tags: ["tag2"] },
        ],
        nextToken: null,
      },
    };

    (searchPrompts as jest.Mock).mockResolvedValue(mockPrompts);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "listPrompts",
      },
    };

    const expected: CallToolResult = {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              prompts: [
                { name: "prompt1", description: "desc1", tags: ["tag1"] },
                { name: "prompt2", description: "desc2", tags: ["tag2"] },
              ],
              nextCursor: undefined,
            },
            null,
            2,
          ),
        },
      ],
    };

    const result = await listPromptsToolHandler(request);
    expect(result).toEqual(expected);
    expect(searchPrompts).toHaveBeenCalledWith(undefined, undefined);
  });

  it("should handle nextToken correctly", async () => {
    const mockPrompts = {
      searchPrompts: {
        results: [{ name: "prompt3", description: "desc3", tags: [] }],
        nextToken: "next-page-token",
      },
    };

    (searchPrompts as jest.Mock).mockResolvedValue(mockPrompts);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "listPrompts",
        arguments: { nextToken: "current-token" },
      },
    };

    const result = await listPromptsToolHandler(request);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.nextCursor).toBe("next-page-token");
    expect(searchPrompts).toHaveBeenCalledWith("current-token", undefined);
  });

  it("should filter prompts by tags", async () => {
    const mockPrompts = {
      searchPrompts: {
        results: [
          { name: "prompt1", description: "CLI prompt", tags: ["CLI", "JavaScript"] },
          { name: "prompt2", description: "Web prompt", tags: ["Web", "JavaScript"] },
        ],
        nextToken: null,
      },
    };

    (searchPrompts as jest.Mock).mockResolvedValue(mockPrompts);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "listPrompts",
        arguments: { tags: ["CLI", "JavaScript"] },
      },
    };

    const result = await listPromptsToolHandler(request);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.prompts).toHaveLength(2);
    expect(parsedResult.prompts[0].tags).toContain("CLI");
    expect(parsedResult.prompts[0].tags).toContain("JavaScript");
    expect(parsedResult.prompts[0].description).toContain("CLI prompt");
    expect(searchPrompts).toHaveBeenCalledWith(undefined, ["CLI", "JavaScript"]);
  });
});

describe("getPromptToolHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return prompt when found", async () => {
    const mockPrompt = {
      name: "testPrompt",
      description: "test description",
      tags: ["tag1", "tag2"],
      howto: "howto",
      author: { displayName: "author" },
    };

    (getPromptByName as jest.Mock).mockResolvedValue(mockPrompt);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "getPrompt",
        arguments: { name: "testPrompt" },
      },
    };

    const expectedPromptData = {
      name: "testPrompt",
      description: "test description",
      tags: ["tag1", "tag2"],
      author: "author",
      howto: "howto",
    };

    const expected: CallToolResult = {
      content: [
        {
          type: "text",
          text: JSON.stringify(expectedPromptData, null, 2),
        },
      ],
    };

    const result = await getPromptToolHandler(request);
    expect(result).toEqual(expected);
    expect(getPromptByName).toHaveBeenCalledWith("testPrompt");
  });

  it("should throw error when name is not provided", async () => {
    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "getPrompt",
        arguments: {},
      },
    };

    await expect(getPromptToolHandler(request)).rejects.toThrow("Prompt name is required");
  });

  it("should throw error when prompt is not found", async () => {
    (getPromptByName as jest.Mock).mockResolvedValue(null);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "getPrompt",
        arguments: { name: "nonexistentPrompt" },
      },
    };

    await expect(getPromptToolHandler(request)).rejects.toThrow("Prompt not found: nonexistentPrompt");
  });
});

describe("listRulesToolHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted rules without nextToken", async () => {
    const mockRules = {
      searchProjectRules: {
        results: [
          { name: "rule1", description: "desc1", tags: ["tag1"] },
          { name: "rule2", description: "desc2", tags: ["tag2"] },
        ],
        nextToken: null,
      },
    };

    (listRules as jest.Mock).mockResolvedValue(mockRules);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "listRules",
      },
    };

    const expected: CallToolResult = {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              rules: [
                { name: "rule1", description: "desc1", tags: ["tag1"] },
                { name: "rule2", description: "desc2", tags: ["tag2"] },
              ],
              nextCursor: undefined,
            },
            null,
            2,
          ),
        },
      ],
    };

    const result = await listRulesToolHandler(request);
    expect(result).toEqual(expected);
    expect(listRules).toHaveBeenCalledWith(undefined, undefined);
  });

  it("should handle nextToken correctly", async () => {
    const mockRules = {
      searchProjectRules: {
        results: [{ name: "rule3", description: "desc3", tags: [] }],
        nextToken: "next-page-token",
      },
    };

    (listRules as jest.Mock).mockResolvedValue(mockRules);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "listRules",
        arguments: { nextToken: "current-token" },
      },
    };

    const result = await listRulesToolHandler(request);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.nextCursor).toBe("next-page-token");
    expect(listRules).toHaveBeenCalledWith("current-token", undefined);
  });

  it("should filter rules by tags", async () => {
    const mockRules = {
      searchProjectRules: {
        results: [
          { name: "rule1", description: "AWS rule", tags: ["AWS", "Security"] },
          { name: "rule2", description: "Security rule", tags: ["Security", "Compliance"] },
        ],
        nextToken: null,
      },
    };

    (listRules as jest.Mock).mockResolvedValue(mockRules);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "listRules",
        arguments: { tags: ["Security"] },
      },
    };

    const result = await listRulesToolHandler(request);
    const parsedResult = JSON.parse(result.content[0].text as string);
    expect(parsedResult.rules).toHaveLength(2);
    expect(parsedResult.rules[0].tags).toContain("Security");
    expect(parsedResult.rules[1].tags).toContain("Security");
    expect(listRules).toHaveBeenCalledWith(undefined, ["Security"]);
  });
});

describe("getRuleToolHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return rule when found", async () => {
    const mockRule = {
      name: "testRule",
      description: "test rule description",
      tags: ["AWS", "Security"],
      content: "This is a rule content",
      author: { displayName: "author" },
    };

    (getRuleByName as jest.Mock).mockResolvedValue(mockRule);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "getRule",
        arguments: { name: "testRule" },
      },
    };

    const expectedRuleData = {
      name: "testRule",
      description: "test rule description",
      tags: ["AWS", "Security"],
      author: "author",
      content: "This is a rule content",
    };

    const expected: CallToolResult = {
      content: [
        {
          type: "text",
          text: JSON.stringify(expectedRuleData, null, 2),
        },
      ],
    };

    const result = await getRuleToolHandler(request);
    expect(result).toEqual(expected);
    expect(getRuleByName).toHaveBeenCalledWith("testRule");
  });

  it("should throw error when name is not provided", async () => {
    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "getRule",
        arguments: {},
      },
    };

    await expect(getRuleToolHandler(request)).rejects.toThrow("Rule name is required");
  });

  it("should throw error when rule is not found", async () => {
    (getRuleByName as jest.Mock).mockResolvedValue(null);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "getRule",
        arguments: { name: "nonexistentRule" },
      },
    };

    await expect(getRuleToolHandler(request)).rejects.toThrow("Rule not found: nonexistentRule");
  });
});
