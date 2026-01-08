# Claude Code Instructions for `previous-admin`

## Allgemeine Richtlinien

- Kommuniziere immer auf Deutsch.
- Verwende niemals einzelne Zeichen für Variablennamen, Parameter oder Bezeichner — immer beschreibende Namen.
- Füge in jeder Art von Code Kommentare hinzu, um nicht-triviale Teile auf Englisch zu erklären.
- Formatiere Code immer mit korrekter Einrückung und Abständen.
- Füge immer JSDoc-Dokumentationskommentare für alle Funktionen und Klassen auf Englisch hinzu.
- Ändere niemals Code ohne explizite Anfrage.
- Bei Änderungen: Führe immer Linter, Typecheck und Build aus. Behebe Fehler vor dem Fortfahren.
- Neue Farben müssen theme-aware sein (Light und Dark Mode).
- Verwende immer `@`-Imports für interne Module statt relativer Pfade.
- Folge der bestehenden Projektstruktur und Coding Conventions.

### DRY-Prinzip (KRITISCH)

Bevor du neue Types, Konstanten oder Konfigurationen erstellst, durchsuche IMMER die Codebase nach ähnlichen oder existierenden Implementierungen:
- Nutze existierende Implementierungen statt Duplikate zu erstellen
- Wenn Erweiterung nötig ist, refaktoriere für Wiederverwendbarkeit
- Erstelle niemals redundante Konstanten, Mappings oder Type-Definitionen
- Beispiele: Size-Konfigurationen (`PASizeConfig`), Icon-Mappings, Farbschemata, Font-Einstellungen

## Architektur-Übersicht

| Komponente | Beschreibung |
|------------|--------------|
| **Frontend** | React 19 + TypeScript, Vite, Tailwind CSS, Rsuite UI. Port 2342 (Dev), served by Backend (Prod) |
| **Backend** | Node.js + Express + TypeScript. REST API (`/api/*`). Port 3001 (Dev), 2342 (Prod) |
| **Database** | SQLite in `~/.previous-admin/previous-admin.db` mit automatischer Schema-Initialisierung |
| **Platform** | Plattform-spezifische Config-Manager für macOS und Linux (`backend/platform/`) |
| **State** | React Contexts (`contexts/`) für globalen State, Custom Hooks (`hooks/`) für Business Logic |
| **i18n** | Deutsch, Englisch, Spanisch, Französisch, Italienisch in `frontend/lib/i18n/locales/` |

## Entwicklungs-Workflows

```bash
# Development starten
npm run backend          # Backend auf :3001
npm run dev              # Frontend auf :2342

# Build & Test
npm run build            # Production Build
npm run test             # Alle Tests (Vitest)
npm run test:frontend    # Nur Frontend Tests
npm run test:backend     # Nur Backend Tests

# Code Quality
npm run lint             # ESLint
npm run typecheck        # TypeScript Check

# Generierung
npm run generate         # Alle generierten Dateien neu erstellen
npm run generate:prod    # Ohne Screenshots
```

**Wichtig**: Niemals `git pull` verwenden. Updates über GitHub Releases herunterladen (`scripts/update.ts`).

## Projektspezifische Patterns

### API Routes

**NIEMALS Magic String Literals für Endpoints!** Immer in `shared/api/constants.ts` im `apiPaths` Objekt definieren:

```typescript
// Backend (relative Pfade)
apiPaths.Config.convertToCfg.relative

// Frontend (volle Pfade)
apiPaths.Config.convertToCfg.full
```

### PASize Enum

**IMMER** `PASize` Enum-Konstanten verwenden statt Magic Strings:

```typescript
// Richtig
import { PASize } from '@frontend/lib/types/sizes';
<Component size={PASize.md} />

// Falsch
<Component size="md" />
```

### Config Management

- `ConfigManager` Klasse in `backend/config/index.ts`
- Platform-spezifisch: `linux-config-manager.ts` / `macos-config-manager.ts`
- Database-Operationen aus `backend/database/` importieren

### SF Symbol Architektur

**Source of Truth**: `frontend/components/sf-symbols/available-symbols.ts`

- Enum generiert aus SVG-Dateinamen
- Symbol-Validierung in `backend/config-schema/validate-symbols.ts`
- Semantisches Keyword-Matching in `backend/config-schema/schema-extractor.ts`
- Pipeline: `scripts/generate-sfsymbols.ts` → `available-symbols.ts` → Validierung

### Custom Hooks

Business Logic in Hooks extrahiert:
- `useConfigActions` — Config CRUD
- `useConfigList` — Konfigurations-Listen
- `useSystemMetrics` — Echtzeit-Metriken

### Error Handling

- Frontend: `PAErrorBoundary` Komponente + Notification Context
- Backend: Try-catch mit HTTP Status Codes

## Wichtige Dateien

| Datei | Beschreibung |
|-------|--------------|
| `backend/index.ts` | Server Entry Point, Express Setup |
| `frontend/App.tsx` | Root Component mit Context Providers |
| `shared/api/constants.ts` | **SSoT** für alle API Endpoint Pfade |
| `shared/types.ts` | Geteilte TypeScript Interfaces |
| `backend/platform/` | Platform Abstraction Layer |
| `backend/metrics.ts` | System-Metriken Sammlung |
| `frontend/lib/database.ts` | Frontend Database API Client |

## Versions-Handling

- **Source of Truth**: GitHub Releases und Tags
- Aktuelle Version: `~/.previous-admin/version.json`
- Update-Prüfung gegen GitHub API
- Bei neuerer Version: Benachrichtigung auf "About"-Seite

### Release Notes Generierung

Änderungen zwischen Tags abrufen:
```
https://github.com/LAYEREDwork/previous-admin/compare/{OLD_TAG}...{NEW_TAG}
```

## Verfügbare Slash-Commands

Siehe `.claude/commands/` für projektspezifische Commands:
- `/scan` — Projekt scannen
- `/cm` — Commit Message erstellen
- `/release` — Release Notes generieren
- `/arch` — Architektur-Zusammenfassung
- `/badges` — Badges aktualisieren
- `/docs` — Dokumentation generieren
- `/npm` — npm Scripts anzeigen
