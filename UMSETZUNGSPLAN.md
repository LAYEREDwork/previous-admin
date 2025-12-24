# Erweiterter Schrittweiser Umsetzungsplan für UI-Optimierungen in "previous-admin"

## Einführung
Dieser erweiterte Plan trennt die Umsetzung nach Backend und Frontend, um modulare Entwicklung zu ermöglichen. Tests werden getrennt für Frontend und Backend eingerichtet, mit separaten Scripts (z.B. `npm run test:frontend` und `npm run test:backend`). Frontend-Tests verwenden Vitest für UI-Komponenten; Backend-Tests könnten Jest oder Mocha für API-Logik nutzen. CI/CD wird erweitert, um beide Bereiche separat zu testen. Der Plan fokussiert auf Frontend-Optimierungen (UI-Modularisierung), aber schließt Backend-Modularisierung ein (z.B. Services extrahieren). **Zusatz:** Shared-Code im `shared/`-Verzeichnis wird konsolidiert für globale Enums, Structs, Konstanten, Types und Default-Values (keine Magic Strings/Numbers). Stelle Erreichbarkeit für Backend und Frontend sicher (z.B. via relative Imports).

**Annahmen:**
- Frontend: React/TypeScript, Tests mit Vitest.
- Backend: Node.js/Express/TypeScript, Tests mit Jest (neu einrichten).
- Shared: `shared/` für gemeinsame Types/Enums (z.B. `ApiEndpoints` enum statt Strings).
- Getrennte Testausführung: `npm run test:frontend` und `npm run test:backend`.
- CI: Separate Jobs für Frontend und Backend in `.gitlab-ci.yml`.
- Modularisierung: Frontend-Komponenten aufteilen; Backend-Services/Services aus API-Modulen extrahieren; Shared-Code konsolidieren.

## Schritt 0: Einrichtung der Test-Frameworks und CI/CD (Frontend und Backend getrennt)
- **Ziel:** Basis für getrennte Tests schaffen.
- **Aktionen:**
  - **Frontend:** Installiere Vitest: `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom`.
  - **Backend:** Installiere Jest: `npm install --save-dev jest @types/jest ts-jest supertest`.
  - Erstelle separate Configs: `vitest.config.ts` für Frontend, `jest.config.js` für Backend.
  - Füge Scripts zu `package.json`: `"test": "npm run test:frontend && npm run test:backend", "test:frontend": "vitest", "test:backend": "jest"`.
  - Erstelle `.gitlab-ci.yml` mit separaten Jobs:
    ```yaml
    stages:
      - test
    test:frontend:
      script: npm run test:frontend
    test:backend:
      script: npm run test:backend
    ```
  - Erstelle Dummy-Tests: Frontend für App.tsx, Backend für einen API-Endpunkt.
- **Tests:** Unit-Test für PAButton (Frontend); Unit-Test für Auth-API (Backend).
- **Regression-Vermeidung:** Lokale Ausführung beider Tests.
- **Commit:** `git commit -m "Setup separate test frameworks for frontend and backend"`.
- **Dauer:** 2-3 Stunden.

## Shared-Schritte (vor Frontend/Backend)

## Schritt S1: Konsolidierung von Shared-Code
- **Ziel:** Globale Enums, Structs, Konstanten, Types und Default-Values in `shared/` zentralisieren; Magic Strings/Numbers vermeiden.
- **Aktionen:**
  - Erweitere `shared/constants.ts`: Füge Enums für API-Endpunkte (z.B. `enum ApiEndpoints { AUTH = '/api/auth' }`), Default-Values (z.B. `enum DefaultConfig { MEMORY = 32 }`).
  - Erstelle neue Shared-Files: `shared/types.ts` für gemeinsame Interfaces/Types; `shared/enums.ts` für globale Enums.
  - Refaktoriere bestehende Code: Ersetze Magic Strings (z.B. `'text'` -> `InputType.TEXT`) und Numbers in Frontend/Backend.
  - Stelle Erreichbarkeit sicher: Verwende relative Imports (z.B. `import { ApiEndpoints } from '../../../shared/constants'`); prüfe TypeScript-Paths in `tsconfig.json`.
- **Tests:** Unit-Tests für Shared-Enums/Types (z.B. Enum-Werte korrekt); Integrationstests für Imports in Frontend/Backend.
- **Regression-Vermeidung:** Type-Checks; stelle sicher, dass Builds funktionieren.
- **Commit:** `git commit -m "Consolidate shared code: add enums, types, and constants to shared/"`.
- **Dauer:** 1-2 Stunden.

## Frontend-Schritte

## Schritt 1: Vorbereitung und Baseline-Erstellung (Frontend)
- **Ziel:** Stabiler Startpunkt für Frontend.
- **Aktionen:** Erstelle Baseline-Tests für Seiten (z.B. PAConfigListPage); nutze Shared-Enums für Konsistenz.
- **Tests:** Integrationstest für PAConfigListPage. Lokale Ausführung: `npm run test:frontend`.
- **Regression-Vermeidung:** CI-Job für Frontend.
- **Commit:** Wie zuvor.
- **Dauer:** 45 Minuten.

## Schritt 2: Extraktion von Styling-Logik in Utilities (Frontend)
- **Ziel:** Styling wiederverwendbar machen.
- **Aktionen:** Erstelle `frontend/lib/utils/styling.ts`; Refaktoriere PAConfigListItemPartial; nutze Shared-Enums für Styling-Keys.
- **Tests:** Unit-Test für `getItemStyling`; Integrationstest für Komponente. `npm run test:frontend`.
- **Regression-Vermeidung:** Visuelle Tests.
- **Commit:** Wie zuvor.
- **Dauer:** 1.5-2.5 Stunden.

## Schritt 3: Aufteilung von PAConfigListItemPartial.tsx (Frontend)
- **Ziel:** Komponente zerlegen.
- **Aktionen:** Erstelle Sub-Komponenten; Refaktoriere; verwende Shared-Types für Props.
- **Tests:** Unit-Tests für Sub-Komponenten; Integrationstest für PAConfigListPage. `npm run test:frontend`.
- **Regression-Vermeidung:** Props-Tests.
- **Commit:** Wie zuvor.
- **Dauer:** 2.5-3.5 Stunden.

## Schritt 4: Aufteilung von PADashboardPartial.tsx (Frontend)
- **Ziel:** Charts separieren.
- **Aktionen:** Erstelle Chart-Komponenten; nutze Shared-Enums für Chart-Types.
- **Tests:** Unit-Tests für Charts; Integrationstest für PASystemPage. `npm run test:frontend`.
- **Regression-Vermeidung:** Daten-Tests.
- **Commit:** Wie zuvor.
- **Dauer:** 2.5-3.5 Stunden.

## Schritt 5: Verbesserung der Wiederverwendbarkeit von Controls und Partials (Frontend)
- **Ziel:** Composites erstellen.
- **Aktionen:** Erstelle PAInputWithActions, PALoadingPartial; integriere Shared-Enums für Input-Types.
- **Tests:** Unit-Tests für Composites; Integrationstests. `npm run test:frontend`.
- **Regression-Vermeidung:** Verwendungs-Tests.
- **Commit:** Wie zuvor.
- **Dauer:** 1.5-2.5 Stunden.

## Schritt 6: Weitere Trennung von Logik und UI in Hooks (Frontend)
- **Ziel:** Logik extrahieren.
- **Aktionen:** Erstelle useDragState; verwende Shared-Types für Hook-Returns.
- **Tests:** Unit-Tests für Hooks; Integrationstests. `npm run test:frontend`.
- **Regression-Vermeidung:** Seiteneffekt-Tests.
- **Commit:** Wie zuvor.
- **Dauer:** 1.5-2.5 Stunden.

## Backend-Schritte

## Schritt B1: Analyse und Baseline für Backend
- **Ziel:** Backend modularisieren (z.B. Services aus API-Modulen extrahieren); nutze Shared-Enums für API-Endpunkte.
- **Aktionen:** Erstelle Services (z.B. `backend/services/authService.ts`); Refaktoriere API-Endpunkte mit Shared-Constants.
- **Tests:** Unit-Tests für Services; Integrationstests für API. `npm run test:backend`.
- **Regression-Vermeidung:** API-Tests mit Supertest.
- **Commit:** `git commit -m "Modularize backend: extract services from API modules"`.
- **Dauer:** 2-3 Stunden.

## Schritt B2: Weitere Backend-Modularisierung
- **Ziel:** Datenbank-Logik und Plattform-Utils trennen; Shared-Enums für DB-Queries.
- **Aktionen:** Erstelle separate Module; ersetze Magic Values mit Shared-Enums.
- **Tests:** Unit-Tests für DB-Funktionen; Integrationstests. `npm run test:backend`.
- **Regression-Vermeidung:** DB-Mock-Tests.
- **Commit:** Wie zuvor.
- **Dauer:** 1-2 Stunden.

## Schritt 7: Finale Validierung und Cleanup (Frontend und Backend)
- **Ziel:** Alles validieren.
- **Aktionen:** Vollständige Tests: `npm run test`; Coverage prüfen; CI-Push.
- **Tests:** Alle Tests; E2E für Workflows.
- **Regression-Vermeidung:** Manuelle Tests; Rollback.
- **Commit:** Wie zuvor.
- **Dauer:** 1.5 Stunden.

## Gesamtdauer und Risiken
- **Gesamtdauer:** 16-24 Stunden (inkl. Shared).
- **Risiken:** Import-Konflikte in Shared – durch TypeScript-Paths minimieren.
- **Vorteile:** Konsistente, wartbare Shared-Code; keine Magic Values.

Dieser Plan berücksichtigt Shared-Code. Beginne mit Schritt S1!