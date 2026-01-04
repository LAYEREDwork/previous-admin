[![Mastodon: @phranck](https://img.shields.io/badge/Mastodon-@LAYERED-6364ff.svg?style=flat)](https://oldbytes.space/@LAYERED)
![CI](https://github.com/LAYEREDwork/previous-admin/actions/workflows/Previous-Admin-CI.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933.svg?style=flat&logo=node.js)
![Lines of Code](https://img.shields.io/badge/LOC-17551-orange.svg?style=flat)
![Platforms](https://img.shields.io/badge/Platforms-Linux%20%7C%20macOS-lightgrey.svg?style=flat)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

# Previous Admin [WIP]

![Previous Admin Banner](.github/assets/configs-combined.png)

You can watch more screenshots [here](docs/SCREENSHOTS.md).

## ℹ️ About

Previous Admin is a modern web-based configuration management tool designed specifically for the [Previous NeXT Computer Emulator](http://previous.alternative-system.com/). It provides an intuitive interface for managing emulator configurations with security and ease of use in mind.

The application runs as a self-contained web service on your system (Linux or macOS) and allows you to create, edit, import, export, and organize multiple emulator configurations through a clean, responsive user interface.

## ✨ Features

### Configuration Management
- Create and organize multiple emulator configurations
- Edit configurations with a user-friendly interface
- Set active configuration for the Previous emulator
- Drag-and-drop reordering of configurations

### Import/Export
- Export individual configurations or complete database backups
- Import configurations from JSON files
- Sync configurations directly with the Previous emulator config file
- Backup and restore your entire configuration database

### Multi-Language Support
Full internationalization support for:
- Deutsch (German)
- English
- Español (Spanish)
- Français (French)
- Italiano (Italian)

### Modern UI/UX
- Clean, responsive design optimized for desktop and mobile devices
- iOS-style bottom navigation bar on smartphones in portrait mode
- Full functionality and optimal layout on tablets and mobile devices
- Dark mode support with NeXT-inspired aesthetics

### System Information
- Real-time system monitoring (CPU, memory, disk usage)
- Network interface information
- System uptime and kernel details
- Hardware information display

## 📦 Installation

### Quick Installation (One Command)

The fastest way to install Previous Admin on a **Linux system** (Ubuntu/Debian/Fedora/Raspberry Pi):

```bash
curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/install.sh | sudo bash
```

This single command will:
- Download the latest version from GitHub
- Install all system dependencies (Avahi, Node.js, etc.)
- Configure systemd services and Bonjour/mDNS
- Start the application automatically

After installation, access the admin interface at:
- [http://next.local:2342](http://next.local:2342) (via Bonjour/mDNS)
- `http://<your-ip>:2342`

### Automated Installation (Local Setup)

Alternatively, clone the repository and run the setup script:

```bash
# Clone the repository
git clone https://github.com/LAYEREDwork/previous-admin.git
cd previous-admin

# Run the automated setup script (requires root)
sudo ./install.sh
```

The setup script will automatically:
- Install Node.js 22+ and required system dependencies
- Create dedicated system user (`next`)
- Build the application for production
- Install and configure systemd services
- Set up Avahi/Bonjour for network discovery (`next.local`)
- Start all services and display access information

### Uninstallation

To completely remove Previous Admin from your system:

```bash
# Run the uninstall script (requires root)
# Can be run from any directory (home, project root, or scripts folder)
sudo scripts/uninstall.sh
```

The uninstall script will:
- Stop and disable all systemd services
- Optionally backup your database
- Remove installation directory
- Remove configuration and database files
- Optionally remove the 'next' user account
- Clean up all system integration (Avahi, systemd)

### Manual Installation

For advanced configuration options, you can customize the installation by running the script locally and modifying the configuration variables in [install.sh](install.sh).

## �‍💻 Development

```bash
# Install dependencies
npm install

# Start development servers
# Run backend and frontend separately (in different terminals)
npm run backend  # Starts backend server on port 3001
npm run dev      # Starts frontend dev server on port 2342

# Build for production
npm run build

# Code quality checks
npm run lint       # ESLint
npm run typecheck  # TypeScript compilation check
npm run test       # Run all tests (frontend + backend)
```

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Rsuite UI, Recharts
- **Backend**: Node.js 22+, Express, TypeScript, SQLite via better-sqlite3
- **Real-time**: WebSocket for live system metrics
- **Network Discovery**: Avahi/Bonjour (mDNS)
- **Internationalization**: Full i18n support (5 languages)

### Development Notes

- **Frontend**: `http://localhost:2342` with hot module reload
- **Backend**: `http://localhost:3001` serving REST API at `/api/*`
- **Database**: SQLite at `~/.previous-admin/previous-admin.db`
- **Testing**: Vitest (frontend), Jest (backend)
- **Production**: Single server on port 2342 with built frontend bundled

### Project Structure

```text
previous-admin/
├── .github/               GitHub workflows, CI/CD, and project instructions
│   ├── assets/            Badges and images for documentation
│   │   └── db/            Database schema documentation
│   ├── instructions/      Copilot and development guidelines
│   └── workflows/         GitHub Actions CI/CD workflows
├── .vscode/               VS Code workspace settings and configurations
├── backend/               Express TypeScript server with API, config, and database logic
│   ├── __tests__/         Backend unit tests
│   ├── api/               REST API route endpoints
│   ├── config/            Configuration file managers (Linux/macOS specific)
│   ├── database/          SQLite database operations and schema
│   ├── platform/          Platform abstraction layer
│   │   ├── linux/         Linux-specific implementations
│   │   └── macos/         macOS-specific implementations
│   ├── previous-config/   Previous emulator config file parsing
│   └── services/          Business logic services
├── dist/                  Production build output (generated)
├── docs/                  Project documentation and guides
├── frontend/              React 18 TypeScript application
│   ├── __tests__/         Frontend unit and integration tests
│   ├── components/        UI components and pages
│   │   ├── controls/      Reusable UI controls and widgets
│   │   ├── pages/         Main application pages
│   │   ├── partials/      Reusable layout partials
│   │   └── sf-symbols/    SF Symbols icon components
│   ├── contexts/          React context providers for state
│   ├── hooks/             Custom React hooks for business logic
│   └── lib/               Utilities, API client, i18n, and types
│       ├── api/           API client functions
│       ├── config/        Configuration utilities
│       ├── database/      Frontend database API helpers
│       ├── http/          HTTP client utilities
│       ├── i18n/          Internationalization (5 languages)
│       ├── types/         Type definitions
│       └── utils/         Helper utilities
├── node_modules/          npm dependencies (generated)
├── public/                Static assets served as-is
│   ├── assets/            Images and media files
│   └── fonts/             Font files (Roboto Flex variable font)
├── scripts/               Setup, build, and utility scripts
├── shared/                Shared types and constants (frontend + backend)
│   ├── api/               Shared API type definitions
│   └── previous-config/   Shared Previous emulator config types
└── src/                   Additional source files
    └── test/              Test utilities and fixtures
```

### Architecture Highlights

- **Full TypeScript**: Type-safe codebase from backend to frontend
- **Clean Separation**: REST API layer, business logic services, stateless components
- **Custom Hooks**: Reusable business logic extracted into React hooks
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Real-time Metrics**: WebSocket integration for live system monitoring
- **Multi-language**: Complete i18n support with local storage preferences

## 🤝 Contributing

Reports and pull requests are welcome. Feel free to use the GitHub issue tracker for bug reports or feature requests, or open a pull request with your improvements.

## 📄 License

This repository has been published under the [CC-BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.
