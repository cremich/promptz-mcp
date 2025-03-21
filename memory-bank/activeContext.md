# Active Context: promptz.dev MCP Server

## Current Work Focus

The promptz.dev MCP Server is currently focused on providing basic functionality to access prompts from the promptz.dev API through the Model Context Protocol. The server implements two main tools:

1. `list_prompts`: For listing available prompts from promptz.dev
2. `get_prompt`: For retrieving a specific prompt by name

The server is designed to be easy to install and configure, with clear documentation and error handling.

## Recent Changes

- Initial implementation of the MCP server with basic functionality
- Added support for listing prompts from promptz.dev
- Added support for retrieving specific prompts by name
- Implemented error handling and logging
- Added documentation for installation and usage
- Added support for filtering prompts by tags in the list_prompts tool

## Next Steps

### Short-term Priorities

1. **Testing and Validation**:

   - Test the server with various MCP clients
   - Validate error handling in different scenarios
   - Ensure compatibility with different operating systems

2. **Documentation Improvements**:

   - Add more examples of usage
   - Create a troubleshooting guide
   - Document common error scenarios and solutions

3. **Logging Enhancements**:
   - Add more detailed logging for debugging
   - Implement log levels for different environments

### Medium-term Goals

1. **Feature Enhancements**:

   - Add support for searching prompts by tags or keywords
   - Implement pagination for listing prompts
   - Add support for filtering prompts by category

2. **Performance Optimizations**:

   - Implement caching for frequently accessed prompts
   - Optimize GraphQL queries for better performance

3. **User Experience Improvements**:
   - Provide more detailed prompt information
   - Add support for prompt templates with variables

### Long-term Vision

1. **Advanced Integration**:

   - Support for creating and updating prompts
   - Integration with prompt versioning
   - Support for private prompts and team sharing

2. **Ecosystem Expansion**:
   - Support for additional MCP clients
   - Integration with other prompt repositories
   - Development of companion tools and utilities

## Active Decisions and Considerations

### API Authentication

Currently, the server requires users to provide their own API credentials through environment variables. This approach was chosen for security and flexibility, but it requires users to obtain their own API keys from promptz.dev.

**Considerations**:

- Should we provide a simpler authentication method?
- How can we make the API key setup process more user-friendly?
- Should we support different authentication methods for different use cases?

### Error Handling Strategy

The current error handling strategy focuses on providing clear error messages and logging detailed information for debugging. Errors from the promptz.dev API are caught, logged, and translated into appropriate MCP error responses.

**Considerations**:

- How can we make error messages more actionable for users?
- Should we implement retry logic for transient errors?
- How can we better distinguish between user errors and system errors?

### Tool Design

The current tools (`list_prompts` and `get_prompt`) are designed to be simple and focused on specific tasks. This approach makes them easy to understand and use, but it may limit their flexibility.

**Considerations**:

- Should we combine related functionality into more powerful tools?
- How can we make the tools more discoverable for users?
- Should we add more parameters to existing tools for advanced use cases?

### Deployment Strategy

The server is currently designed to be run locally by users, either through direct installation or using npx. This approach minimizes infrastructure requirements but may limit scalability and reliability.

**Considerations**:

- Should we provide a hosted version of the server?
- How can we make the installation process even simpler?
- Should we support containerization for easier deployment?
