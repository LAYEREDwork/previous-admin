# Copilot Instructions for `previous-admin`

## Architekturüberblick

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, RSuite UI. Einstiegspunkt: [src/App.tsx](src/App.tsx). Komponenten, Kontexte und Seiten sind in `src/components/`, `src/contexts/` und `src/pages/` organisiert.
- **Backend**: Node.js + Express (TypeScript). Einstiegspunkt: [server/index.ts](server/index.ts). API-Routen unter `/api/*`, WebSocket-Support, Session-Handling mit express-session.
- **Datenbank**: SQLite, synchron über `better-sqlite3`. Datenbankdatei liegt im Home-Verzeichnis des Users unter `.previous-admin/previous-admin.db`. Schema-Initialisierung in [server/database/core.ts](server/database/core.ts).
- **Konfigurationsmanagement**: CRUD für Emulator-Konfigurationen, Sortierung, Aktivierung, Import/Export. Siehe [server/database/configurations.ts](server/database/configurations.ts) und API-Client [src/lib/database.ts](src/lib/database.ts).
- **Authentifizierung**: Eigener Admin-User, Setup-Flow beim ersten Start. Authentifizierung via Session-Cookie, siehe [server/api/auth.ts](server/api/auth.ts).

## Entwickler-Workflows

- **Entwicklung starten**:
  - Backend: `npm run backend` (startet Express-Server auf Port 3001)
  - Frontend: `npm run dev` (startet Vite-Dev-Server auf Port 5173)
- **Build für Produktion**: `npm run build` (Frontend), dann `npm run backend` (Backend)
- **Automatisierte Installation**: `sudo ./setup.sh` installiert Abhängigkeiten, richtet systemd-Services ein und startet alles.
- **API-Base-URL**: Im Frontend dynamisch: `http://${window.location.hostname}:3001`
- **Session-Secret**: In Produktion MUSS `SESSION_SECRET` als Umgebungsvariable gesetzt werden.

## Projekt-spezifische Konventionen

- **Sprache**: Interne Kommunikation und UI-Strings sind mehrsprachig, Standard ist Deutsch. Übersetzungen liegen in [src/lib/translations/](src/lib/translations/).
- **Benennung**: Keine einbuchstabigen Variablen/Parameter. Immer sprechende Namen verwenden.
- **Code-Kommentare**: Alle nicht-trivialen Logikabschnitte und alle Funktionen/Klassen sind zu dokumentieren (siehe `.github/instructions/instructions.instructions.md`).
- **Keine stillen Codeänderungen**: Änderungen nur auf explizite Anweisung.
- **UI-Status**: Aktiver Tab wird in `localStorage` gespeichert (`currentTab`).

## API- und Datenfluss

- **Frontend <-> Backend**: Kommunikation ausschließlich über REST-API (`/api/*`). Authentifizierung via Session-Cookie.
- **Konfigurationsobjekte**: Siehe Typ `PreviousConfig` in [src/lib/types.ts](src/lib/types.ts) und [server/types.ts](server/types.ts).
- **Konfigurationsänderungen**: Reihenfolgeänderungen werden explizit per API (`/api/configurations/order/update`) übertragen.
- **Import/Export**: Einzelne Konfigurationen und komplette Datenbank können importiert/exportiert werden (JSON).

## Integration & Besonderheiten

- **WebSocket**: Für Live-Systemmetriken (`server/websocket.ts`).
- **Systemdienste**: systemd-Units für Backend und Frontend (`systemd/`).
- **Avahi/Bonjour**: Netzwerk-Discovery via `next.local:2342` nach Setup.
- **Sicherheit**: Keine Standardpasswörter, Setup erzwingt initiale User-Anlage.

## Beispiele & Referenzen

- **Backend-API-Client**: [src/lib/api.ts](src/lib/api.ts)
- **Konfigurations-CRUD**: [src/lib/database.ts](src/lib/database.ts), [server/database/configurations.ts](server/database/configurations.ts)
- **Session-Handling**: [server/index.ts](server/index.ts), [server/api/auth.ts](server/api/auth.ts)

---

Bitte gib Feedback, falls bestimmte Workflows, Konventionen oder Integrationspunkte noch nicht ausreichend beschrieben sind!
