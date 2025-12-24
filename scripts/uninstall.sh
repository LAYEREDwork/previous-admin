#!/bin/bash

set -e

echo "=========================================="
echo "Previous Emulator Admin - Uninstall Script"
echo "=========================================="
echo ""

if [ "$EEID" -ne 0 ]; then
    echo "This script must be run as root (use sudo)"
    exit 1
fi

TARGET_USER="next"
INSTALL_DIR="/home/$TARGET_USER/previous-admin"

echo "⚠️  WARNING: This will completely remove Previous Admin from your system."
echo ""
read -p "Do you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Uninstallation cancelled."
    exit 0
fi

echo ""
read -p "Do you want to create a database backup before uninstalling? (yes/no): " CREATE_BACKUP

if [ "$CREATE_BACKUP" = "yes" ]; then
    echo "💾 Creating database backup..."
    
    # Check if backend service is running, if not, start it
    if ! systemctl is-active --quiet previous-admin-backend.service; then
        echo "🔄 Backend service not running. Starting it for backup..."
        systemctl start previous-admin-backend.service
        echo "⏳ Waiting for service to be ready..."
        sleep 3
    fi
    
    BACKUP_DIR="/home/$TARGET_USER"
    BACKUP_FILE="$BACKUP_DIR/previous-admin-backup-$(date +%Y%m%d-%H%M%S).json"
    
    # Create backup via API
    HTTP_CODE=$(curl -s -o "$BACKUP_FILE" -w "%{http_code}" http://localhost:3001/api/database/export 2>/dev/null)
    
    if [ "$HTTP_CODE" = "200" ] && [ -f "$BACKUP_FILE" ]; then
        chown $TARGET_USER:$TARGET_USER "$BACKUP_FILE"
        echo "✅ Database backup created: $BACKUP_FILE"
    else
        rm -f "$BACKUP_FILE"
        echo "❌ Failed to create backup via API (HTTP $HTTP_CODE)"
        echo "⚠️  Backup failed. Do you want to continue with uninstallation? (yes/no): "
        read CONTINUE_WITHOUT_BACKUP
        if [ "$CONTINUE_WITHOUT_BACKUP" != "yes" ]; then
            echo "❌ Uninstallation cancelled."
            exit 1
        fi
    fi
fi

echo ""
echo "🛑 Stopping services..."
systemctl stop previous-admin-frontend.service 2>/dev/null || true
systemctl stop previous-admin-backend.service 2>/dev/null || true

echo ""
echo "❌ Disabling services..."
systemctl disable previous-admin-frontend.service 2>/dev/null || true
systemctl disable previous-admin-backend.service 2>/dev/null || true

echo ""
echo "🗑️  Removing systemd service files..."
rm -f /etc/systemd/system/previous-admin-frontend.service
rm -f /etc/systemd/system/previous-admin-backend.service

echo ""
echo "🔄 Reloading systemd..."
systemctl daemon-reload

echo ""
echo "📁 Removing installation directory..."
if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
    echo "✅ Installation directory removed: $INSTALL_DIR"
else
    echo "ℹ️  Installation directory not found: $INSTALL_DIR"
fi

echo ""
read -p "Do you want to remove the Previous emulator config directory (~/.config/previous)? (yes/no): " REMOVE_CONFIG

if [ "$REMOVE_CONFIG" = "yes" ]; then
    if [ -d "/home/$TARGET_USER/.config/previous" ]; then
        rm -rf "/home/$TARGET_USER/.config/previous"
        echo "✅ Previous emulator config directory removed."
    fi
fi

echo ""
read -p "Do you want to remove user '$TARGET_USER'? (yes/no): " REMOVE_USER

if [ "$REMOVE_USER" = "yes" ]; then
    if id "$TARGET_USER" &>/dev/null; then
        userdel -r $TARGET_USER 2>/dev/null || userdel $TARGET_USER
        echo "✅ User '$TARGET_USER' removed."
    fi
fi

echo ""
read -p "Do you want to uninstall Node.js? (yes/no): " REMOVE_NODEJS

if [ "$REMOVE_NODEJS" = "yes" ]; then
    if command -v node &> /dev/null; then
        echo "📦 Uninstalling Node.js..."
        apt-get remove -y nodejs 2>/dev/null || yum remove -y nodejs 2>/dev/null || brew uninstall node 2>/dev/null || echo "⚠️  Could not remove Node.js automatically. Please remove it manually."
        apt-get autoremove -y 2>/dev/null || yum autoremove -y 2>/dev/null || true
    else
        echo "ℹ️  Node.js is not installed."
    fi
fi

echo ""
echo "=========================================="
echo "✅ Uninstallation Complete!"
echo "=========================================="
echo ""
echo "🎉 Previous Admin has been removed from your system."
echo ""
