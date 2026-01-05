# Technology Stack

## Overview

Previous Admin is built with modern, production-ready technologies focusing on performance, maintainability, and platform compatibility.

## Frontend

### Core Framework
- **React 19.2.3** - Component-based UI library
- **TypeScript 5.9.3** - Static type checking for JavaScript
- **Vite 7.3.0** - Ultra-fast build tool and development server

### Styling
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Rsuite UI 5.70.x** - React component library with built-in themes

### Real-Time Communication
- **WebSocket** - Native browser WebSockets for real-time metrics
- Automatic reconnection and fallback handling

### State Management
- **React Context API** - Global state management for user session, settings, notifications
- **Custom Hooks** - Business logic extracted into reusable hooks

### Internationalization (i18n)
- Supports **5 languages**: German, English, Spanish, French, Italian
- Automatic translation key generation from configuration schema
- Theme-aware text direction support

### Development Tools
- **Vitest 4.0.16** - Fast, modern test framework with Jest API compatibility
- **ESLint** - Code linting and style enforcement
- **PostCSS** - CSS processing and transformation

## Backend

### Server & Runtime
- **Node.js 22+** - JavaScript runtime
- **Express 4.x** - Lightweight web server framework
- **TypeScript 5.9.3** - Type-safe backend code

### Database
- **SQLite** - Lightweight, embedded database
- **better-sqlite3** - Fast, synchronous Node.js bindings for SQLite
- Stored in: `~/.previous-admin/previous-admin.db`

### Real-Time Communication
- **WebSocket** - Bidirectional real-time communication with frontend

### Configuration Management
- **Platform Abstraction Layer** - Handles macOS and Linux differences
- Configuration files parsed from native formats (`.plist` files)
- Automatic file watching for external configuration changes

### System Integration
- **Cross-platform support**: macOS and Linux
- **Avahi/Bonjour support**: Network discovery via `next.local`
- **systemd integration**: Service management and auto-start

### Testing
- **Vitest 4.0.16** - Backend test runner with Node environment
- Test suites for configuration parsing, database operations, API endpoints
- All 47 backend tests passing

## Development & Production

### Build System
- **Vite** - Development: lightning-fast HMR (Hot Module Replacement)
- Production: Optimized single-page application bundle

### Package Management
- **npm** - Dependency and script management
- Automated setup via `install.sh` (includes Node.js installation)

### Source Control
- **GitHub** - Version control and release management
- **GitHub Actions** - CI/CD pipeline with automated testing and builds

## Key Dependencies

### Frontend
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "typescript": "^5.9.3",
  "vite": "^7.3.0",
  "tailwindcss": "^3.4.15",
  "rsuite": "^5.70.14",
  "vitest": "^4.0.16"
}
```

### Backend
```json
{
  "express": "^4.21.2",
  "better-sqlite3": "^11.7.0",
  "typescript": "^5.9.3",
  "vitest": "^4.0.16"
}
```

## Architecture Highlights

### Frontend-Backend Communication
- **REST API**: HTTP endpoints for data operations
- **WebSocket**: Real-time metrics streaming and updates
- **Platform-specific handling**: Detected at runtime

### Configuration Management
- Schema-driven configuration parsing
- Platform-specific configuration file formats
- Automatic validation and error recovery
- File watching for external modifications

### Real-Time Metrics
- CPU load monitoring
- Memory usage tracking
- Disk I/O statistics
- Network traffic analysis
- Streamed to frontend via WebSocket for live charts

### Internationalization
- Translation keys auto-generated from configuration schema
- Namespace-based organization
- Fallback to English for missing translations
- Theme-aware text rendering
