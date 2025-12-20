# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev        # Start frontend (port 2342) + backend (port 3001)
npm run backend    # Backend only (tsx backend/index.ts)
npm run build      # Production build (Vite)
npm run lint       # ESLint
npm run typecheck  # TypeScript check (tsconfig.app.json)
```

## Architecture

**Previous Admin** is a web-based configuration management tool for the Previous NeXT Computer Emulator.

### Backend (Express + TypeScript, Port 3001)
- `backend/api/` - REST endpoints: auth, configurations, config, database, system, update
- `backend/config/` - Platform-specific config managers extending `BaseConfigManager`
  - `linux-config-manager.ts` and `macos-config-manager.ts`
  - Factory pattern in `config-manager-factory.ts`
- `backend/database/` - SQLite operations (better-sqlite3)
  - Database location: `~/.previous-admin/previous-admin.db`
  - Modules: core (connection), users, configurations, maintenance
- `backend/platform/` - System info collectors for Linux/macOS
- `backend/websocket.ts` - Real-time metrics via WebSocket

### Frontend (React 18 + TypeScript + Vite, Port 2342)
- `frontend/components/pages/` - Main pages (Login, ConfigList, ConfigEditor, System, ImportExport, About)
- `frontend/components/controls/` - Reusable UI components
- `frontend/hooks/` - Business logic hooks (one per page: useLogin, useConfigList, etc.)
- `frontend/contexts/` - React contexts: AuthContext, ThemeContext, LanguageContext, ConfigContext, NotificationContext
- `frontend/lib/translations/` - i18n files (de, en, es, fr, it)
- `frontend/lib/api.ts` - Backend API client

### Shared
- `shared/constants.ts` - API endpoint enum used by both frontend and backend

## Key Patterns

- **Hooks Pattern**: Each page has a corresponding hook in `frontend/hooks/` that contains all business logic
- **Platform Abstraction**: `BaseConfigManager` abstract class with Linux/macOS implementations
- **Session Auth**: express-session with bcrypt password hashing
- **API Endpoints**: Centralized in `shared/constants.ts` as `ApiEndpoints` enum

## Environment Variables (Backend)

- `PORT` (default: 3001) - Server port
- `HOST` (default: 0.0.0.0) - Server host
- `SESSION_SECRET` (required in production) - Session encryption secret
- `NODE_ENV` - Environment mode (development/production)
