[![Mastodon: @phranck](https://img.shields.io/badge/Mastodon-@LAYERED-6364ff.svg?style=flat)](https://oldbytes.space/@LAYERED)
![CI](https://github.com/LAYEREDwork/previous-admin/actions/workflows/Previous-Admin-CI.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933.svg?style=flat&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-96%25-blue.svg?style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-0%25-yellow.svg?style=flat)
![Shell](https://img.shields.io/badge/Shell-3%25-green.svg?style=flat)
![Lines of Code](https://img.shields.io/badge/LOC-22316-orange.svg?style=flat)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg?style=flat)
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
- Clean, responsive design optimized for desktop and mobile
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

For detailed manual installation instructions, platform-specific setup guides, and advanced configuration options, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, RSuite UI, SF Symbols Icons
- **Backend**: Node.js + Express (TypeScript), SQLite via better-sqlite3
- **Database**: SQLite mit automatischer Schema-Initialisierung
- **Real-time**: WebSocket-Unterstützung für Live-Systemmetriken
- **Network**: Avahi/Bonjour für automatische Netzwerkerkennung
- **Build**: Vite für Frontend, TypeScript-Compiler für Backend
- **Code Quality**: ESLint mit TypeScript-Regeln, vollständige Typ-Sicherheit

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Start development servers
# Run backend and frontend separately (in different terminals)
npm run backend  # Starts backend server on port 3001
npm run dev      # Starts frontend dev server on port 5173

# Build for production
npm run build

# Code quality checks
npm run lint       # ESLint
npm run typecheck  # TypeScript compilation check
npm run test       # Run all tests (frontend + backend)
```

### Development Notes

- **Frontend**: Runs on `http://localhost:5173` with hot reload
- **Backend**: Runs on `http://localhost:3001` with API endpoints at `/api/*`
- **Database**: SQLite file stored in `~/.previous-admin/previous-admin.db`
- **Production**: Built frontend served via backend on port 2342
- **API Base URL**: Dynamic in frontend: `http://${window.location.hostname}:3001`
- **Session Secret**: In production, `SESSION_SECRET` must be set as an environment variable
- **Testing**: Frontend tests with Vitest, backend tests with Jest
- **Build Process**: `npm run build` creates production frontend build, served by backend

### Project Structure

```text
previous-admin/
├── backend/                    # Express TypeScript server
│   ├── api/                    # REST API endpoints
│   ├── config/                 # Configuration file management
│   ├── database/               # SQLite database operations
│   ├── platform/               # Platform-specific utilities
│   │   ├── linux/              # Linux-specific implementations
│   │   └── macos/              # macOS-specific implementations
│   └── services/               # Business logic services
├── frontend/                   # React TypeScript application
│   ├── components/             # UI components
│   │   ├── controls/           # Reusable UI controls
│   │   ├── pages/              # Main application pages
│   │   └── partials/           # Reusable UI partials
│   ├── contexts/               # React contexts for state management
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utilities and shared code
│       └── translations/       # Internationalization files
├── docs/                       # Documentation
├── public/                     # Static assets
├── scripts/                    # Setup and utility scripts
├── shared/                     # Shared constants and types
└── systemd/                    # Systemd service files
```

### Code Quality & Architecture

This project follows modern TypeScript best practices with:
- **Full Type Safety**: Zero TypeScript compilation errors
- **Clean Architecture**: Separation of business logic from UI components
- **Custom Hooks**: Business logic extracted into reusable React hooks
- **Internationalization**: Complete translation support for 5 languages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: WebSocket integration for live system monitoring

## ⚠️ Disclaimer

This is a private project. Therefore I take no responsibility for the correctness and completeness (if there is any). If you find any mistakes, please use the issue function to report them. Or even better: correct the issue immediately and submit a pull request.

## 📄 License

This repository has been published under the [CC-BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.
