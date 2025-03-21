# Product Context: promptz.dev MCP Server

## Why This Project Exists

The promptz.dev MCP Server exists to bridge the gap between AI assistants and the promptz.dev platform. It addresses the following needs:

1. **Reducing Context Switching**: Developers often need to switch between their AI assistant and the promptz.dev website to access prompts, which disrupts their workflow.
2. **Streamlining Access**: Without this integration, users must manually copy-paste prompts from promptz.dev into their AI assistant, which is time-consuming and error-prone.
3. **Enhancing Discoverability**: Many users may not be aware of the valuable prompts available on promptz.dev that could help them with their tasks.
4. **Enabling Programmatic Access**: Providing a standardized way for AI assistants to access prompts from promptz.dev enables more sophisticated integrations and use cases.

## Problems It Solves

1. **Manual Copy-Paste**: Eliminates the need to manually copy-paste prompts from promptz.dev to AI assistants.
2. **Workflow Disruption**: Keeps users in their preferred environment (AI assistant) without needing to navigate to external websites.
3. **Prompt Discovery**: Makes it easier to discover relevant prompts directly from the AI assistant interface.
4. **Version Control**: Ensures users always access the latest version of prompts from promptz.dev.
5. **Authentication Complexity**: Handles the authentication with promptz.dev API transparently for the user.

## How It Should Work

1. **Installation**: Users install the MCP server and configure it with their promptz.dev API credentials.
2. **Connection**: The MCP server connects to AI assistants that support the Model Context Protocol.
3. **Tool Discovery**: AI assistants automatically discover the tools provided by the MCP server.
4. **Prompt Listing**: Users can ask their AI assistant to list available prompts from promptz.dev.
5. **Prompt Retrieval**: Users can request specific prompts by name, and the AI assistant retrieves them from promptz.dev.
6. **Prompt Application**: The AI assistant can then use the retrieved prompt to guide its responses.

## User Experience Goals

1. **Seamless Integration**: The interaction with promptz.dev should feel like a natural extension of the AI assistant's capabilities.
2. **Minimal Configuration**: Setup should be straightforward with clear instructions.
3. **Natural Language Interaction**: Users should be able to access prompts using natural language requests.
4. **Responsive Performance**: Prompt retrieval should be fast and reliable.
5. **Helpful Error Messages**: When issues occur, error messages should be clear and actionable.
6. **Discoverability**: Users should be able to easily discover what prompts are available and how to use them.
7. **Transparency**: Users should understand when and how the AI assistant is using prompts from promptz.dev.

## Target Users

1. **Developers**: Who use AI assistants for coding, documentation, and other development tasks.
2. **Content Creators**: Who use AI assistants for writing, editing, and creative work.
3. **Productivity Enthusiasts**: Who leverage AI assistants to optimize their workflows.
4. **Prompt Engineers**: Who create and share prompts on promptz.dev and want to use them with AI assistants.
5. **Enterprise Users**: Who need consistent prompt usage across their organization.
