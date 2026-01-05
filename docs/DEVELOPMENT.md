# Development Guide

## Setup

To set up your development environment, follow these steps:

1. **Prerequisites**: Ensure you have Node.js 22+ and npm installed.

2. **Clone and Install**:
   ```bash
   git clone https://github.com/LAYEREDwork/previous-admin.git
   cd previous-admin
   npm install
   ```

## Running During Development

Start the application in **two separate terminals**:

### Terminal 1 - Backend Server
```bash
npm run backend
```
Backend runs on `http://localhost:3001`

### Terminal 2 - Frontend Development Server
```bash
npm run dev
```
Frontend runs on `http://localhost:2342`

## Available Commands

### Development
- `npm run dev` - Start frontend in development mode
- `npm run backend` - Start backend server
- `npm run build` - Build for production

### Code Quality
- `npm run lint` - Run ESLint (JavaScript/TypeScript linting)
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run all tests (frontend + backend)
- `npm run test:frontend` - Run frontend tests only
- `npm run test:backend` - Run backend tests only

### Code Generation
- `npm run generate` - Run all generation commands (meta-script)
- `npm run generate:schema` - Generate TypeScript types from JSON schema
- `npm run generate:sfsymbols` - Generate SF Symbols icon components
- `npm run generate:fontlist` - Generate available fonts list from /public/fonts
- `npm run generate:translationkeys` - Generate translation key types
- `npm run generate:screenshots` - Generate documentation screenshots
- `npm run generate:sfsymbols` - Generate SF Symbols icon mappings
- `npm run generate:translationkeys` - Generate translation key files

### Database & Examples
- `npm run import:exampledb` - Import example database for testing

## Testing Framework

Previous Admin uses **Vitest** for all testing:
- **Backend Tests**: Located in `backend/__tests__/`
- **Frontend Tests**: Located in `frontend/__tests__/`
- **Test Configuration**: `vitest.config.ts` (supports both jsdom and node environments)

All 186 tests must pass before committing code to the main branch.

## Code Quality Standards

Before submitting changes, ensure:

```bash
npm run lint:fix    # Fix any style issues
npm run typecheck   # Type checking must pass
npm run test        # All tests must pass
```

## Project Structure

The project follows a structured layout:

- **`backend/`** - Node.js/Express server
  - `api/` - REST API endpoints
  - `config/` - Configuration management (platform-specific)
  - `database/` - SQLite database operations
  - `platform/` - OS-specific implementations
  - `__tests__/` - Backend tests
  
- **`frontend/`** - React 19 web UI
  - `components/` - React UI components
  - `contexts/` - Global state management
  - `hooks/` - Custom React hooks
  - `lib/` - Utilities and libraries
  - `__tests__/` - Frontend tests

- **`shared/`** - Shared types and utilities used by both frontend and backend

## Building for Production

```bash
npm run build
```

This creates a production-optimized frontend that the backend will serve on port 2342. The backend automatically serves the built frontend files at startup.

## Internationalization

Previous Admin supports multiple languages. The translation system is fully automated:

- New translations are automatically generated from the configuration schema
- For detailed information, see [TRANSLATION_en.md](./TRANSLATION_en.md)

## CI/CD Pipeline

All commits are validated by GitHub Actions, which runs:
- ESLint (code style)
- TypeScript checking
- Full test suite (frontend + backend)
- Build verification

For details on the CI/CD process, see [CI.md](./CI.md).
