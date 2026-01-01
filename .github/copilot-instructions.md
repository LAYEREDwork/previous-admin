# Copilot Instructions for `previous-admin`

## General Guidelines
- Never use a single character for variable names, parameters, or any identifiers; always use descriptive names.
- Always add comments in code to explain non-trivial parts.
- Always format code with proper indentation and spacing for better readability.
- Always add JSDoc documentation comments for all functions and classes.
- Never change code on your own without my explicit request.
- Always communicate in German when discussing internal logic or UI strings.

## Architecture Overview

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, RSuite UI. Entry point: [frontend/App.tsx](frontend/App.tsx). Components, contexts, and pages are organized in `frontend/components/`, `frontend/contexts/`, and `frontend/pages/`.
- **Backend**: Node.js + Express (TypeScript). Entry point: [backend/index.ts](backend/index.ts). API routes under `/api/*`, WebSocket support, session handling via express-session.
- **Database**: SQLite, synchronous via `better-sqlite3`. Database file resides in the user’s home directory under `.previous-admin/previous-admin.db`. Schema initialization in [backend/database/core.ts](backend/database/core.ts).
- **Configuration Management**: CRUD for emulator configurations, sorting, activation, import/export. See [backend/database/configurations.ts](backend/database/configurations.ts) and API client [frontend/lib/database.ts](frontend/lib/database.ts).
- **Authentication**: Custom admin user, setup flow on first start. Authentication via session cookie, see [backend/api/auth.ts](backend/api/auth.ts).

## Developer Workflows

- **Start development**:
  - Backend: `npm run backend` (starts Express server on port 3001)
  - Frontend: `npm run dev` (starts Vite dev server on port 5173)
- **Production build**: `npm run build` (frontend), then `npm run backend` (backend)
- **Automated installation**: `sudo ./scripts/setup.sh` installs dependencies, sets up systemd services, and starts everything.
- **API base URL**: Dynamic in frontend: `http://${window.location.hostname}:3001`
- **Session secret**: In production, `SESSION_SECRET` MUST be set as an environment variable.

## Project-Specific Coding Guidelines

- **Language**: Internal communication and UI strings are multilingual, with German as the default. Translations are located in [frontend/lib/translations/](frontend/lib/translations/).
- **Naming**: No single-letter variables or parameters. Always use descriptive names.
- **Code comments**: All non-trivial logic sections and all functions/classes must be documented (see `.github/instructions/instructions.instructions.md`).
- **No silent code changes**: Changes only upon explicit instruction.
- **UI state**: Active tab is stored in `localStorage` (`currentTab`).

## API and Data Flow

- **Frontend <-> Backend**: Communication exclusively via REST API (`/api/*`). Authentication via session cookie.
- **Configuration objects**: See type `PreviousConfig` in [frontend/lib/types.ts](frontend/lib/types.ts) and [backend/types.ts](backend/types.ts).
- **Configuration changes**: Order changes are transmitted explicitly via API (`/api/configurations/order/update`).
- **Import/Export**: Single configurations and the entire database can be imported/exported (JSON).

## Integration & Special Features

- **WebSocket**: For live system metrics (`backend/websocket.ts`).
- **System services**: systemd units for backend and frontend (`systemd/`).
- **Avahi/Bonjour**: Network discovery via `next.local:2342` after setup.
- **Security**: No default passwords; setup enforces initial user creation.

## Examples & References

- **Backend API client**: [frontend/lib/api.ts](frontend/lib/api.ts)
- **Configuration CRUD**: [frontend/lib/database.ts](frontend/lib/database.ts), [backend/database/configurations.ts](backend/database/configurations.ts)
- **Session handling**: [backend/index.ts](backend/index.ts), [backend/api/auth.ts](backend/api/auth.ts)

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