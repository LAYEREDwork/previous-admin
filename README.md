[![Mastodon: @phranck](https://img.shields.io/badge/Mastodon-@phranck-blue.svg?style=flat)](https://oldbytes.space/@phranck)
[![Mastodon: @phranck](https://img.shields.io/badge/Mastodon-@LAYERED-blue.svg?style=flat)](https://oldbytes.space/@LAYERED)

# Previous Admin

![Previous Admin Banner](.github/assets/banner.png)

## About

Previous Admin is a modern web-based configuration management tool designed specifically for the [Previous NeXT Computer Emulator](http://previous.alternative-system.com/). It provides an intuitive interface for managing emulator configurations with security and ease of use in mind.

The application runs as a self-contained web service on your system (Linux or macOS) and allows you to create, edit, import, export, and organize multiple emulator configurations through a clean, responsive user interface.

## Features

### 🔐 **Secure Authentication**
On first launch, you'll be prompted to create an admin account. This admin user is used to securely access and manage all configurations.

### ⚙️ **Configuration Management**
- Create and organize multiple emulator configurations
- Edit configurations with a user-friendly interface
- Set active configuration for the Previous emulator
- Drag-and-drop reordering of configurations

### 📤 **Import/Export**
- Export individual configurations or complete database backups
- Import configurations from JSON files
- Sync configurations directly with the Previous emulator config file
- Backup and restore your entire configuration database

### 🌍 **Multi-Language Support**
Full internationalization support for:
- English
- Deutsch (German)
- Italiano (Italian)
- Español (Spanish)
- Français (French)

### 🎨 **Modern UI/UX**
- Clean, responsive design optimized for desktop and mobile
- Dark mode support with NeXT-inspired aesthetics

### 📊 **System Information**
- Real-time system monitoring (CPU, memory, disk usage)
- Network interface information
- System uptime and kernel details
- Hardware information display

## Installation

### Automated Installation

The quickest way to get Previous Admin up and running on a Linux system (e.g., Raspberry Pi):

```bash
# Clone the repository
git clone https://codeberg.org/phranck/previous-admin.git
cd previous-admin

# Run the automated setup script (requires root)
sudo ./setup.sh
```

The setup script will:
- Install all required dependencies (Node.js, Python, systemd services)
- Create the necessary user accounts
- Build the application
- Configure and start the systemd services
- Display access information

After installation, access the admin interface at `http://your-ip:2342`

### Manual Installation

For detailed manual installation instructions, platform-specific setup guides, and advanced configuration options, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, rsuite
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite
- **Authentication**: Custom admin user with password-based authentication

## Development

```bash
# Install dependencies
npm install

# Run backend in development mode
npm run backend

# Run frontend in development mode (in another terminal)
npm run dev

# Build for production
npm run build
```

## Disclaimer

This is a private project. Therefore I take no responsibility for the correctness and completeness (if there is any). If you find any mistakes, please use the issue function to report them. Or even better: correct the issue immediately and submit a pull request.

## License

This repository has been published under the [CC-BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.
