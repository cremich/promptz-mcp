import { GetPromptRequest, GetPromptResult, ListPromptsRequest } from "@modelcontextprotocol/sdk/types.js";
import { listPromptsHandler, getPromptHandler } from "../prompts.js";
import { Prompt } from "../definitions.js";

// Mock the graphql-client module
jest.mock("../graphql-client.js", () => ({
  listPrompts: jest.fn(),
  getPromptByName: jest.fn(),
}));

// Import after mocking
import { getPromptByName, listPrompts } from "../graphql-client.js";

describe("prompts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listPromptsHandler", () => {
    it("should return formatted prompts without cursor", async () => {
      // Arrange
      const mockResponse = {
        listPrompts: {
          items: [
            { name: "prompt1", description: "desc1", instruction: "instruction1" },
            { name: "prompt2", description: "desc2", instruction: "instruction2" },
          ],
          nextToken: null,
        },
      };

      (listPrompts as jest.Mock).mockResolvedValue(mockResponse);

      const request: ListPromptsRequest = {
        method: "prompts/list",
        params: {},
      };

      // Act
      const result = await listPromptsHandler(request);

      // Assert
      expect(result).toEqual({
        prompts: [
          { name: "prompt1", description: "desc1" },
          { name: "prompt2", description: "desc2" },
        ],
        nextCursor: undefined,
      });
      expect(listPrompts).toHaveBeenCalledWith(undefined);
    });

    it("should handle cursor correctly", async () => {
      // Arrange
      const mockResponse = {
        listPrompts: {
          items: [{ name: "prompt3", description: "desc3", instruction: "instruction3" }],
          nextToken: "next-page-token",
        },
      };

      (listPrompts as jest.Mock).mockResolvedValue(mockResponse);

      const request: ListPromptsRequest = {
        method: "prompts/list",
        params: {
          cursor: "current-token",
        },
      };

      // Act
      const result = await listPromptsHandler(request);

      // Assert
      expect(result).toEqual({
        prompts: [{ name: "prompt3", description: "desc3" }],
        nextCursor: "next-page-token",
      });
      expect(listPrompts).toHaveBeenCalledWith("current-token");
    });
  });

  describe("getPromptHandler", () => {
    it("should return prompt message when found", async () => {
      // Arrange
      const mockPrompt: Prompt = {
        name: "testPrompt",
        description: "test description",
        instruction: "test instruction",
      };

      (getPromptByName as jest.Mock).mockResolvedValue(mockPrompt);

      const request: GetPromptRequest = {
        method: "prompts/get",
        params: {
          name: "testPrompt",
        },
      };

      const expected: GetPromptResult = {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: "test instruction",
            },
          },
        ],
        description: "test description",
      };

      // Act
      const result = await getPromptHandler(request);

      // Assert
      expect(result).toEqual(expected);
      expect(getPromptByName).toHaveBeenCalledWith("testPrompt");
    });

    it("should throw error when prompt is not found", async () => {
      // Arrange
      (getPromptByName as jest.Mock).mockResolvedValue(null);

      const request: GetPromptRequest = {
        method: "prompts/get",
        params: {
          name: "nonexistentPrompt",
        },
      };

      // Act & Assert
      await expect(getPromptHandler(request)).rejects.toThrow("Prompt not found: nonexistentPrompt");
      expect(getPromptByName).toHaveBeenCalledWith("nonexistentPrompt");
    });
  });
});
