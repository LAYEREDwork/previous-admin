# Installation Guide

## Quick Installation (One Command)

The fastest way to install Previous Admin on a **Linux system** (Ubuntu/Debian/Fedora/Raspberry Pi):

```bash
curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/setup.sh | sudo bash
```

This will launch an interactive TUI (Text User Interface) similar to `raspi-config` where you can:
- Configure ports, user, and Avahi/mDNS settings
- Install, update, or uninstall Previous Admin
- View service status

After installation, access the admin interface at:
- [http://next.local:2342](http://next.local:2342) (via Bonjour/mDNS)
- `http://<your-ip>:2342`

## TUI Setup Menu

The setup script provides a menu-driven interface:

```
┌──────────────── Previous Admin Setup ─────────────────┐
│                                                       │
│  1. Install      - Complete installation              │
│  2. Update       - Update to latest version           │
│  3. Uninstall    - Remove Previous Admin              │
│  4. Configure    - Change settings                    │
│  5. Status       - Show service status                │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Configuration Options

Under **Configure** you can adjust:

| Option | Default | Description |
|--------|---------|-------------|
| Frontend Port | 2342 | HTTP port for the web interface |
| Backend Port | 3001 | API port |
| Target User | next | Linux user for the services |
| Avahi Hostname | next.local | mDNS hostname for network discovery |

## CLI Command

After installation, you can access the setup menu anytime:

```bash
sudo previous_admin
```

Or use direct commands without TUI:

```bash
sudo previous_admin install    # Direct installation
sudo previous_admin update     # Update to latest version
sudo previous_admin status     # Show service status
sudo previous_admin uninstall  # Remove Previous Admin
```

## Local Installation

Clone the repository and run the setup script:

```bash
# Clone the repository
git clone https://github.com/LAYEREDwork/previous-admin.git
cd previous-admin

# Run the setup script (requires root)
sudo ./setup.sh
```

The setup script will automatically:
- Install Node.js 22+ and required system dependencies
- Create dedicated system user (default: `next`)
- Build the application for production
- Install and configure user-space systemd services
- Set up Avahi/Bonjour for network discovery
- Create the `previous_admin` CLI command
- Start all services and display access information

## Uninstallation

Use the TUI menu or run directly:

```bash
sudo previous_admin uninstall
# or
sudo scripts/uninstall.sh
```

The uninstall process will:
- Stop and disable all systemd services
- Optionally backup your database
- Remove installation directory
- Remove configuration and database files
- Remove the `previous_admin` CLI command
- Clean up all system integration (Avahi, systemd)

## Environment Variables

You can override default settings via environment variables:

```bash
export PA_TARGET_USER="myuser"
export PA_FRONTEND_PORT="8080"
export PA_BACKEND_PORT="3000"
export PA_MDNS_HOSTNAME="myhostname"
export PA_INSTALL_AVAHI="true"

sudo -E ./setup.sh install
```
