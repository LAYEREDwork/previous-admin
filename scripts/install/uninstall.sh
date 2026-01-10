#!/bin/bash

# Previous Admin - Uninstallation Script
# Cleanly removes all Previous Admin components from the system
# Can be run from anywhere: home directory, project root, or scripts directory

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[38;5;208m'
NC='\033[0m' # No Color

# Configuration (can be overridden via environment variables)
TARGET_USER="${PA_TARGET_USER:-next}"
INSTALL_DIR="/home/$TARGET_USER/previous-admin"
CONFIG_DIR="/home/$TARGET_USER/.config/previous"
DB_DIR="/home/$TARGET_USER/.previous-admin"

# Helper functions
print_header() {
    echo -e "${ORANGE}========================================${NC}"
    echo -e "${ORANGE}$1${NC}"
    echo -e "${ORANGE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${ORANGE}ℹ $1${NC}"
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root"
        echo "Please run: sudo bash scripts/uninstall.sh"
        exit 1
    fi
    print_success "Running as root"
}

# Stop services
stop_services() {
    print_info "Stopping services..."

    # Stop user-space services
    TARGET_UID=$(id -u "$TARGET_USER" 2>/dev/null || echo "")
    if [ -n "$TARGET_UID" ]; then
        sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user stop previous-admin-backend.service 2>/dev/null || true
        sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user stop previous-admin-frontend.service 2>/dev/null || true
    fi

    # Stop system-wide Avahi service
    systemctl stop avahi-alias-previous-admin.service 2>/dev/null || true
    print_success "Services stopped"

    echo ""
}

# Disable services
disable_services() {
    print_info "Disabling services..."

    # Disable user-space services
    TARGET_UID=$(id -u "$TARGET_USER" 2>/dev/null || echo "")
    if [ -n "$TARGET_UID" ]; then
        sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user disable previous-admin-backend.service 2>/dev/null || true
        sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user disable previous-admin-frontend.service 2>/dev/null || true
    fi

    # Disable system-wide Avahi service
    systemctl disable avahi-alias-previous-admin.service 2>/dev/null || true

    # Disable lingering for user
    loginctl disable-linger "$TARGET_USER" 2>/dev/null || true
    print_success "Services and lingering disabled"

    echo ""
}

# Remove service files
remove_service_files() {
    print_info "Removing service files..."

    # Remove user-space service files
    rm -f "/home/$TARGET_USER/.config/systemd/user/previous-admin-"*.service

    # Reload user systemd daemon
    TARGET_UID=$(id -u "$TARGET_USER" 2>/dev/null || echo "")
    if [ -n "$TARGET_UID" ]; then
        sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user daemon-reload 2>/dev/null || true
    fi

    # Remove system-wide Avahi files
    rm -f /etc/systemd/system/avahi-alias-previous-admin.service
    rm -f /usr/local/bin/avahi-alias-previous-admin.sh
    rm -f /etc/avahi/services/previous-admin.service
    # No privileged updater wrapper in bundled install mode; remove legacy sudoers if present
    rm -f /etc/sudoers.d/padmin-updater 2>/dev/null || true
    rm -f /etc/sudoers.d/previous-admin 2>/dev/null || true

    systemctl daemon-reload
    print_success "Service files removed"

    echo ""
}

# Backup database
backup_database() {
    if [ -d "$DB_DIR" ]; then
        read -p "Do you want to backup the database before deletion? (Y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            BACKUP_DIR="/tmp/previous-admin-backup-$(date +%Y%m%d-%H%M%S)"
            mkdir -p "$BACKUP_DIR"
            cp -r "$DB_DIR" "$BACKUP_DIR/"
            print_success "Database backed up to: $BACKUP_DIR"
            echo ""
        fi
    fi
}

# Remove installation directory
remove_installation() {
    print_info "Removing installation directory..."
    
    if [ -d "$INSTALL_DIR" ]; then
        rm -rf "$INSTALL_DIR"
        print_success "Installation directory removed"
    else
        print_warning "Installation directory not found"
    fi
    # Also remove copy in /opt if present
    if [ -d "/opt/previous-admin" ]; then
        rm -rf "/opt/previous-admin"
        print_success "/opt/previous-admin removed"
    fi
    
    echo ""
}

# Remove config directory
remove_config() {
    print_info "Removing configuration directory..."

    if [ -d "$CONFIG_DIR" ]; then
        rm -rf "$CONFIG_DIR"
        print_success "Configuration directory removed"
    fi

    if [ -d "$DB_DIR" ]; then
        rm -rf "$DB_DIR"
        print_success "Database directory removed"
    fi

    echo ""
}

# Remove CLI command symlink
remove_cli_command() {
    print_info "Removing CLI command..."

    if [ -L "/usr/local/bin/padmin" ] || [ -f "/usr/local/bin/padmin" ]; then
        rm -f /usr/local/bin/padmin
        print_success "CLI command 'padmin' removed"
    fi

    # Legacy privileged wrapper not used for bundled installs; remove if present
    if [ -f "/usr/local/bin/padmin-updater" ]; then
        rm -f /usr/local/bin/padmin-updater
        print_success "Legacy updater wrapper removed"
    fi

    echo ""
}


# Summary
show_summary() {
    print_header "Uninstallation Complete"

    echo "Previous Admin has been uninstalled."
    echo ""
    echo "The following were removed:"
    echo "  • Systemd services"
    echo "  • Service files"
    echo "  • Installation directory ($INSTALL_DIR) and /opt/previous-admin"
    echo "  • Configuration directory ($CONFIG_DIR)"
    echo "  • Database directory ($DB_DIR)"
    echo "  • CLI command (/usr/local/bin/padmin)"
    echo "  • (legacy) Updater wrapper and sudoers snippet removed if present"
    echo ""
}

# Return to home directory
return_to_home() {
    # Check if we're in the installation directory and change to home
    if [[ "$PWD" == "$INSTALL_DIR"* ]]; then
        cd ~
        print_info "Changed working directory to home ($HOME)"
    fi
    echo ""
}

# Main uninstallation flow
main() {
    print_header "Previous Admin - Uninstallation"
    
    check_root
    backup_database
    stop_services
    disable_services
    remove_service_files
    remove_installation
    remove_config
    remove_cli_command
    show_summary
    return_to_home
}

# Run main function
main "$@"
