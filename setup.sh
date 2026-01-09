#!/bin/bash

# Previous Admin - Setup Script with TUI
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/setup.sh -o /tmp/pa-setup.sh
#   sudo bash /tmp/pa-setup.sh
# Or locally: sudo bash setup.sh
# After installation: sudo previous_admin

set -e

# Trap for clean exit on CTRL+C
cleanup() {
    # Reset terminal in case whiptail left it in a bad state
    stty sane 2>/dev/null || true
    clear 2>/dev/null || true
    echo "Installation aborted."
    exit 1
}
trap cleanup INT TERM

# ============================================================================
# Handle piped execution (curl ... | bash)
# whiptail requires direct terminal access, so we show instructions instead
# ============================================================================

if [ ! -t 0 ]; then
    # stdin is not a terminal (script is being piped)
    # whiptail TUI cannot work without direct terminal access
    echo ""
    echo "=========================================="
    echo "  Previous Admin Setup"
    echo "=========================================="
    echo ""
    echo "The interactive TUI requires direct terminal access."
    echo "Please run these commands instead:"
    echo ""
    echo "  curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/setup.sh -o /tmp/pa-setup.sh"
    echo "  sudo bash /tmp/pa-setup.sh"
    echo ""
    echo "Or for direct installation without TUI:"
    echo ""
    echo "  curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/setup.sh -o /tmp/pa-setup.sh"
    echo "  sudo bash /tmp/pa-setup.sh install"
    echo ""
    exit 0
fi

# ============================================================================
# Configuration (can be overridden via environment variables)
# ============================================================================

REPO_URL="https://github.com/LAYEREDwork/previous-admin"
TARGET_USER="${PA_TARGET_USER:-next}"
FRONTEND_PORT="${PA_FRONTEND_PORT:-2342}"
BACKEND_PORT="${PA_BACKEND_PORT:-3001}"
MDNS_HOSTNAME="${PA_MDNS_HOSTNAME:-next}"
INSTALL_AVAHI="${PA_INSTALL_AVAHI:-true}"
INSTALL_DIR="/home/$TARGET_USER/previous-admin"

# TUI dimensions
TUI_WIDTH=70
TUI_HEIGHT=20
TUI_MENU_HEIGHT=10

# Colors for non-TUI output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[38;5;208m'
NC='\033[0m'

# ============================================================================
# Helper Functions
# ============================================================================

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${ORANGE}ℹ $1${NC}"; }

# Check if running on Linux
check_linux() {
    if [[ "$(uname)" != "Linux" ]]; then
        print_error "This script is designed for Linux (Raspberry Pi)."
        echo "Detected OS: $(uname)"
        echo ""
        echo "For development/testing on macOS, use:"
        echo "  npm run dev      # Frontend"
        echo "  npm run backend  # Backend"
        exit 1
    fi
}

# Check if whiptail is available, install if needed
check_whiptail() {
    if ! command -v whiptail &> /dev/null; then
        echo "Installing whiptail..."
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            if [ "$ID" = "ubuntu" ] || [ "$ID" = "debian" ]; then
                apt-get update -qq && apt-get install -y whiptail
            elif [ "$ID" = "fedora" ] || [ "$ID" = "rhel" ] || [ "$ID" = "centos" ]; then
                dnf install -y newt
            fi
        fi
        # Verify installation succeeded
        if ! command -v whiptail &> /dev/null; then
            print_error "Failed to install whiptail. Please install it manually."
            exit 1
        fi
    fi
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo "This script must be run as root"
        echo "Please run: sudo bash $0"
        exit 1
    fi
}

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        OS="unknown"
    fi
}

# ============================================================================
# TUI Menu Functions
# ============================================================================

# Main menu
show_main_menu() {
    while true; do
        CHOICE=$(whiptail --title "Previous Admin Setup" \
            --menu "Choose an option:" $TUI_HEIGHT $TUI_WIDTH $TUI_MENU_HEIGHT \
            "1" "Install      - Complete installation" \
            "2" "Update       - Update to latest version" \
            "3" "Uninstall    - Remove Previous Admin" \
            "4" "Configure    - Change settings" \
            "5" "Status       - Show service status" \
            3>&1 1>&2 2>&3)

        EXIT_STATUS=$?
        if [ $EXIT_STATUS -ne 0 ]; then
            # User pressed Cancel or Escape
            exit 0
        fi

        case $CHOICE in
            1) run_install_tui ;;
            2) run_update_tui ;;
            3) run_uninstall_tui ;;
            4) show_configure_menu ;;
            5) show_status_tui ;;
        esac
    done
}

# Configure submenu
show_configure_menu() {
    while true; do
        CHOICE=$(whiptail --title "Configuration" \
            --menu "Choose an option:" $TUI_HEIGHT $TUI_WIDTH $TUI_MENU_HEIGHT \
            "1" "Ports        - Configure ports ($FRONTEND_PORT/$BACKEND_PORT)" \
            "2" "Avahi/mDNS   - Configure network discovery" \
            "3" "User         - Target user ($TARGET_USER)" \
            "4" "Show Config  - Display current settings" \
            3>&1 1>&2 2>&3)

        EXIT_STATUS=$?
        if [ $EXIT_STATUS -ne 0 ]; then
            # User pressed Cancel - return to main menu
            return
        fi

        case $CHOICE in
            1) configure_ports ;;
            2) configure_avahi ;;
            3) configure_user ;;
            4) show_current_config ;;
        esac
    done
}

# Configure ports
configure_ports() {
    NEW_FRONTEND=$(whiptail --title "Frontend Port" \
        --inputbox "Enter the frontend port (Web Interface):" 8 $TUI_WIDTH "$FRONTEND_PORT" \
        3>&1 1>&2 2>&3)

    if [ $? -eq 0 ] && [ -n "$NEW_FRONTEND" ]; then
        FRONTEND_PORT="$NEW_FRONTEND"
    fi

    NEW_BACKEND=$(whiptail --title "Backend Port" \
        --inputbox "Enter the backend port (API):" 8 $TUI_WIDTH "$BACKEND_PORT" \
        3>&1 1>&2 2>&3)

    if [ $? -eq 0 ] && [ -n "$NEW_BACKEND" ]; then
        BACKEND_PORT="$NEW_BACKEND"
    fi

    whiptail --title "Ports Configured" \
        --msgbox "Ports set to:\n\nFrontend: $FRONTEND_PORT\nBackend: $BACKEND_PORT" 10 $TUI_WIDTH
}

# Configure Avahi/mDNS
configure_avahi() {
    # Check if Avahi is already installed and running
    if command -v avahi-daemon &> /dev/null && systemctl is-active --quiet avahi-daemon 2>/dev/null; then
        CURRENT_HOST=$(hostname)
        whiptail --title "Avahi Status" \
            --msgbox "Avahi is already installed and running.\n\nYour device is reachable at:\n\n  http://${CURRENT_HOST}.local:${FRONTEND_PORT}\n\nTo change the hostname, edit /etc/hostname and reboot." 14 $TUI_WIDTH
    else
        if whiptail --title "Avahi/mDNS" \
            --yesno "Avahi enables network discovery via .local hostnames.\n\nDo you want to install and configure Avahi?" 10 $TUI_WIDTH; then

            INSTALL_AVAHI="true"

            NEW_HOSTNAME=$(whiptail --title "mDNS Hostname" \
                --inputbox "Enter the hostname (without .local):\n\nYour device will be reachable at <hostname>.local" 12 $TUI_WIDTH "$MDNS_HOSTNAME" \
                3>&1 1>&2 2>&3)

            if [ $? -eq 0 ] && [ -n "$NEW_HOSTNAME" ]; then
                MDNS_HOSTNAME="$NEW_HOSTNAME"
            fi

            whiptail --title "Avahi Configured" \
                --msgbox "Avahi will be installed.\n\nHostname: ${MDNS_HOSTNAME}.local" 10 $TUI_WIDTH
        else
            INSTALL_AVAHI="false"
            whiptail --title "Avahi Skipped" \
                --msgbox "Avahi will not be installed.\n\nYou can access Previous Admin via IP address." 10 $TUI_WIDTH
        fi
    fi
}

# Configure target user
configure_user() {
    NEW_USER=$(whiptail --title "Target User" \
        --inputbox "Enter the Linux user for the installation:\n\n(User will be created if it doesn't exist)" 12 $TUI_WIDTH "$TARGET_USER" \
        3>&1 1>&2 2>&3)

    if [ $? -eq 0 ] && [ -n "$NEW_USER" ]; then
        TARGET_USER="$NEW_USER"
        INSTALL_DIR="/home/$TARGET_USER/previous-admin"
        whiptail --title "User Configured" \
            --msgbox "Target user set to: $TARGET_USER\n\nInstallation directory:\n$INSTALL_DIR" 12 $TUI_WIDTH
    fi
}

# Show current configuration
show_current_config() {
    whiptail --title "Current Configuration" \
        --msgbox "Target User:     $TARGET_USER\nInstall Dir:     $INSTALL_DIR\n\nFrontend Port:   $FRONTEND_PORT\nBackend Port:    $BACKEND_PORT\n\nAvahi:           $INSTALL_AVAHI\nmDNS Hostname:   ${MDNS_HOSTNAME}.local" 16 $TUI_WIDTH
}

# ============================================================================
# Installation Functions
# ============================================================================

# Check and install required tools
do_check_tools() {
    detect_os

    # Check and install git
    if ! command -v git &> /dev/null; then
        if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
            apt-get update -qq >/dev/null 2>&1
            apt-get install -y git >/dev/null 2>&1
        elif [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
            dnf install -y git >/dev/null 2>&1
        fi
    fi

    # Check and install Node.js
    if ! command -v node &> /dev/null; then
        if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
            curl -fsSL https://deb.nodesource.com/setup_22.x 2>/dev/null | bash - >/dev/null 2>&1
            apt-get install -y nodejs >/dev/null 2>&1
        elif [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
            dnf install -y nodejs >/dev/null 2>&1
        fi
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        return 1
    fi
    return 0
}

# Setup user account
do_setup_user() {
    if ! id "$TARGET_USER" &>/dev/null; then
        useradd -m -s /bin/bash "$TARGET_USER"
    fi
}

# Clone or update repository
do_setup_repository() {
    if [ -d "$INSTALL_DIR" ]; then
        cd "$INSTALL_DIR"
        sudo -u "$TARGET_USER" git pull origin main >/dev/null 2>&1 || true
    else
        mkdir -p "$(dirname "$INSTALL_DIR")"
        git clone --quiet "$REPO_URL" "$INSTALL_DIR" >/dev/null 2>&1
        chown -R "$TARGET_USER:$TARGET_USER" "$INSTALL_DIR"
    fi
}

# Sync versions
do_sync_versions() {
    cd "$INSTALL_DIR"
    if [ -f "scripts/install-version-sync.sh" ]; then
        sudo -u "$TARGET_USER" bash scripts/install-version-sync.sh >/dev/null 2>&1 || true
    fi
}

# Install system dependencies
do_install_dependencies() {
    detect_os
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        apt-get update -qq >/dev/null 2>&1
        if [ "$INSTALL_AVAHI" = "true" ]; then
            apt-get install -y avahi-daemon avahi-utils curl wget whiptail >/dev/null 2>&1
        else
            apt-get install -y curl wget whiptail >/dev/null 2>&1
        fi
    elif [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
        if [ "$INSTALL_AVAHI" = "true" ]; then
            dnf install -y avahi avahi-tools curl wget newt >/dev/null 2>&1
        else
            dnf install -y curl wget newt >/dev/null 2>&1
        fi
    fi
}

# Install npm dependencies
do_install_npm() {
    cd "$INSTALL_DIR"
    sudo -u "$TARGET_USER" npm install --prefer-offline >/dev/null 2>&1
}

# Build application
do_build_app() {
    cd "$INSTALL_DIR"
    sudo -u "$TARGET_USER" npm run build >/dev/null 2>&1
}

# Setup config directory
do_setup_config() {
    sudo -u "$TARGET_USER" mkdir -p "/home/$TARGET_USER/.config/previous"
    sudo -u "$TARGET_USER" mkdir -p "/home/$TARGET_USER/.previous-admin"
}

# Setup systemd services
do_setup_systemd() {
    TARGET_UID=$(id -u "$TARGET_USER")
    USER_SYSTEMD_DIR="/home/$TARGET_USER/.config/systemd/user"
    sudo -u "$TARGET_USER" mkdir -p "$USER_SYSTEMD_DIR"

    # Backend service
    sudo -u "$TARGET_USER" tee "$USER_SYSTEMD_DIR/previous-admin-backend.service" > /dev/null << EOF
[Unit]
Description=Previous Admin Backend API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/npm run backend
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=previous-admin-backend
Environment=NODE_ENV=production
Environment=XDG_RUNTIME_DIR=/run/user/$TARGET_UID

[Install]
WantedBy=default.target
EOF

    # Frontend service
    sudo -u "$TARGET_USER" tee "$USER_SYSTEMD_DIR/previous-admin-frontend.service" > /dev/null << EOF
[Unit]
Description=Previous Admin Frontend
After=network-online.target previous-admin-backend.service
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port $FRONTEND_PORT
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=previous-admin-frontend
Environment=XDG_RUNTIME_DIR=/run/user/$TARGET_UID

[Install]
WantedBy=default.target
EOF
}

# Enable lingering
do_enable_lingering() {
    loginctl enable-linger "$TARGET_USER" >/dev/null 2>&1 || true
}

# Setup Avahi
do_setup_avahi() {
    if [ "$INSTALL_AVAHI" != "true" ]; then
        return 0
    fi

    # Create Avahi service file
    mkdir -p /etc/avahi/services
    cat > /etc/avahi/services/previous-admin.service << EOF
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
  <name>Previous Admin</name>
  <service>
    <type>_http._tcp</type>
    <port>$FRONTEND_PORT</port>
    <txt-record>path=/</txt-record>
  </service>
</service-group>
EOF

    # Create wrapper script
    mkdir -p /usr/local/bin
    cat > /usr/local/bin/avahi-alias-previous-admin.sh << SCRIPT
#!/bin/bash
sleep 5
IP_ADDR=\$(hostname -I | awk '{print \$1}')
if [ -n "\$IP_ADDR" ]; then
    exec /usr/bin/avahi-publish -a -R ${MDNS_HOSTNAME}.local "\$IP_ADDR"
else
    echo "Could not determine IP address"
    exit 1
fi
SCRIPT
    chmod +x /usr/local/bin/avahi-alias-previous-admin.sh

    # Create systemd service
    cat > /etc/systemd/system/avahi-alias-previous-admin.service << EOF
[Unit]
Description=Avahi alias ${MDNS_HOSTNAME}.local for Previous Admin
After=network-online.target avahi-daemon.service
Wants=network-online.target
Requires=avahi-daemon.service

[Service]
Type=simple
ExecStart=/usr/local/bin/avahi-alias-previous-admin.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
}

# Start services
do_start_services() {
    TARGET_UID=$(id -u "$TARGET_USER")

    # User services
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user daemon-reload >/dev/null 2>&1
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user enable previous-admin-backend.service >/dev/null 2>&1
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user enable previous-admin-frontend.service >/dev/null 2>&1
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user start previous-admin-backend.service >/dev/null 2>&1
    sleep 2
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user start previous-admin-frontend.service >/dev/null 2>&1

    # Avahi services
    if [ "$INSTALL_AVAHI" = "true" ]; then
        systemctl daemon-reload >/dev/null 2>&1
        systemctl enable avahi-daemon.service >/dev/null 2>&1 || true
        systemctl enable avahi-alias-previous-admin.service >/dev/null 2>&1 || true
        systemctl restart avahi-daemon.service >/dev/null 2>&1 || true
        systemctl restart avahi-alias-previous-admin.service >/dev/null 2>&1 || systemctl start avahi-alias-previous-admin.service >/dev/null 2>&1 || true
    fi
}

# Create CLI command symlink
do_create_cli_command() {
    mkdir -p /usr/local/bin
    ln -sf "$INSTALL_DIR/setup.sh" /usr/local/bin/previous_admin
    chmod +x "$INSTALL_DIR/setup.sh"
}

# ============================================================================
# TUI Installation with Progress Bar
# ============================================================================

run_install_tui() {
    # Confirm installation
    if ! whiptail --title "Install Previous Admin" \
        --yesno "This will install Previous Admin with the following settings:\n\nUser: $TARGET_USER\nFrontend Port: $FRONTEND_PORT\nBackend Port: $BACKEND_PORT\nAvahi: $INSTALL_AVAHI\nHostname: ${MDNS_HOSTNAME}.local\n\nContinue?" 16 $TUI_WIDTH; then
        return
    fi

    # Run installation with progress bar
    {
        echo 5
        echo "XXX"
        echo "Checking dependencies..."
        echo "XXX"
        do_check_tools

        echo 10
        echo "XXX"
        echo "Setting up user account..."
        echo "XXX"
        do_setup_user

        echo 20
        echo "XXX"
        echo "Cloning repository..."
        echo "XXX"
        do_setup_repository

        echo 25
        echo "XXX"
        echo "Syncing versions..."
        echo "XXX"
        do_sync_versions

        echo 30
        echo "XXX"
        echo "Installing system dependencies..."
        echo "XXX"
        do_install_dependencies

        echo 40
        echo "XXX"
        echo "Installing npm packages (this may take a while)..."
        echo "XXX"
        do_install_npm

        echo 60
        echo "XXX"
        echo "Building application..."
        echo "XXX"
        do_build_app

        echo 70
        echo "XXX"
        echo "Setting up configuration..."
        echo "XXX"
        do_setup_config

        echo 75
        echo "XXX"
        echo "Setting up systemd services..."
        echo "XXX"
        do_setup_systemd

        echo 80
        echo "XXX"
        echo "Enabling user lingering..."
        echo "XXX"
        do_enable_lingering

        echo 85
        echo "XXX"
        echo "Setting up Avahi/mDNS..."
        echo "XXX"
        do_setup_avahi

        echo 90
        echo "XXX"
        echo "Starting services..."
        echo "XXX"
        do_start_services

        echo 95
        echo "XXX"
        echo "Creating CLI command..."
        echo "XXX"
        do_create_cli_command

        echo 100
        echo "XXX"
        echo "Installation complete!"
        echo "XXX"
    } | whiptail --title "Installing Previous Admin" --gauge "Starting installation..." 8 $TUI_WIDTH 0

    # Show completion message
    IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")

    ACCESS_INFO="Installation completed successfully!\n\n"
    ACCESS_INFO+="Access Previous Admin at:\n\n"
    if [ "$INSTALL_AVAHI" = "true" ]; then
        ACCESS_INFO+="  http://${MDNS_HOSTNAME}.local:${FRONTEND_PORT}\n"
    fi
    ACCESS_INFO+="  http://${IP_ADDR}:${FRONTEND_PORT}\n\n"
    ACCESS_INFO+="CLI Command:\n  sudo previous_admin"

    whiptail --title "Installation Complete" --msgbox "$ACCESS_INFO" 18 $TUI_WIDTH
}

# ============================================================================
# Update Function
# ============================================================================

run_update_tui() {
    if [ ! -d "$INSTALL_DIR" ]; then
        whiptail --title "Error" --msgbox "Previous Admin is not installed.\n\nPlease run Install first." 10 $TUI_WIDTH
        return
    fi

    if ! whiptail --title "Update Previous Admin" \
        --yesno "This will update Previous Admin to the latest version.\n\nContinue?" 10 $TUI_WIDTH; then
        return
    fi

    # Export config for update script
    export PA_TARGET_USER="$TARGET_USER"
    export PA_FRONTEND_PORT="$FRONTEND_PORT"
    export PA_BACKEND_PORT="$BACKEND_PORT"

    {
        echo 20
        echo "XXX"
        echo "Running update script..."
        echo "XXX"
        if [ -f "$INSTALL_DIR/scripts/update.sh" ]; then
            bash "$INSTALL_DIR/scripts/update.sh" >/dev/null 2>&1 || true
        fi
        echo 100
        echo "XXX"
        echo "Update complete!"
        echo "XXX"
    } | whiptail --title "Updating Previous Admin" --gauge "Starting update..." 8 $TUI_WIDTH 0

    whiptail --title "Update Complete" --msgbox "Previous Admin has been updated." 8 $TUI_WIDTH
}

# ============================================================================
# Uninstall Function
# ============================================================================

run_uninstall_tui() {
    if [ ! -d "$INSTALL_DIR" ]; then
        whiptail --title "Error" --msgbox "Previous Admin is not installed." 8 $TUI_WIDTH
        return
    fi

    if ! whiptail --title "Uninstall Previous Admin" \
        --yesno "This will completely remove Previous Admin.\n\nAll configuration and data will be deleted!\n\nAre you sure?" 12 $TUI_WIDTH; then
        return
    fi

    # Backup database?
    if whiptail --title "Backup" \
        --yesno "Do you want to backup the database before uninstalling?" 8 $TUI_WIDTH; then
        BACKUP_DIR="/tmp/previous-admin-backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        cp -r "/home/$TARGET_USER/.previous-admin" "$BACKUP_DIR/" 2>/dev/null || true
        whiptail --title "Backup Created" --msgbox "Database backed up to:\n\n$BACKUP_DIR" 10 $TUI_WIDTH
    fi

    # Export config for uninstall script
    export PA_TARGET_USER="$TARGET_USER"

    {
        echo 30
        echo "XXX"
        echo "Running uninstall script..."
        echo "XXX"
        if [ -f "$INSTALL_DIR/scripts/uninstall.sh" ]; then
            bash "$INSTALL_DIR/scripts/uninstall.sh" >/dev/null 2>&1 || true
        fi

        echo 80
        echo "XXX"
        echo "Removing CLI command..."
        echo "XXX"
        rm -f /usr/local/bin/previous_admin

        echo 100
        echo "XXX"
        echo "Uninstall complete!"
        echo "XXX"
    } | whiptail --title "Uninstalling Previous Admin" --gauge "Starting uninstall..." 8 $TUI_WIDTH 0

    whiptail --title "Uninstall Complete" --msgbox "Previous Admin has been removed." 8 $TUI_WIDTH
}

# ============================================================================
# Status Function
# ============================================================================

show_status_tui() {
    if [ ! -d "$INSTALL_DIR" ]; then
        whiptail --title "Status" --msgbox "Previous Admin is not installed." 8 $TUI_WIDTH
        return
    fi

    TARGET_UID=$(id -u "$TARGET_USER" 2>/dev/null || echo "0")

    # Get service status
    BACKEND_STATUS=$(sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user is-active previous-admin-backend.service 2>/dev/null || echo "inactive")
    FRONTEND_STATUS=$(sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user is-active previous-admin-frontend.service 2>/dev/null || echo "inactive")

    if [ "$INSTALL_AVAHI" = "true" ]; then
        AVAHI_STATUS=$(systemctl is-active avahi-alias-previous-admin.service 2>/dev/null || echo "inactive")
    else
        AVAHI_STATUS="not installed"
    fi

    IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")

    STATUS_MSG="Service Status:\n\n"
    STATUS_MSG+="Backend:   $BACKEND_STATUS\n"
    STATUS_MSG+="Frontend:  $FRONTEND_STATUS\n"
    STATUS_MSG+="Avahi:     $AVAHI_STATUS\n\n"
    STATUS_MSG+="Access URLs:\n\n"
    if [ "$INSTALL_AVAHI" = "true" ] && [ "$AVAHI_STATUS" = "active" ]; then
        STATUS_MSG+="  http://${MDNS_HOSTNAME}.local:${FRONTEND_PORT}\n"
    fi
    STATUS_MSG+="  http://${IP_ADDR}:${FRONTEND_PORT}"

    whiptail --title "Previous Admin Status" --msgbox "$STATUS_MSG" 18 $TUI_WIDTH
}

# ============================================================================
# CLI Mode (non-TUI)
# ============================================================================

run_install_cli() {
    print_info "Installing Previous Admin..."
    check_root

    do_check_tools && print_success "Dependencies checked" || { print_error "Failed to check dependencies"; exit 1; }
    do_setup_user && print_success "User setup complete"
    do_setup_repository && print_success "Repository cloned"
    do_sync_versions && print_success "Versions synced"
    do_install_dependencies && print_success "System dependencies installed"
    do_install_npm && print_success "npm packages installed"
    do_build_app && print_success "Application built"
    do_setup_config && print_success "Configuration created"
    do_setup_systemd && print_success "Systemd services configured"
    do_enable_lingering && print_success "Lingering enabled"
    do_setup_avahi && print_success "Avahi configured"
    do_start_services && print_success "Services started"
    do_create_cli_command && print_success "CLI command created"

    print_success "Installation complete!"
    IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")
    echo ""
    print_info "Access Previous Admin at:"
    if [ "$INSTALL_AVAHI" = "true" ]; then
        echo "  http://${MDNS_HOSTNAME}.local:${FRONTEND_PORT}"
    fi
    echo "  http://${IP_ADDR}:${FRONTEND_PORT}"
}

show_status_cli() {
    if [ ! -d "$INSTALL_DIR" ]; then
        print_error "Previous Admin is not installed."
        exit 1
    fi

    TARGET_UID=$(id -u "$TARGET_USER" 2>/dev/null || echo "0")

    print_info "Service Status:"
    echo ""
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user status previous-admin-backend.service --no-pager | head -5
    echo ""
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user status previous-admin-frontend.service --no-pager | head -5
}

# ============================================================================
# Main Entry Point
# ============================================================================

main() {
    check_linux
    check_root
    check_whiptail

    # Handle CLI arguments
    case "${1:-}" in
        install)
            run_install_cli
            ;;
        update)
            export PA_TARGET_USER="$TARGET_USER"
            if [ -f "$INSTALL_DIR/scripts/update.sh" ]; then
                bash "$INSTALL_DIR/scripts/update.sh"
            else
                print_error "Update script not found. Is Previous Admin installed?"
                exit 1
            fi
            ;;
        uninstall)
            export PA_TARGET_USER="$TARGET_USER"
            if [ -f "$INSTALL_DIR/scripts/uninstall.sh" ]; then
                bash "$INSTALL_DIR/scripts/uninstall.sh"
                rm -f /usr/local/bin/previous_admin
            else
                print_error "Uninstall script not found."
                exit 1
            fi
            ;;
        status)
            show_status_cli
            ;;
        *)
            # No argument - show TUI menu
            show_main_menu
            ;;
    esac
}

# Run main function
main "$@"
