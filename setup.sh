#!/bin/bash

# Previous Admin - Setup Script
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/setup.sh | sudo bash -s -- install
#   Or locally: sudo bash setup.sh install
# After installation: sudo previous_admin status

set -e

# Trap for clean exit on CTRL+C
cleanup() {
    tput cnorm 2>/dev/null || true  # Show cursor
    echo ""
    echo "Installation aborted."
    exit 1
}
trap cleanup INT TERM

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

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

# Spinner characters
SPINNER_CHARS='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

# ============================================================================
# Helper Functions
# ============================================================================

print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_info() { echo -e "${BLUE}→${NC} $1"; }

print_header() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Draw progress bar
# Usage: draw_progress_bar current total
draw_progress_bar() {
    local current=$1
    local total=$2
    local width=30
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))

    # [ in white
    printf "["
    # Arrow in green: ===>
    if [ $filled -gt 0 ]; then
        if [ $filled -eq 1 ]; then
            printf "${GREEN}>${NC}"
        else
            printf "${GREEN}%$((filled-1))s>${NC}" | tr ' ' '='
        fi
    fi
    # Remaining dashes in gray
    if [ $empty -gt 0 ]; then
        printf "${DIM}%${empty}s${NC}" | tr ' ' '-'
    fi
    # ] in white + percentage
    printf "] %3d%%" "$percentage"
}

# Run installation step with progress update and spinner
# Usage: run_step step_num total_steps "Description" command [args...]
run_step() {
    local step_num=$1
    local total_steps=$2
    local description="$3"
    shift 3
    local cmd="$@"

    local exit_code=0
    local output=""
    local tmpfile=$(mktemp)

    # Hide cursor
    tput civis 2>/dev/null || true

    # Run command in background, save output to temp file
    eval "$cmd" > "$tmpfile" 2>&1 &
    local cmd_pid=$!

    # Spinner loop while command runs
    local i=0
    local len=${#SPINNER_CHARS}
    while kill -0 $cmd_pid 2>/dev/null; do
        local char="${SPINNER_CHARS:$i:1}"
        # Line 1: Spinner + description
        printf "\r\033[K${CYAN}%s${NC} %s" "$char" "$description"
        # Line 2: Progress bar
        printf "\n\033[K"
        draw_progress_bar "$step_num" "$total_steps"
        # Move cursor back to start of line 1
        printf "\033[A\r"
        i=$(( (i + 1) % len ))
        sleep 0.08
    done

    # Get exit code
    wait $cmd_pid
    exit_code=$?
    output=$(cat "$tmpfile")
    rm -f "$tmpfile"

    # Show cursor
    tput cnorm 2>/dev/null || true

    # Clear both lines and print final result
    printf "\r\033[K"  # Clear line 1
    printf "\n\033[K"  # Clear line 2
    printf "\033[A\r"  # Back to line 1

    if [ $exit_code -eq 0 ]; then
        printf "${GREEN}✓${NC} %s\n" "$description"
        return 0
    else
        printf "${RED}✗${NC} %s\n" "$description"
        if [ -n "$output" ]; then
            echo -e "  ${DIM}${output}${NC}" | head -3
        fi
        echo ""
        print_error "Installation failed at: $description"
        exit 1
    fi
}

# Run a command with spinner (standalone, for uninstall etc.)
# Usage: run_with_spinner "Description" command [args...]
run_with_spinner() {
    local description="$1"
    shift
    local cmd="$@"

    # Hide cursor
    tput civis 2>/dev/null || true

    # Start spinner in background
    local spin_pid
    (
        local i=0
        local len=${#SPINNER_CHARS}
        while true; do
            local char="${SPINNER_CHARS:$i:1}"
            printf "\r  ${CYAN}%s${NC}  %s " "$char" "$description"
            i=$(( (i + 1) % len ))
            sleep 0.1
        done
    ) &
    spin_pid=$!

    # Run the actual command, capture output and exit code
    local output
    local exit_code=0
    output=$(eval "$cmd" 2>&1) || exit_code=$?

    # Kill spinner
    kill $spin_pid 2>/dev/null || true
    wait $spin_pid 2>/dev/null || true

    # Show cursor
    tput cnorm 2>/dev/null || true

    # Print result
    if [ $exit_code -eq 0 ]; then
        printf "\r  ${GREEN}✓${NC}  %s\n" "$description"
        return 0
    else
        printf "\r  ${RED}✗${NC}  %s\n" "$description"
        if [ -n "$output" ]; then
            echo -e "      ${DIM}${output}${NC}" | head -3
        fi
        return 1
    fi
}

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

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root"
        echo "Please run: sudo bash $0 $*"
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
# Installation Functions (silent - output suppressed)
# ============================================================================

do_check_tools() {
    detect_os
    if ! command -v git &> /dev/null; then
        if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
            apt-get update -qq >/dev/null 2>&1
            apt-get install -y git >/dev/null 2>&1
        elif [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
            dnf install -y git >/dev/null 2>&1
        fi
    fi
    if ! command -v node &> /dev/null; then
        if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
            curl -fsSL https://deb.nodesource.com/setup_22.x 2>/dev/null | bash - >/dev/null 2>&1
            apt-get install -y nodejs >/dev/null 2>&1
        elif [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
            dnf install -y nodejs >/dev/null 2>&1
        fi
    fi
    command -v npm &> /dev/null
}

do_setup_user() {
    if ! id "$TARGET_USER" &>/dev/null; then
        useradd -m -s /bin/bash "$TARGET_USER" >/dev/null 2>&1
    fi
}

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

do_sync_versions() {
    cd "$INSTALL_DIR"
    if [ -f "scripts/install-version-sync.sh" ]; then
        sudo -u "$TARGET_USER" bash scripts/install-version-sync.sh >/dev/null 2>&1 || true
    fi
}

do_install_dependencies() {
    detect_os
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        apt-get update -qq >/dev/null 2>&1
        if [ "$INSTALL_AVAHI" = "true" ]; then
            apt-get install -y avahi-daemon avahi-utils curl wget jq >/dev/null 2>&1
        else
            apt-get install -y curl wget jq >/dev/null 2>&1
        fi
    elif [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
        if [ "$INSTALL_AVAHI" = "true" ]; then
            dnf install -y avahi avahi-tools curl wget jq >/dev/null 2>&1
        else
            dnf install -y curl wget jq >/dev/null 2>&1
        fi
    fi
}

do_install_npm() {
    cd "$INSTALL_DIR"
    sudo -u "$TARGET_USER" npm install --prefer-offline >/dev/null 2>&1
}

do_build_app() {
    cd "$INSTALL_DIR"
    sudo -u "$TARGET_USER" npm run build >/dev/null 2>&1
}

do_setup_config() {
    sudo -u "$TARGET_USER" mkdir -p "/home/$TARGET_USER/.config/previous" 2>/dev/null
    sudo -u "$TARGET_USER" mkdir -p "/home/$TARGET_USER/.previous-admin" 2>/dev/null
}

do_setup_systemd() {
    TARGET_UID=$(id -u "$TARGET_USER")
    USER_SYSTEMD_DIR="/home/$TARGET_USER/.config/systemd/user"
    sudo -u "$TARGET_USER" mkdir -p "$USER_SYSTEMD_DIR"

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

do_enable_lingering() {
    loginctl enable-linger "$TARGET_USER" >/dev/null 2>&1 || true
}

do_setup_avahi() {
    if [ "$INSTALL_AVAHI" != "true" ]; then
        return 0
    fi

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

do_start_services() {
    TARGET_UID=$(id -u "$TARGET_USER")
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user daemon-reload >/dev/null 2>&1
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user enable previous-admin-backend.service >/dev/null 2>&1
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user enable previous-admin-frontend.service >/dev/null 2>&1
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user start previous-admin-backend.service >/dev/null 2>&1
    sleep 2
    sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user start previous-admin-frontend.service >/dev/null 2>&1

    if [ "$INSTALL_AVAHI" = "true" ]; then
        systemctl daemon-reload >/dev/null 2>&1
        systemctl enable avahi-daemon.service >/dev/null 2>&1 || true
        systemctl enable avahi-alias-previous-admin.service >/dev/null 2>&1 || true
        systemctl restart avahi-daemon.service >/dev/null 2>&1 || true
        systemctl restart avahi-alias-previous-admin.service >/dev/null 2>&1 || systemctl start avahi-alias-previous-admin.service >/dev/null 2>&1 || true
    fi
}

do_create_cli_command() {
    mkdir -p /usr/local/bin
    ln -sf "$INSTALL_DIR/setup.sh" /usr/local/bin/previous_admin
    chmod +x "$INSTALL_DIR/setup.sh"
}

# ============================================================================
# Main Commands
# ============================================================================

run_install() {
    print_header "Installing Previous Admin"

    echo -e "${DIM}Configuration:${NC}"
    echo -e "  User:          ${CYAN}$TARGET_USER${NC}"
    echo -e "  Frontend Port: ${CYAN}$FRONTEND_PORT${NC}"
    echo -e "  Backend Port:  ${CYAN}$BACKEND_PORT${NC}"
    echo -e "  Avahi/mDNS:    ${CYAN}$INSTALL_AVAHI${NC}"
    if [ "$INSTALL_AVAHI" = "true" ]; then
        echo -e "  Hostname:      ${CYAN}${MDNS_HOSTNAME}.local${NC}"
    echo ""
    echo -e "${YELLOW}⚠ This installation will definitely take a few minutes. Please be patient...${NC}"
    echo ""

    local TOTAL=12

    run_step 1 $TOTAL "Checking dependencies" do_check_tools
    run_step 2 $TOTAL "Setting up user account" do_setup_user
    run_step 3 $TOTAL "Cloning repository" do_setup_repository
    run_step 4 $TOTAL "Syncing versions" do_sync_versions
    run_step 5 $TOTAL "Installing system dependencies" do_install_dependencies
    run_step 6 $TOTAL "Installing npm packages" do_install_npm
    run_step 7 $TOTAL "Building application" do_build_app
    run_step 8 $TOTAL "Setting up configuration" do_setup_config
    run_step 9 $TOTAL "Setting up systemd services" do_setup_systemd
    run_step 10 $TOTAL "Enabling user lingering" do_enable_lingering
    run_step 11 $TOTAL "Setting up Avahi/mDNS" do_setup_avahi
    run_step 12 $TOTAL "Starting services" do_start_services

    do_create_cli_command

    # Show completion message
    IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")

    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  Installation Complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Access Previous Admin at:"
    if [ "$INSTALL_AVAHI" = "true" ]; then
        echo -e "  ${CYAN}http://${MDNS_HOSTNAME}.local:${FRONTEND_PORT}${NC}"
    fi
    echo -e "  ${CYAN}http://${IP_ADDR}:${FRONTEND_PORT}${NC}"
    echo ""
    echo -e "CLI Command: ${DIM}sudo previous_admin${NC}"
    echo ""
}

run_update() {
    print_header "Updating Previous Admin"

    if [ ! -d "$INSTALL_DIR" ]; then
        print_error "Previous Admin is not installed."
        echo "Please run: sudo bash $0 install"
        exit 1
    fi

    export PA_TARGET_USER="$TARGET_USER"

    if [ -f "$INSTALL_DIR/scripts/update.sh" ]; then
        bash "$INSTALL_DIR/scripts/update.sh"
    else
        print_error "Update script not found."
        exit 1
    fi
}

run_uninstall() {
    print_header "Uninstalling Previous Admin"

    if [ ! -d "$INSTALL_DIR" ]; then
        print_error "Previous Admin is not installed."
        exit 1
    fi

    echo -e "${YELLOW}WARNING: This will completely remove Previous Admin!${NC}"
    echo ""
    read -p "Are you sure? (y/N) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi

    read -p "Do you want to backup the database first? (Y/n) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        BACKUP_DIR="/tmp/previous-admin-backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        cp -r "/home/$TARGET_USER/.previous-admin" "$BACKUP_DIR/" 2>/dev/null || true
        print_success "Database backed up to: $BACKUP_DIR"
    fi

    export PA_TARGET_USER="$TARGET_USER"

    echo ""
    run_with_spinner "Stopping services" "bash '$INSTALL_DIR/scripts/uninstall.sh' 2>/dev/null || true"
    run_with_spinner "Removing CLI command" "rm -f /usr/local/bin/previous_admin"

    echo ""
    print_success "Previous Admin has been removed."
}

show_status() {
    print_header "Previous Admin Status"

    if [ ! -d "$INSTALL_DIR" ]; then
        print_error "Previous Admin is not installed."
        exit 1
    fi

    TARGET_UID=$(id -u "$TARGET_USER" 2>/dev/null || echo "0")

    BACKEND_STATUS=$(sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user is-active previous-admin-backend.service 2>/dev/null || echo "inactive")
    FRONTEND_STATUS=$(sudo -u "$TARGET_USER" XDG_RUNTIME_DIR="/run/user/$TARGET_UID" systemctl --user is-active previous-admin-frontend.service 2>/dev/null || echo "inactive")

    if [ "$INSTALL_AVAHI" = "true" ]; then
        AVAHI_STATUS=$(systemctl is-active avahi-alias-previous-admin.service 2>/dev/null || echo "inactive")
    else
        AVAHI_STATUS="not installed"
    fi

    IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")

    echo "Services:"
    if [ "$BACKEND_STATUS" = "active" ]; then
        echo -e "  Backend:   ${GREEN}●${NC} $BACKEND_STATUS"
    else
        echo -e "  Backend:   ${RED}●${NC} $BACKEND_STATUS"
    fi

    if [ "$FRONTEND_STATUS" = "active" ]; then
        echo -e "  Frontend:  ${GREEN}●${NC} $FRONTEND_STATUS"
    else
        echo -e "  Frontend:  ${RED}●${NC} $FRONTEND_STATUS"
    fi

    if [ "$AVAHI_STATUS" = "active" ]; then
        echo -e "  Avahi:     ${GREEN}●${NC} $AVAHI_STATUS"
    elif [ "$AVAHI_STATUS" = "not installed" ]; then
        echo -e "  Avahi:     ${YELLOW}●${NC} $AVAHI_STATUS"
    else
        echo -e "  Avahi:     ${RED}●${NC} $AVAHI_STATUS"
    fi

    echo ""
    echo "Access URLs:"
    if [ "$INSTALL_AVAHI" = "true" ] && [ "$AVAHI_STATUS" = "active" ]; then
        echo "  http://${MDNS_HOSTNAME}.local:${FRONTEND_PORT}"
    fi
    echo "  http://${IP_ADDR}:${FRONTEND_PORT}"
    echo ""
}

show_help() {
    echo "Previous Admin Setup Script"
    echo ""
    echo -e "Usage: ${CYAN}sudo bash $0 <command>${NC}"
    echo ""
    echo "Commands:"
    echo -e "  ${CYAN}install${NC}     Install Previous Admin"
    echo -e "  ${CYAN}update${NC}      Update to latest version"
    echo -e "  ${CYAN}uninstall${NC}   Remove Previous Admin"
    echo -e "  ${CYAN}status${NC}      Show service status"
    echo -e "  ${CYAN}help${NC}        Show this help message"
    echo ""
    echo "Environment Variables:"
    echo -e "  ${DIM}PA_TARGET_USER${NC}      Target user (default: next)"
    echo -e "  ${DIM}PA_FRONTEND_PORT${NC}    Frontend port (default: 2342)"
    echo -e "  ${DIM}PA_BACKEND_PORT${NC}     Backend port (default: 3001)"
    echo -e "  ${DIM}PA_MDNS_HOSTNAME${NC}    mDNS hostname (default: next)"
    echo -e "  ${DIM}PA_INSTALL_AVAHI${NC}    Install Avahi (default: true)"
    echo ""
    echo "Examples:"
    echo -e "  ${DIM}sudo bash setup.sh install${NC}"
    echo -e "  ${DIM}PA_TARGET_USER=pi sudo bash setup.sh install${NC}"
    echo ""
}

# ============================================================================
# Main Entry Point
# ============================================================================

main() {
    check_linux
    check_root

    case "${1:-help}" in
        install)
            run_install
            ;;
        update)
            run_update
            ;;
        uninstall)
            run_uninstall
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
