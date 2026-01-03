#!/bin/bash

# Previous Admin - Complete Installation Script
# Usage: curl -fsSL https://raw.githubusercontent.com/LAYEREDwork/previous-admin/main/install.sh | sudo bash
# Or locally: sudo bash install.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[38;5;208m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/LAYEREDwork/previous-admin"
TARGET_USER="next"
INSTALL_DIR="/home/$TARGET_USER/previous-admin"
MDNS_HOSTNAME="next.local"
FRONTEND_PORT="2342"
BACKEND_PORT="3001"

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
        echo "Please run: sudo bash $0"
        exit 1
    fi
    print_success "Running as root"
}

# Check for required tools
check_tools() {
    print_info "Checking required tools..."
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    print_success "git found"

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo "Please install Node.js 20+ first:"
        echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
        echo "  Fedora: https://nodejs.org/en/download/package-manager"
        exit 1
    fi
    print_success "Node.js found ($(node --version))"

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm found ($(npm --version))"

    echo ""
}

# Create or check target user
setup_user() {
    print_info "Setting up user account..."
    
    if ! id "$TARGET_USER" &>/dev/null; then
        print_info "Creating user '$TARGET_USER'..."
        useradd -m -s /bin/bash "$TARGET_USER"
        print_success "User '$TARGET_USER' created"
    else
        print_success "User '$TARGET_USER' exists"
    fi

    echo ""
}

# Clone or update repository
setup_repository() {
    print_info "Setting up repository..."
    
    if [ -d "$INSTALL_DIR" ]; then
        print_info "Updating existing installation..."
        cd "$INSTALL_DIR"
        sudo -u "$TARGET_USER" git pull origin main
        print_success "Repository updated"
    else
        print_info "Cloning repository..."
        mkdir -p "$(dirname "$INSTALL_DIR")"
        git clone "$REPO_URL" "$INSTALL_DIR"
        chown -R "$TARGET_USER:$TARGET_USER" "$INSTALL_DIR"
        print_success "Repository cloned"
    fi

    echo ""
}

# Install system dependencies
install_dependencies() {
    print_info "Installing system dependencies..."
    
    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        print_error "Cannot detect operating system"
        exit 1
    fi

    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        print_info "Ubuntu/Debian detected, installing packages..."
        apt-get update -qq
        apt-get install -y avahi-daemon avahi-utils curl wget
        print_success "System dependencies installed"
    elif [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ] || [ "$OS" = "centos" ]; then
        print_info "Fedora/RHEL detected, installing packages..."
        dnf install -y avahi avahi-tools curl wget
        print_success "System dependencies installed"
    else
        print_warning "Unknown OS: $OS - skipping system package installation"
    fi

    echo ""
}

# Install npm dependencies
install_npm() {
    print_info "Installing npm dependencies (this may take a few minutes)..."
    
    cd "$INSTALL_DIR"
    sudo -u "$TARGET_USER" npm install --prefer-offline
    PACKAGE_COUNT=$(sudo -u "$TARGET_USER" npm ls --depth=0 2>/dev/null | grep -c '├\|└' || echo "0")
    print_success "npm dependencies installed ($PACKAGE_COUNT packages)"

    echo ""
}

# Build application
build_app() {
    print_info "Building application..."
    
    cd "$INSTALL_DIR"
    sudo -u "$TARGET_USER" npm run build
    print_success "Application built"

    echo ""
}

# Create config directory
setup_config() {
    print_info "Creating config directory..."
    
    sudo -u "$TARGET_USER" mkdir -p /home/$TARGET_USER/.config/previous
    print_success "Config directory created"

    echo ""
}

# Setup systemd services
setup_systemd() {
    print_info "Setting up systemd services..."
    
    # Copy service files
    cp "$INSTALL_DIR/systemd/previous-admin-backend.service" /etc/systemd/system/
    cp "$INSTALL_DIR/systemd/previous-admin-frontend.service" /etc/systemd/system/
    print_success "Service files installed"

    echo ""
}

# Setup Avahi mDNS
setup_avahi() {
    print_info "Setting up Avahi mDNS..."
    
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
    print_success "Avahi service file created"

    # Create wrapper script for avahi-publish
    mkdir -p /usr/local/bin
    cat > /usr/local/bin/avahi-alias-next.sh << 'SCRIPT'
#!/bin/bash
# Wait for network to be ready
sleep 5
# Get the primary IP address
IP_ADDR=$(hostname -I | awk '{print $1}')
if [ -n "$IP_ADDR" ]; then
    exec /usr/bin/avahi-publish -a -R next.local "$IP_ADDR"
else
    echo "Could not determine IP address"
    exit 1
fi
SCRIPT
    chmod +x /usr/local/bin/avahi-alias-next.sh
    print_success "Avahi wrapper script created"

    # Create systemd service for avahi-publish alias
    cat > /etc/systemd/system/avahi-alias-next.service << EOF
[Unit]
Description=Avahi alias $MDNS_HOSTNAME for Previous Admin
After=network-online.target avahi-daemon.service
Wants=network-online.target
Requires=avahi-daemon.service

[Service]
Type=simple
ExecStart=/usr/local/bin/avahi-alias-next.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    print_success "Avahi systemd service created"

    echo ""
}

# Enable and start services
start_services() {
    print_info "Starting services..."
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable services
    systemctl enable avahi-daemon.service 2>/dev/null || true
    systemctl enable avahi-alias-next.service
    systemctl enable previous-admin-backend.service
    systemctl enable previous-admin-frontend.service
    print_success "Services enabled"

    # Start services
    systemctl restart avahi-daemon.service
    systemctl restart avahi-alias-next.service 2>/dev/null || systemctl start avahi-alias-next.service
    systemctl restart previous-admin-backend.service 2>/dev/null || systemctl start previous-admin-backend.service
    sleep 2
    systemctl restart previous-admin-frontend.service 2>/dev/null || systemctl start previous-admin-frontend.service
    print_success "Services started"

    echo ""
}

# Get service status
show_status() {
    print_header "Installation Complete!"
    echo ""
    print_info "Service Status:"
    echo ""
    systemctl status previous-admin-backend.service --no-pager | head -5
    echo ""
    systemctl status previous-admin-frontend.service --no-pager | head -5
    echo ""
}

# Show access information
show_access_info() {
    print_header "Access Previous Admin"
    
    # Get IP address
    IP_ADDR=$(hostname -I | awk '{print $1}')
    
    echo ""
    print_info "Open in your browser:"
    echo ""
    echo "  • Local network:  http://$MDNS_HOSTNAME:$FRONTEND_PORT"
    echo "  • Direct IP:      http://$IP_ADDR:$FRONTEND_PORT"
    echo ""
    
    echo "Useful commands:"
    echo ""
    echo "  View backend logs:"
    echo "    sudo journalctl -u previous-admin-backend.service -f"
    echo ""
    echo "  View frontend logs:"
    echo "    sudo journalctl -u previous-admin-frontend.service -f"
    echo ""
    echo "  Restart backend:"
    echo "    sudo systemctl restart previous-admin-backend.service"
    echo ""
    echo "  Restart frontend:"
    echo "    sudo systemctl restart previous-admin-frontend.service"
    echo ""
    echo "  Stop services:"
    echo "    sudo systemctl stop previous-admin-backend.service"
    echo "    sudo systemctl stop previous-admin-frontend.service"
    echo ""
}

# Main installation flow
main() {
    print_header "Previous Admin - Complete Installation"
    
    check_root
    check_tools
    setup_user
    setup_repository
    install_dependencies
    install_npm
    build_app
    setup_config
    setup_systemd
    setup_avahi
    start_services
    show_status
    show_access_info
}

# Run main function
main "$@"

