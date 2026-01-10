# Installation Guide

## Quick Installation

The fastest way to install Previous Admin on a **Linux system** (Ubuntu/Debian/Fedora/Raspberry Pi):

Download and run the setup script:

```bash
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

After installation, you can use the `padmin` command:

```bash
sudo padmin install
sudo padmin update
sudo padmin status
sudo padmin uninstall
sudo padmin help
```

- `sudo padmin install`: Install Previous Admin
- `sudo padmin update`: Update to the latest version
- `sudo padmin status`: Show service status
- `sudo padmin uninstall`: Remove Previous Admin
- `sudo padmin help`: Show help

Note: The `install` command (and the bootstrap `setup.sh` when run via curl) performs a fully automated, non-interactive installation — it installs Node.js, system packages, builds the frontend and backend (or downloads a prebuilt bundle), and configures user services. The installer no longer requires a privileged updater wrapper; updates are performed by replacing the bundled artifact atomically.

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

Clone the repository:

```bash
git clone https://github.com/LAYEREDwork/previous-admin.git
cd previous-admin
```

Run the setup script (requires root):

```bash
sudo ./setup.sh install
```

The setup script will automatically:
- Install Node.js 22+ and required system dependencies
- Create dedicated system user (default: `next`)
- Build the application for production
- Install and configure user-space systemd services
- Set up Avahi/Bonjour for network discovery
 - Create the `padmin` CLI command
- Start all services and display access information

## Uninstallation

```bash
sudo padmin uninstall
# or
sudo scripts/uninstall.sh
```

The uninstall process will:
- Stop and disable all systemd services
- Optionally backup your database
- Remove installation directory
- Remove configuration and database files
- Remove the `padmin` CLI command
- Clean up all system integration (Avahi, systemd)

Additionally, the uninstaller will remove legacy privileged wrapper files and sudoers snippets if they exist (older installations):

- `/usr/local/bin/padmin-updater` (legacy)
- `/etc/sudoers.d/padmin-updater` (legacy)
- `/etc/sudoers.d/previous-admin` (legacy)
- `/opt/previous-admin` (copied runtime install used by older updaters)

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
