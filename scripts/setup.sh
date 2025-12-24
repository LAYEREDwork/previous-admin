#!/bin/bash

set -e

echo "=========================================="
echo "Previous Emulator Admin - Setup Script"
echo "=========================================="
echo ""

if [ "$EUID" -ne 0 ]; then
    echo "This script must be run as root (use sudo)"
    exit 1
fi

TARGET_USER="next"
INSTALL_DIR="/home/$TARGET_USER/previous-admin"
PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)

# Network configuration
MDNS_HOSTNAME="next.local"
FRONTEND_PORT="2342"

echo "Checking if user '$TARGET_USER' exists..."
if ! id "$TARGET_USER" &>/dev/null; then
    echo "User '$TARGET_USER' does not exist. Creating..."
    useradd -m -s /bin/bash $TARGET_USER
    echo "User '$TARGET_USER' created."
else
    echo "User '$TARGET_USER' exists."
fi

echo ""
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js 18+ first."
    echo "Run: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "Then: sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

echo ""
echo "Installing Avahi for Bonjour/mDNS support..."
apt-get update -qq
apt-get install -y avahi-daemon avahi-utils

echo ""
echo "Creating installation directory..."
if [ "$PROJECT_DIR" != "$INSTALL_DIR" ]; then
    mkdir -p "$INSTALL_DIR"
    echo "Copying files to $INSTALL_DIR..."
    cp -r "$PROJECT_DIR"/* "$INSTALL_DIR/"
    chown -R $TARGET_USER:$TARGET_USER "$INSTALL_DIR"
fi

echo ""
echo "Creating Previous emulator config directory..."
su - $TARGET_USER -c "mkdir -p ~/.config/previous"

echo ""
echo "Installing npm dependencies..."
cd "$INSTALL_DIR"
su - $TARGET_USER -c "cd $INSTALL_DIR && npm install"

echo ""
echo "Building application..."
su - $TARGET_USER -c "cd $INSTALL_DIR && npm run build"

echo ""
echo "Installing systemd services..."
cp "$INSTALL_DIR/systemd/previous-admin-backend.service" /etc/systemd/system/
cp "$INSTALL_DIR/systemd/previous-admin-frontend.service" /etc/systemd/system/

echo ""
echo "Setting up Bonjour/mDNS alias ($MDNS_HOSTNAME)..."

# Create Avahi service file for Previous Admin
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

# Create wrapper script for avahi-publish (needed for IP detection at runtime)
cat > /usr/local/bin/avahi-alias-next.sh << EOF
#!/bin/bash
# Wait for network to be ready
sleep 5
# Get the primary IP address
IP_ADDR=\$(hostname -I | awk '{print \$1}')
if [ -n "\$IP_ADDR" ]; then
    exec /usr/bin/avahi-publish -a -R $MDNS_HOSTNAME "\$IP_ADDR"
else
    echo "Could not determine IP address"
    exit 1
fi
EOF
chmod +x /usr/local/bin/avahi-alias-next.sh

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

echo ""
echo "Reloading systemd..."
systemctl daemon-reload

echo ""
echo "Enabling services..."
systemctl enable avahi-daemon.service
systemctl enable avahi-alias-next.service
systemctl enable previous-admin-backend.service
systemctl enable previous-admin-frontend.service

echo ""
echo "Starting services..."
systemctl restart avahi-daemon.service
systemctl start avahi-alias-next.service
systemctl start previous-admin-backend.service
sleep 2
systemctl start previous-admin-frontend.service

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Services Status:"
systemctl status previous-admin-backend.service --no-pager -l
echo ""
systemctl status previous-admin-frontend.service --no-pager -l
echo ""
echo "Access the admin interface at:"
echo "  http://$MDNS_HOSTNAME:$FRONTEND_PORT"
echo "  http://$(hostname -I | awk '{print $1}'):$FRONTEND_PORT"
echo ""
echo "To view logs:"
echo "  sudo journalctl -u previous-admin-backend.service -f"
echo "  sudo journalctl -u previous-admin-frontend.service -f"
echo ""
echo "To restart services:"
echo "  sudo systemctl restart previous-admin-backend.service"
echo "  sudo systemctl restart previous-admin-frontend.service"
echo ""
