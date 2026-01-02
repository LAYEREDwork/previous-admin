#!/bin/bash

# Script zum Identifizieren aller verbleibenden Auth/User-Referenzen
# Nach Ausführung von: Auth-Dateien löschen, Session-Code entfernen, etc.

echo "========================================="
echo "  Auth/User Referenz Scanner"
echo "========================================="
echo ""

echo "Suche nach 'requireAuth' Referenzen:"
grep -rn "requireAuth" backend/api/ --include="*.ts" 2>/dev/null || echo "  ✓ Keine gefunden"
echo ""

echo "Suche nach 'userId' Referenzen in Backend:"
grep -rn "userId" backend/ --include="*.ts" | grep -v "node_modules" | head -20
echo ""

echo "Suche nach 'session' Referenzen:"
grep -rn "session" backend/ --include="*.ts" | grep -v "node_modules" | grep -v "SessionOptions" | head -15
echo ""

echo "Suche nach 'User' Type Referenzen:"
grep -rn "User," backend/types.ts 2>/dev/null || echo "  (types.ts prüfen)"
echo ""

echo "Suche nach Auth-Context im Frontend:"
grep -rn "AuthContext\|useAuth" frontend/ --include="*.tsx" --include="*.ts" 2>/dev/null | head -10
echo ""

echo "========================================="
echo "Verbleibende Dateien zu ändern:"
echo "========================================="
echo "Backend:"
echo "  - backend/database/configurations.ts"
echo "  - backend/database/core.ts"
echo "  - backend/api/configurations.ts"
echo "  - backend/api/system.ts"
echo "  - backend/types.ts"
echo "  - backend/__tests__/configurationService.test.ts"
echo ""
echo "Frontend:"
echo "  - frontend/App.tsx"
echo ""
