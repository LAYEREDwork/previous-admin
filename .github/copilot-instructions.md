# Copilot Instructions for `previous-admin`

## Allgemeine Richtlinien
- Never use a single character for variable names, parameters, or any identifiers; use descriptive names instead.
- Always add comments in code to explain non-trivial parts.
- Always format code using proper indentation and spacing for better readability.
- Always add documentation comments for all functions and classes in the code.
- Never change code by yourself without my explicit request.
-  Always communicate in German when discussing internal logic or UI strings.

## Architekturüberblick

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, RSuite UI. Einstiegspunkt: [frontend/App.tsx](frontend/App.tsx). Komponenten, Kontexte und Seiten sind in `frontend/components/`, `frontend/contexts/` und `frontend/pages/` organisiert.
- **Backend**: Node.js + Express (TypeScript). Einstiegspunkt: [backend/index.ts](backend/index.ts). API-Routen unter `/api/*`, WebSocket-Support, Session-Handling mit express-session.
- **Datenbank**: SQLite, synchron über `better-sqlite3`. Datenbankdatei liegt im Home-Verzeichnis des Users unter `.previous-admin/previous-admin.db`. Schema-Initialisierung in [backend/database/core.ts](backend/database/core.ts).
- **Konfigurationsmanagement**: CRUD für Emulator-Konfigurationen, Sortierung, Aktivierung, Import/Export. Siehe [backend/database/configurations.ts](backend/database/configurations.ts) und API-Client [frontend/lib/database.ts](frontend/lib/database.ts).
- **Authentifizierung**: Eigener Admin-User, Setup-Flow beim ersten Start. Authentifizierung via Session-Cookie, siehe [backend/api/auth.ts](backend/api/auth.ts).

## Entwickler-Workflows

- **Entwicklung starten**:
  - Backend: `npm run backend` (startet Express-Server auf Port 3001)
  - Frontend: `npm run dev` (startet Vite-Dev-Server auf Port 5173)
- **Build für Produktion**: `npm run build` (Frontend), dann `npm run backend` (Backend)
- **Automatisierte Installation**: `sudo ./setup.sh` installiert Abhängigkeiten, richtet systemd-Services ein und startet alles.
- **API-Base-URL**: Im Frontend dynamisch: `http://${window.location.hostname}:3001`
- **Session-Secret**: In Produktion MUSS `SESSION_SECRET` als Umgebungsvariable gesetzt werden.

## Projekt-spezifische Codier-Richtlinien

- **Sprache**: Interne Kommunikation und UI-Strings sind mehrsprachig, Standard ist Deutsch. Übersetzungen liegen in [frontend/lib/translations/](frontend/lib/translations/).
- **Benennung**: Keine einbuchstabigen Variablen/Parameter. Immer sprechende Namen verwenden.
- **Code-Kommentare**: Alle nicht-trivialen Logikabschnitte und alle Funktionen/Klassen sind zu dokumentieren (siehe `.github/instructions/instructions.instructions.md`).
- **Keine stillen Codeänderungen**: Änderungen nur auf explizite Anweisung.
- **UI-Status**: Aktiver Tab wird in `localStorage` gespeichert (`currentTab`).

## API- und Datenfluss

- **Frontend <-> Backend**: Kommunikation ausschließlich über REST-API (`/api/*`). Authentifizierung via Session-Cookie.
- **Konfigurationsobjekte**: Siehe Typ `PreviousConfig` in [frontend/lib/types.ts](frontend/lib/types.ts) und [backend/types.ts](backend/types.ts).
- **Konfigurationsänderungen**: Reihenfolgeänderungen werden explizit per API (`/api/configurations/order/update`) übertragen.
- **Import/Export**: Einzelne Konfigurationen und komplette Datenbank können importiert/exportiert werden (JSON).

## Integration & Besonderheiten

- **WebSocket**: Für Live-Systemmetriken (`backend/websocket.ts`).
- **Systemdienste**: systemd-Units für Backend und Frontend (`systemd/`).
- **Avahi/Bonjour**: Netzwerk-Discovery via `next.local:2342` nach Setup.
- **Sicherheit**: Keine Standardpasswörter, Setup erzwingt initiale User-Anlage.

## Beispiele & Referenzen

- **Backend-API-Client**: [frontend/lib/api.ts](frontend/lib/api.ts)
- **Konfigurations-CRUD**: [frontend/lib/database.ts](frontend/lib/database.ts), [backend/database/configurations.ts](backend/database/configurations.ts)
- **Session-Handling**: [backend/index.ts](backend/index.ts), [backend/api/auth.ts](backend/api/auth.ts)

## Benutzerdefinierte Befehle

- **`:cm`**: Erstellt eine kompakte Commit-Message in Englisch, für die Änderungen seit dem letzten Commit. Es sollen nur aktuell geänderte Dateien berücksichtigt werden (`git status`). Die Message soll eine Überschrift (Headline) und eine ungeordnete Liste enthalten und als reiner Text in einer Code-Box formatiert sein.
- **`:docs <Thema>`**: Generiert eine ausführliche Dokumentation zu dem angegebenen Thema im Kontext des aktuellen Projekts. Die Dokumentation soll in Markdown-Format sein und Code-Beispiele enthalten, wo es sinnvoll ist. Ist das Kommando von einem `>`-Symbol und einem String gefolgt, schreibe die Anleitung als Markdown in ein File mit diesem Namen im Projekt Root-Verzeichnis. Ist kein Thema angegeben, generiere eine umfassende Dokumentation des gesamten Projekts.
- **`:arch`**: Gibt eine kurze Zusammenfassung der Architektur des aktuellen Projekts. Ist das Kommando von einem `>`-Symbol und einem String gefolgt, schreibe die Anleitung als Markdown in ein File mit diesem Namen im Projekt Root-Verzeichnis.
- **`:dev-setup`**: Gib eine Schritt-für-Schritt-Anleitung zur Einrichtung der Entwicklungsumgebung für das aktuelle Projekt. Ist das Kommando von einem `>`-Symbol und einem String gefolgt, schreibe die Anleitung als Markdown in ein File mit diesem Namen im Projekt Root-Verzeichnis.
- **`:undo`**: Mach die letzten Änderungen im Code rückgängig und kehre zum vorherigen Zustand zurueck.
- **`:scan`**: Scanne den Code des aktuellen Projekts und aktualisiere deinen Kontext.
- **`:badges`**: Fuehre das Script `update_badges.sh` aus.
- **`:ls`**: Gib eine Liste aller Custom Commands als Markdown aus, die mit ":" beginnen.
- **`desc`**: Gib mir eine vollstaendige funktionale Beschreibung des Projektes, aufgeteilt nach Backend und Frontend, ohne technische Angaben als Markdown. Ist das Kommando von einem `>`-Symbol und einem String gefolgt, schreibe den Text in ein File mit diesem Namen im Projekt Root-Verzeichnis. Hat der Name ein Sprach-Suffix wie `.de.md` oder `.en.md`, schreibe die Beschreibung in der entsprechenden Sprache (Deutsch oder Englisch).