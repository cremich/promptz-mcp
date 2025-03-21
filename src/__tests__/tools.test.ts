import { CallToolRequest, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getPromptToolHandler, listPromptsToolHandler } from "../tools.js";

// Mock the graphql-client module
jest.mock("../graphql-client.js", () => ({
  listPrompts: jest.fn(),
  getPromptByName: jest.fn(),
}));

// Import after mocking
import { getPromptByName, listPrompts } from "../graphql-client.js";

describe("listPromptsToolHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted prompts without nextToken", async () => {
    const mockPrompts = {
      listPrompts: {
        items: [
          { name: "prompt1", description: "desc1" },
          { name: "prompt2", description: "desc2" },
        ],
        nextToken: null,
      },
    };

    (listPrompts as jest.Mock).mockResolvedValue(mockPrompts);

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
                { name: "prompt1", description: "desc1" },
                { name: "prompt2", description: "desc2" },
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
    expect(listPrompts).toHaveBeenCalledWith(undefined);
  });

  it("should handle nextToken correctly", async () => {
    const mockPrompts = {
      listPrompts: {
        items: [{ name: "prompt3", description: "desc3" }],
        nextToken: "next-page-token",
      },
    };

    (listPrompts as jest.Mock).mockResolvedValue(mockPrompts);

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
    expect(listPrompts).toHaveBeenCalledWith("current-token");
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
    };

    (getPromptByName as jest.Mock).mockResolvedValue(mockPrompt);

    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name: "getPrompt",
        arguments: { name: "testPrompt" },
      },
    };

    const expected: CallToolResult = {
      content: [
        {
          type: "text",
          text: JSON.stringify(mockPrompt, null, 2),
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
