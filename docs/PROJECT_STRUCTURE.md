# Project Structure

## Overview

Previous Admin follows a modular structure separating frontend, backend, and shared components with clear responsibilities.

## Directory Layout

```
previous-admin/
├── .github/                           # GitHub workflows, CI/CD, and project instructions
├── .vscode/                           # VS Code workspace settings
├── backend/                           # Node.js/Express server
│   ├── __tests__/                     # Backend test suite
│   ├── api/                           # REST API endpoints
│   ├── config/                        # Configuration management layer
│   ├── config-schema/                 # Configuration schema parsing
│   ├── database/                      # SQLite database operations
│   ├── platform/                      # Platform abstraction layer
│   │   ├── linux/                     # Linux-specific implementations
│   │   └── macos/                     # macOS-specific implementations
│   ├── previous-config/               # Previous emulator config parsing
│   └── services/                      # Business logic services
│
├── dist/                              # Production build output (generated)
│
├── docs/                              # Project documentation
│   ├── INSTALLATION.md                # Installation guides
│   ├── DEVELOPMENT.md                 # Development setup
│   ├── TECHNOLOGY_STACK.md            # Technology overview
│   ├── ARCHITECTURE.md                # Architecture and patterns
│   ├── PROJECT_STRUCTURE.md           # Directory layout
│   ├── CI.md                          # GitHub Actions pipeline
│   ├── TRANSLATION_de.md              # German i18n documentation
│   ├── TRANSLATION_en.md              # English i18n documentation
│   └── SCREENSHOTS.md                 # Documentation screenshots
│
├── frontend/                          # React web application
│   ├── __tests__/                     # Frontend test suite
│   ├── components/                    # React UI components
│   │   ├── charts/                    # Data visualization components
│   │   ├── controls/                  # Reusable UI controls and widgets
│   │   ├── pages/                     # Main application pages
│   │   ├── partials/                  # Reusable layout partials
│   │   └── sf-symbols/                # SF Symbols icon components
│   ├── contexts/                      # React Context providers
│   ├── hooks/                         # Custom React hooks
│   └── lib/                           # Utilities and libraries
│       ├── api/                       # API client functions
│       ├── i18n/                      # Internationalization
│       │   └── locales/               # Translation files (5 languages)
│       ├── icons/                     # Icon system (SF Symbols)
│       ├── types/                     # TypeScript type definitions
│       └── styles/                    # Styling utilities
│
├── node_modules/                      # npm dependencies (generated)
│
├── public/                            # Static assets
│   ├── assets/                        # Images and media
│   └── fonts/                         # Font files
│
├── scripts/                           # Automation and generation scripts
│
├── shared/                            # Shared code (frontend + backend)
│   ├── api/                           # Shared API types
│   └── previous-config/               # Shared config types
│
├── src/                               # Additional source files
│   └── test/                          # Test utilities and fixtures
│
├── .github/
│   └── workflows/                     # GitHub Actions CI/CD workflows
│
└── Root Configuration Files
    ├── package.json                   # npm dependencies and scripts
    ├── tsconfig.json                  # Root TypeScript config
    ├── vite.config.ts                 # Vite build configuration
    ├── vitest.config.ts               # Vitest test configuration
    ├── tailwind.config.js             # Tailwind CSS config
    ├── postcss.config.js              # PostCSS configuration
    ├── eslint.config.js               # ESLint configuration
    ├── index.html                     # HTML entry point
    ├── README.md                      # Project overview
    └── EDITOR_MIGRATION.md            # Migration guide

Generated at Runtime
└── ~/.previous-admin/
    └── previous-admin.db              # SQLite database
```

## Architecture Overview

The project is organized into three main layers:

- **Backend** (`backend/`) — Express.js server with REST API, configuration management, and database operations
- **Frontend** (`frontend/`) — React application with UI components, state management via contexts, custom hooks, and utilities
- **Shared** (`shared/`) — Common types and interfaces used by both frontend and backend

## Key Organizational Principles

- **Platform Abstraction** — Configuration management handles macOS and Linux differences transparently
- **Modular Structure** — Each feature has dedicated directories with clear responsibilities
- **Colocated Tests** — Test files sit alongside source code (`.test.ts` files in same directories)
- **Automated Generation** — Schema extraction, icon mapping, translation keys, and types all auto-generated
- **Comprehensive Testing** — 186 tests total (47 backend + 139 frontend) covering all major functionality
