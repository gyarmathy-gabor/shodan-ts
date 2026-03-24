# Contributing to shodan-ts

First off, thank you for considering contributing to `shodan-ts`!

Whether you are fixing a bug, adding a new Shodan API endpoint, or improving the documentation, your help is welcome.

## Local Development Setup

To get the project running locally on your machine:

1. **Fork the repository** on GitHub and clone your fork locally.
2. **Install dependencies** using your preferred package manager (npm, pnpm, or yarn):
   ```bash
   npm install
   ```
3. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/my-new-feature
   ```

## Project Structure

Here is a quick overview of the repository so you can easily navigate the codebase:

```text
shodan-ts/
├── src/
│   ├── index.ts        # Main entry point and client initialization
│   ├── constants.ts    # Global configurations and base URLs
│   ├── errors.ts       # Custom error classes (ShodanApiError, etc.)
│   ├── types/          # TypeScript interfaces for API requests/responses
│   ├── utils/          # Helper functions (fetch wrappers, formatting)
│   └── modules/        # The actual Shodan API implementation
│       ├── core/       # Core REST API (searchMethods.ts, alertMethods.ts, etc.)
│       ├── stream/     # Streaming API implementation (to be implemented in later releases)
│       └── trends/     # Trends API implementation
├── tests/              # Vitest test suite (mirrors the src structure)
├── docs/               # Detailed Markdown documentation for the API
├── examples/           # Project-specific examples
└── dist/               # Compiled ESM and CJS code (generated via tsup)
```

## Scripts you should know

- `npm run build`: Compiles the TypeScript code into the `dist` folder using `tsup` (ESM and CJS).
- `npm run test`: Runs the test suite using `vitest`. Please ensure all tests pass before submitting a PR.
- `npm run test:coverage`: Runs the tests and generates a code coverage report.
- `npm run lint`: Checks for standard linting errors AND Prettier formatting issues via ESLint.
- `npm run typecheck`: Runs the TypeScript compiler to check for strict type errors without building the files.

## Code Style & Formatting

This project integrates **Prettier** directly into **ESLint**. This means any formatting deviations will show up as linting errors.

Before submitting a Pull Request, please ensure your code passes the linter:
```bash
npm run lint
```

## Making Changes

- **Keep it focused:** Try to keep your Pull Requests limited to a single specific feature or bugfix.
- **TypeScript:** Ensure any new Shodan API responses are fully typed with interfaces.
- **Testing:** If you add a new feature, please add a corresponding test. If you fix a bug, add a test that ensures it doesn't happen again.

## Submitting a Pull Request

1. Commit your changes with a clear, descriptive commit message.
2. Push your branch to your forked repository on GitHub.
3. Open a Pull Request against the `main` branch of this repository.
4. Fill out the Pull Request template provided.
5. Ensure the CI pipeline (GitHub Actions) passes.

Once submitted, I will review your PR as soon as possible. We might discuss some changes before it gets merged.

## Code of Conduct

By participating in this project, you agree to abide by standard open-source etiquette. Be respectful, constructive, and collaborative.