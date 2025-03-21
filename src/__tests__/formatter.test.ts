import { Prompt } from "../definitions.js";
import { toMCPPrompt, toMCPPromptMessage } from "../formatter.js";

describe("formatter", () => {
  describe("toMCPPrompt", () => {
    it("should correctly transform a prompt to MCP Prompt", () => {
      // Arrange
      const input: Prompt = {
        name: "Test Prompt",
        description: "A test prompt description",
        instruction: "Some instruction", // including this even though it's not used in transformation
      };

      // Act
      const result = toMCPPrompt(input);

      // Assert
      expect(result).toEqual({
        name: "Test Prompt",
        description: "A test prompt description",
      });
    });
  });

  describe("toMCPPromptMessage", () => {
    it("should correctly transform a prompt to MCP PromptMessage", () => {
      // Arrange
      const input: Prompt = {
        name: "Test Prompt",
        description: "A test prompt description",
        instruction: "Some instruction",
      };

      // Act
      const result = toMCPPromptMessage(input);

      // Assert
      expect(result).toEqual({
        role: "user",
        content: {
          type: "text",
          text: "Some instruction",
        },
      });
    });
  });
});
