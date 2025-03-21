# Project Brief: promptz.dev MCP Server

## Overview

The promptz.dev MCP Server is a Model Context Protocol (MCP) server that enables AI assistants to access prompts from the promptz.dev API directly. This eliminates the need for developers to manually copy-paste prompts, reducing context switching and friction in their workflow.

## Core Requirements

1. **API Integration**: Connect to the promptz.dev GraphQL API to fetch prompts.
2. **MCP Compliance**: Implement the Model Context Protocol to expose tools and resources to AI assistants.
3. **Authentication**: Support API key authentication for secure access to the promptz.dev API.
4. **Tool Functionality**: Provide tools for listing and retrieving prompts.
5. **Error Handling**: Implement robust error handling and logging for debugging.
6. **Documentation**: Provide clear documentation for installation and usage.

## Goals

1. **Seamless Integration**: Enable AI assistants to access prompts from promptz.dev without requiring users to switch contexts.
2. **Efficiency**: Reduce the time and effort required to use prompts from promptz.dev.
3. **Discoverability**: Make it easy for users to discover and use prompts from promptz.dev.
4. **Reliability**: Ensure the server is stable and handles errors gracefully.
5. **Extensibility**: Design the server to be easily extended with additional functionality in the future.

## Success Criteria

1. Users can list available prompts from promptz.dev through their AI assistant.
2. Users can retrieve specific prompts by name through their AI assistant.
3. The server handles errors gracefully and provides helpful error messages.
4. The server is easy to install and configure.
5. The server is well-documented with clear examples of usage.

## Constraints

1. The server must communicate with AI assistants using the Model Context Protocol.
2. The server must authenticate with the promptz.dev API using an API key.
3. The server must be compatible with various MCP clients, including Claude Desktop.
4. The server must be implemented in TypeScript and run in Node.js.
