# Installation Guide

## Quick Installation (One Command)

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

## Automated Installation (Local Setup)

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

## Uninstallation

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

## Manual Installation

For advanced configuration options, you can customize the installation by running the script locally and modifying the configuration variables in [install.sh](../install.sh).
