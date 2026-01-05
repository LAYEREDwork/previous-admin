# Bugfix: Schema Loading Issue

## Problem
Der Editor zeigte den Fehler: `Error loading schema: Failed to load configuration schema`

Das Backend konnte die Schema-Datei nicht laden, obwohl die Datei unter `shared/previous-config/schema.json` existierte.

## Root Cause
In `backend/api/config-schema.ts` wurde `__dirname` verwendet, aber in einem ES-Modul-Kontext ist diese Variable nicht automatisch verfügbar. Dies führte zu dem Fehler:
```
ReferenceError: __dirname is not defined
```

Das Backend gab dann einen 500-Fehler zurück mit der Nachricht: `Config schema not found. Run 'npm run generate:schema' first.`

## Lösung
Importiere `fileURLToPath` und `dirname` von `url` und `path` Modulen, um `__dirname` für ES-Module korrekt zu definieren:

```typescript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### Geänderte Datei
- [backend/api/config-schema.ts](../../backend/api/config-schema.ts)

### Änderungen
1. Importiere `fileURLToPath` von `url` Modul
2. Importiere `dirname` von `path` Modul
3. Definiere `__filename` und `__dirname` am Anfang der Datei

## Testergebnisse nach Fix
✅ Backend-Tests: 47 passed
✅ Frontend-Tests: 139 passed
✅ TypeScript typecheck: No errors
✅ ESLint: No errors
✅ Production build: Success

## Verifikation
Nach dem Fix funktioniert der Endpoint `/api/config/schema` korrekt und der Editor lädt die Schema erfolgreich.

```bash
$ curl http://localhost:3001/api/config/schema
{"sections":{"ConfigDialog":{...},...}}
```
