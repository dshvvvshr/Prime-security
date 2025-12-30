# Contributing to Brave Search MCP Server

Thank you for your interest in contributing to the Brave Search MCP Server! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Prime-security.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Brave API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

Before submitting a PR:

1. Ensure the code builds without errors: `npm run build`
2. Test the MCP server with a real API key
3. Verify all tools work correctly

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Ensure the code builds successfully

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (Node.js version, OS, etc.)

## Feature Requests

We welcome feature requests! Please:

- Check if the feature has already been requested
- Provide a clear use case
- Explain why the feature would be useful
- Be open to discussion and feedback

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
