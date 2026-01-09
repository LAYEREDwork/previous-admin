# Installation Guide

## Quick Installation

The fastest way to install Previous Admin on a **Linux system** (Ubuntu/Debian/Fedora/Raspberry Pi):

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/setup.sh | sudo bash -s -- install
```

Or download first, then run:

```bash
curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/setup.sh -o /tmp/pa-setup.sh
sudo bash /tmp/pa-setup.sh install
```

After installation, access the admin interface at:
- [http://next.local:2342](http://next.local:2342) (via Bonjour/mDNS)
- `http://<your-ip>:2342`

## CLI Commands

After installation, you can use the `previous_admin` command:

```bash
sudo previous_admin install    # Install Previous Admin
sudo previous_admin update     # Update to latest version
sudo previous_admin status     # Show service status
sudo previous_admin uninstall  # Remove Previous Admin
sudo previous_admin help       # Show help
```

## Configuration Options

Configuration is done via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| PA_TARGET_USER | next | Linux user for the services |
| PA_FRONTEND_PORT | 2342 | HTTP port for the web interface |
| PA_BACKEND_PORT | 3001 | API port |
| PA_MDNS_HOSTNAME | next | mDNS hostname (without .local) |
| PA_INSTALL_AVAHI | true | Install Avahi for network discovery |

Example with custom settings:

```bash
PA_TARGET_USER=pi PA_FRONTEND_PORT=8080 sudo bash setup.sh install
```

## Local Installation

Clone the repository and run the setup script:

```bash
# Clone the repository
git clone https://github.com/LAYEREDwork/previous-admin.git
cd previous-admin

# Run the setup script (requires root)
sudo ./setup.sh install
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
