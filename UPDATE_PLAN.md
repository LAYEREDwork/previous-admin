# Update-Mechanismus Refactoring-Plan

## Übersicht
Dieser Plan beschreibt die Integration des neuen Update-Mechanismus in das bestehende System von Previous Admin. Der Fokus liegt auf GitHub als Single Source of Truth (SSoT) für Versionen, automatischer Synchronisation von `package.json`, und einem robusten Update-Prozess via Shell-Script.

## Aktuelle Implementierung (Analyse)
- **Datei**: `backend/api/update.ts`
  - POST `/api/update`: Lädt ZIP, extrahiert, rsync, restartet App.
  - GET `/api/update/version`: Holt Releases von GitHub API (https://github.com/LAYEREDwork/previous-admin), vergleicht mit git tag oder package.json.
- **Probleme**:
  - Version aus git describe (nicht GitHub als SSoT).
  - Kein separates Shell-Script; alles in TS.
  - Kein `~/.previous-admin/version.json`.
  - `package.json` wird nicht automatisch synchronisiert.
- **Install.sh**: Erstellt keine Version-Datei; setzt Version nicht von GitHub.

## Neuer Ansatz
- **SSoT**: GitHub Releases/Tags.
- **Version-Tracking**: `~/.previous-admin/version.json` (für Vergleiche).
- **package.json Sync**: Automatisch mit GitHub-Version aktualisieren.
- **Update-Prozess**: Shell-Script (`scripts/update.sh`) für Download/Install/Neustart.
- **API**: Vereinfacht, ruft Script auf.

## Schritte zur Integration

### 1. Neue Dateien erstellen
- **scripts/update.sh**: Shell-Script für Update-Prozess (Download von GitHub Releases, Extraktion, Installation, Neustart).
- **scripts/install_version_sync.sh**: Hilfs-Script für Version-Sync (von GitHub holen und in package.json/version.json setzen).

### 2. Bestehende Dateien ändern
- **backend/api/update.ts**:
  - Entferne ZIP-Download-Logik.
  - Bestätige GitHub-only für API (https://github.com/LAYEREDwork/previous-admin).
  - Version-Vergleich: Nutze `~/.previous-admin/version.json` statt git describe.
  - POST `/api/update`: Rufe `scripts/update.sh` auf statt inline-Logik.
  - Entferne rsync- und ZIP-Handling; delegiere an Script.
- **install.sh**:
  - Füge Version-Sync hinzu: Rufe `scripts/install_version_sync.sh` auf, um package.json und version.json zu setzen.
- **package.json**: Wird automatisch aktualisiert; keine manuellen Änderungen.

### 3. Refactoring und Entfernung
- **Entferne**: Alte ZIP/rsync-Logik in `update.ts`.
- **Refactor**: `update.ts` zu reinem API-Proxy (Version-Check) und Script-Aufruf.
- **Bestätige**: Alles auf GitHub (https://github.com/LAYEREDwork/previous-admin).
- **Testen**: Stelle sicher, dass systemd-Services korrekt neu starten.

### 4. Abhängigkeiten und Sicherheit
- Installiere `jq` auf Pi (für JSON-Manipulation).
- HTTPS für alle Downloads.
- Backup-Mechanismus in Script.

### 5. Frontend-Integration (unverändert)
- Bleibt wie geplant; nutzt API für Checks und Trigger.

## Risiken und Rollback
- **Backup**: Script erstellt Backups in `~/.previous-admin/backup/`.
- **Rollback**: Bei Fehler: Stelle aus Backup wieder her.
- **Testing**: Unit-Tests für API; Integrationstests auf Pi.

## Zeitplan
1. Scripts erstellen (1-2 Tage).
2. API refactoren (1 Tag).
3. install.sh anpassen (0.5 Tage).
4. Testen und deployen (1-2 Tage).

Dieser Plan stellt sicher, dass der neue Mechanismus nahtlos integriert wird, ohne das System zu brechen.</content>
<parameter name="filePath">/Users/phranck/Sites/previous-admin/UPDATE_PLAN.md