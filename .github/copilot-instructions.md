# Copilot Instructions for `previous-admin`

## General Guidelines
- Never use a single character for variable names, parameters, or any identifiers; always use descriptive names.
- Always, in every kind of code, add comments to explain non-trivial parts in English.
- Always format code with proper indentation and spacing for better readability.
- Always add JSDoc documentation comments for all functions and classes in English.
- Never change code on your own without my explicit request.
- Always communicate in German when discussing internal logic or UI strings.
- When adding features or making changes, always run linter, typecheck and build commands to ensure code quality. If there are any errors, always fix them before proceeding.
- When creating new colours, always ensure that they are theme-aware. This means that they should work in both light and dark mode.

## Architecture Overview
- **Frontend**: React 18 + TypeScript app built with Vite, using Tailwind CSS and Rsuite UI components. Runs on port 5173 in development, served by backend in production.
- **Backend**: Node.js + Express server with TypeScript, handling REST API (`/api/*`), WebSocket connections, and platform-specific operations. Runs on port 3001 in development, 2342 in production.
- **Database**: SQLite database stored in `~/.previous-admin/previous-admin.db` with automatic schema initialization.
- **Communication**: Frontend communicates with backend via HTTP API and WebSockets for real-time system metrics.
- **Platform Support**: Platform-specific config managers for macOS and Linux (see `backend/config/` and `backend/platform/`).
- **State Management**: React contexts (`contexts/`) for global state, custom hooks (`hooks/`) for business logic.
- **Internationalization**: Full i18n support with German, English, Spanish, French, Italian translations in `frontend/lib/translations/`.

## Development Workflows
- **Start Development**: Run `npm run backend` in one terminal (starts backend on :3001) and `npm run dev` in another (starts frontend on :5173).
- **Build**: `npm run build` creates production frontend build served by backend on :2342.
- **Testing**: `npm run test` runs both frontend (Vitest) and backend (Jest) tests.
- **Code Quality**: `npm run lint` (ESLint), `npm run typecheck` (TypeScript check).
- **Update Process**: Never use `git pull`; download and extract new versions from GitHub releases (see `scripts/update.ts`).
- **Production Setup**: Use `sudo ./install.sh` for automated installation with systemd services and Avahi/Bonjour discovery.
- **Uninstallation**: Use `sudo scripts/uninstall.sh` for clean removal with optional database backup (can be run from any directory).

## Project-Specific Patterns
- **Config Management**: Use `ConfigManager` class (`backend/config/index.ts`) for reading/writing Previous emulator config files. Platform-specific implementations in `linux-config-manager.ts`/`macos-config-manager.ts`.
- **Database Operations**: Import from `backend/database/` modules; configurations stored with order, active status, and metadata.
- **API Routes**: REST endpoints in `backend/api/`, WebSocket setup in `backend/websocket.ts`.
- **Custom Hooks**: Business logic extracted into hooks like `useConfigActions`, `useConfigList` for reusable frontend logic.
- **Error Handling**: Use `PAErrorBoundary` component and notification context for user-facing errors.
- **File Watching**: `backend/file-watcher.ts` monitors config file changes for auto-sync.
- **Metrics Collection**: Real-time system metrics via `backend/metrics.ts` and WebSockets.

## Key Files and Directories
- `backend/index.ts`: Main server entry point with Express setup, routes, and WebSocket initialization.
- `frontend/App.tsx`: Root component with context providers and tab-based navigation.
- `shared/types.ts`: Shared TypeScript interfaces for Configuration, API responses.
- `backend/platform/`: Platform abstraction layer for OS-specific operations.
- `frontend/lib/database.ts`: Frontend database API client functions.
- `scripts/`: Automation scripts for setup, updates, and maintenance.

## Custom Commands

- **`:arch`**: Provides a brief summary of the architecture of the current project. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory.
- **`:badges`**: Run the script `scripts/update_badges.sh`.
- **`:cm`**: Creates a compact commit message in English for the changes since the last commit. Only recently changed files should be included (`git status`). The message should contain a headline and an unordered list, formatted as plain text in a code block.
- **`:dev-setup`**: Provide step-by-step instructions for setting up the development environment for the current project. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory.
- **`:desc`**: Produce a complete functional description of the project, divided into backend and frontend, without technical details, as Markdown. If the command is followed by a `>` symbol and a string, write the text to a file with that name in the project root directory. If the name contains a language suffix such as `.de.md` or `.en.md`, write the description in the corresponding language.
- **`:desct`**: Produce a complete functional description of the project, divided into backend and frontend, with all technical details, as Markdown. If the command is followed by a `>` symbol and a string, write the text to a file with that name in the project root directory. If the name contains a language suffix such as `.de.md` or `.en.md`, write the description in the corresponding language.
- **`:docs <topic>`**: Generate detailed documentation on the specified topic in the context of the current project. The documentation must be in Markdown format and include code examples where appropriate. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory. If no topic is specified, generate comprehensive documentation for the entire project.
- **`:ls`**: Output a list of all custom commands that start with ":" as Markdown.
- **`:scan`**: Scan the project’s code and update your context.
- **`:undo`**: Undo the last changes in the code and return to the previous state.
- **`:release`**: Create concise, non-technical release notes in English for the changes since the last release. The release notes should include the new version name as a heading (e.g. "## Version 1.2.0") and a list of the most important new features, improvements and bug fixes below. Format the release notes as Markdown in a code block.