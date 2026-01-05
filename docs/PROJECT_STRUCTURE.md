# Project Structure

## Overview

Previous Admin follows a modular structure separating frontend, backend, and shared components with clear responsibilities.

## Directory Layout

```
previous-admin/
├── docs/                                # Project documentation
│   ├── INSTALLATION.md                 # Installation guide
│   ├── DEVELOPMENT.md                  # Development setup and commands
│   ├── TECHNOLOGY_STACK.md             # Technology overview
│   ├── ARCHITECTURE.md                 # Architecture patterns and design decisions
│   ├── CI.md                          # GitHub Actions CI/CD pipeline
│   ├── TRANSLATION_de.md               # German translation system documentation
│   ├── TRANSLATION_en.md               # English translation system documentation
│   └── SCREENSHOTS.md                  # Documentation screenshots
│
├── backend/                            # Node.js/Express server
│   ├── index.ts                        # Server entry point with Express setup
│   ├── metrics.ts                      # System metrics collection
│   ├── websocket.ts                    # WebSocket connection handling
│   ├── types.ts                        # Backend TypeScript types
│   │
│   ├── api/                           # REST API endpoints
│   │   ├── config.ts                  # Configuration endpoints
│   │   ├── configurations.ts          # Configurations list management
│   │   ├── database.ts                # Database query endpoints
│   │   ├── system.ts                  # System information endpoints
│   │   └── update.ts                  # Update checking endpoints
│   │
│   ├── config/                        # Configuration management layer
│   │   ├── index.ts                   # Main configuration manager
│   │   ├── base-config-manager.ts     # Abstract base class
│   │   ├── config-manager-factory.ts  # Platform-specific factory
│   │   ├── linux-config-manager.ts    # Linux implementation
│   │   ├── macos-config-manager.ts    # macOS implementation
│   │   ├── config-io.ts               # File I/O operations
│   │   └── defaults.ts                # Default configuration values
│   │
│   ├── config-schema/                 # Configuration schema parsing
│   │   ├── validator.ts               # Configuration validation
│   │   ├── schema-extractor.ts        # Extract schema from config
│   │   ├── config-parser.ts           # Parse configuration files
│   │   ├── converter.ts               # Convert between formats
│   │   ├── reference.cfg              # Reference configuration template
│   │   └── section-symbols.json       # Configuration section metadata
│   │
│   ├── database/                      # SQLite database operations
│   │   ├── index.ts                   # Database initialization
│   │   ├── core.ts                    # Core database operations
│   │   ├── configurations.ts          # Configurations table management
│   │   └── maintenance.ts             # Database maintenance utilities
│   │
│   ├── platform/                      # Platform-specific operations
│   │   ├── index.ts                   # Platform operations interface
│   │   ├── platform-detector.ts       # Detect OS platform
│   │   ├── system-info.ts             # Collect system information
│   │   ├── types.ts                   # Platform types
│   │   ├── linux/                     # Linux-specific implementations
│   │   └── macos/                     # macOS-specific implementations
│   │
│   ├── previous-config/              # Previous emulator config parsing
│   │   ├── index.ts                   # Config file operations
│   │   └── types.ts                   # Configuration types
│   │
│   ├── services/                      # Business logic services
│   │   └── configurationService.ts    # Configuration operations service
│   │
│   ├── __tests__/                     # Backend test suite
│   │   ├── config-schema.test.ts      # Configuration schema tests
│   │   ├── configurationService.test.ts # Service tests
│   │   └── converter.test.ts          # Format conversion tests
│   │
│   └── tsconfig.json                  # TypeScript configuration
│
├── frontend/                          # React web application
│   ├── App.tsx                        # Root application component
│   ├── main.tsx                       # Application entry point
│   ├── index.css                      # Global styles
│   ├── vite-env.d.ts                  # Vite type definitions
│   │
│   ├── components/                    # React UI components
│   │   ├── PABooleanInput.tsx          # Boolean toggle input
│   │   ├── PAConfigInput.tsx           # Configuration value input
│   │   ├── PAStringInput.tsx           # String input field
│   │   ├── PANumberRangeInput.tsx      # Number range slider
│   │   ├── PAEnumInput.tsx             # Dropdown enum selector
│   │   ├── PAConfigItemControlsPartial.tsx # Item action buttons
│   │   ├── PAConfigItemContentPartial.tsx  # Item content display
│   │   ├── PAConfigItemActionsPartial.tsx  # Item action panel
│   │   ├── PAConfigListPage.tsx        # Configurations list page
│   │   ├── PASystemPage.tsx            # System information page
│   │   ├── PAAboutPage.tsx             # About page
│   │   ├── PAErrorBoundary.tsx         # Error boundary component
│   │   ├── charts/                    # Metrics visualization
│   │   │   ├── PACpuLoadChart.tsx     # CPU load chart
│   │   │   ├── PAMemoryChart.tsx      # Memory usage chart
│   │   │   ├── PANetworkTrafficChart.tsx # Network traffic chart
│   │   │   └── PADiskIOChart.tsx      # Disk I/O chart
│   │   └── ...other components...
│   │
│   ├── contexts/                      # React Context for global state
│   │   ├── AuthContext.tsx            # User session state
│   │   ├── SettingsContext.tsx        # User settings
│   │   ├── NotificationContext.tsx    # Toast notifications
│   │   └── WebSocketContext.tsx       # WebSocket connection state
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useConfigActions.ts        # Configuration operations
│   │   ├── useConfigList.ts           # Configuration list management
│   │   ├── useWebSocket.ts            # WebSocket connection
│   │   ├── useSystemMetrics.ts        # System metrics
│   │   └── ...other hooks...
│   │
│   ├── lib/                           # Utilities and libraries
│   │   ├── api/                       # API client functions
│   │   │   ├── config.ts              # Configuration API calls
│   │   │   ├── system.ts              # System API calls
│   │   │   └── database.ts            # Database API calls
│   │   │
│   │   ├── database.ts                # Frontend database operations
│   │   ├── utils.ts                   # Helper functions
│   │   ├── constants.ts               # Application constants
│   │   │
│   │   ├── i18n/                      # Internationalization
│   │   │   ├── locales/              # Translation files
│   │   │   │   ├── de.ts             # German translations
│   │   │   │   ├── en.ts             # English translations
│   │   │   │   ├── es.ts             # Spanish translations
│   │   │   │   ├── fr.ts             # French translations
│   │   │   │   └── it.ts             # Italian translations
│   │   │   └── index.ts              # i18n setup
│   │   │
│   │   ├── icons/                    # Icon system
│   │   │   ├── index.tsx             # Icon component
│   │   │   ├── icons-map.ts          # Icon name mapping
│   │   │   └── icons-data.ts         # Icon data (109 SF Symbols)
│   │   │
│   │   ├── types/                    # TypeScript type definitions
│   │   │   ├── sizes.ts              # PASize enum for component sizing
│   │   │   └── ...other types...
│   │   │
│   │   └── styles/                   # Styling utilities
│   │       └── theme.ts              # Theme configuration
│   │
│   ├── __tests__/                     # Frontend test suite
│   │   ├── App.test.tsx               # App component tests
│   │   ├── PAConfigInput.test.tsx     # Input component tests
│   │   ├── PAConfigListPage.test.tsx  # Page tests
│   │   ├── useAbout.test.tsx          # Hook tests
│   │   └── ...more tests...
│   │
│   └── tsconfig.json                  # TypeScript configuration
│
├── shared/                            # Shared code (frontend + backend)
│   ├── types.ts                       # Shared TypeScript interfaces
│   ├── api/                          # Shared API types
│   └── previous-config/              # Shared configuration types
│
├── scripts/                           # Automation and generation scripts
│   ├── install.sh                     # Automated installation script
│   ├── uninstall.sh                   # Uninstall script
│   ├── start-all.sh                   # Start dev servers
│   ├── generate-config-schema.sh      # Schema extraction
│   ├── generate-sf-symbols.ts         # SF Symbols generation
│   ├── generate-translation-keys.ts   # Translation file generation
│   ├── import-example-database.ts     # Example database import
│   ├── update_badges.sh               # Badge generation
│   └── update.ts                      # Update check script
│
├── public/                            # Static assets
│   ├── assets/                        # Images and media
│   └── fonts/                         # Custom fonts
│
├── Root Configuration Files
│   ├── package.json                   # npm dependencies and scripts
│   ├── tsconfig.json                  # Root TypeScript config
│   ├── vite.config.ts                 # Vite build configuration
│   ├── vitest.config.ts               # Vitest test configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS configuration
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # HTML entry point
│   ├── README.md                      # Project overview
│   ├── EDITOR_MIGRATION.md            # Migration guide
│   └── .github/
│       └── workflows/                 # GitHub Actions CI/CD
│
└── Database
    └── ~/.previous-admin/
        └── previous-admin.db          # SQLite database (created at runtime)
```

## Key Characteristics

### Clear Separation of Concerns
- **Backend**: Server logic, database, configuration management
- **Frontend**: User interface, real-time charts, state management
- **Shared**: Common types and interfaces used by both

### Platform Abstraction
- Configuration management handles macOS and Linux differences
- Metrics collection uses platform-specific system calls
- Platform detection at runtime

### Modular Organization
- Each feature has dedicated directories
- Components are self-contained with their dependencies
- Tests colocated with source code (`.test.ts` files)

### Comprehensive Testing
- 186 tests total (47 backend + 139 frontend)
- Unit tests for utilities and services
- Component and hook tests for UI
- Integration tests for API functionality

### Automated Code Generation
- Configuration schema extraction from reference files
- SF Symbols icon mapping (109 icons)
- Translation key files from schema (5 languages)
- Type definitions from configuration format
