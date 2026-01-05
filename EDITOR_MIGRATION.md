# Dynamischer Config-Editor - Implementierungsplan

## 📌 Übersicht

Dieses Dokument beschreibt die Migration des Previous-Admin Config-Editors von **hardcoded Parametern** zu einer **vollständig dynamischen, schema-basierten Lösung**.

### Ziele
- ✅ Alle Parameter aus `default_for_admin.cfg` dynamisch darstellen
- ✅ Automatische UI-Generierung basierend auf Parametertyp
- ✅ Typsichere Validierung
- ✅ Einfache Wartbarkeit und Erweiterbarkeit
- ✅ Keine Breaking Changes in bestehender Funktionalität

### Entscheidungen
- **Parser**: Custom TypeScript Parser (volle Kontrolle)
- **CFG-Ort**: `backend/config-schema/reference.cfg`
- **Schema-JSON**: `shared/previous-config/schema.json` (wird von Backend & Frontend genutzt)
- **Generator**: Shell-Script `scripts/generate-config-schema.sh`
- **Schema-Output**: Generiert (nicht in Git versioniert)
- **UI-Kontrollen**: Toggle (Boolean), Dropdown (Enum), Number Input (Range/Numeric)
- **Dieses Dokument**: in `.gitignore` aufnehmen

---
## Umsetzungsfortschritt

### Phase 1: Config-Parsing & Schema-Definition
- [x] 1.1 `default_for_admin.cfg` → `backend/config-schema/reference.cfg` verschieben
- [x] 1.2 `config-parser.ts` implementieren
- [x] 1.3 `schema-extractor.ts` implementieren
- [x] 1.4 `schema-types.ts` erstellen (TypeScript Types)
- [x] 1.5 `validator.ts` implementieren
- [x] 1.6 `generate-config-schema.sh` Script erstellen
- [x] 1.7 Unit Tests in `config-schema.test.ts` schreiben
- [x] 1.8 `.gitignore` aktualisieren
- [x] 1.9 Linter, Tests, Typecheck, Build durchführen
- [x] ✅ **Phase 1 abgeschlossen** (abhaken wenn fehlerfrei)

### Phase 2: Backend API erweitern
- [x] 2.1 `config-schema.ts` API-Endpoint implementieren
- [x] 2.2 `converter.ts` für CFG ↔ JSON Konvertierung
- [x] 2.3 `configurationService.ts` mit Validierung anpassen
- [x] 2.4 Backend-Tests schreiben
- [x] 2.5 Linter, Tests, Typecheck, Build durchführen
- [x] ✅ **Phase 2 abgeschlossen** (abhaken wenn fehlerfrei)

### Phase 3: Frontend UI-Komponenten
- [x] 3.1 `useConfigSchema.ts` Hook implementieren
- [x] 3.2 `PAConfigInput.tsx` + Input-Komponenten erstellen
  - [x] 3.2a `PABooleanInput.tsx`
  - [x] 3.2b `PAEnumInput.tsx`
  - [x] 3.2c `PANumberRangeInput.tsx`
  - [x] 3.2d `PAStringInput.tsx`
- [x] 3.3 `PAConfigFieldPartial.tsx` implementieren
- [x] 3.4 `PAConfigSectionPartial.tsx` implementieren
- [x] 3.5 Frontend Tests schreiben
- [x] 3.6 Linter, Tests, Typecheck, Build durchführen
- [x] ✅ **Phase 3 abgeschlossen** (abhaken wenn fehlerfrei)

### Phase 4: Frontend Integration
- [x] 4.1 Translation-Keys zu allen Sprach-Dateien hinzufügen (de, en, es, fr, it)
- [x] 4.2 `PAEditorViewPartial.tsx` refactoren (dynamisch statt hardcoded, alte Struktur wird nicht mehr benoetigt)
- [x] 4.3 `useConfigEditor.ts` Hook mit Validierung anpassen
- [x] 4.4 Alte hardcoded Editor-Komponenten entfernen
- [x] 4.5 Integration Tests durchführen
- [x] 4.6 Linter, Tests, Typecheck, Build durchführen
- [x] ✅ **Phase 4 abgeschlossen** (abhaken wenn fehlerfrei)

### Phase 5: Testing & Polishing
- [ ] 5.1 Alle Frontend-Tests ausführen (`npm run test:frontend`)
- [ ] 5.2 Alle Backend-Tests ausführen (`npm run test:backend`)
- [ ] 5.3 TypeScript Typecheck (`npm run typecheck`)
- [ ] 5.4 ESLint Linting (`npm run lint`)
- [ ] 5.5 Production Build (`npm run build`)
- [ ] 5.6 Lokale manuelle Tests im Browser
- [ ] 5.7 Edge Cases testen (Config speichern/laden, Validierung, etc.)
- [ ] 5.8 Responsive Design auf verschiedenen Bildschirmgrößen testen
- [ ] ✅ **Phase 5 abgeschlossen & produktionsreif** (abhaken wenn fehlerfrei)

---

## 📋 Phase 1: Config-Parsing & Schema-Definition

**Dauer**: ~2-3 Stunden  
**Deliverable**: CFG-Parser + JSON-Schema + TypeScript Types + Tests  
**Status**: ✅ Abgeschlossen

### Struktur

```
📁 backend/config-schema/
  ├── reference.cfg              (verschoben von Root)
  ├── config-parser.ts           (neu)
  ├── schema-extractor.ts        (neu)
  ├── validator.ts               (neu)
  └── __tests__/
      └── config-schema.test.ts  (neu)

📁 shared/previous-config/
  ├── schema.json                (generated, .gitignored, shared mit Frontend)
  ├── schema-types.ts            (neu)
  └── types.ts                   (existing)

📁 scripts/
  └── generate-config-schema.sh  (neu)
```

### 1.1 Datei verschieben
- `default_for_admin.cfg` → `backend/config-schema/reference.cfg`
- `.gitignore` aktualisieren: `backend/config-schema/schema.json`
- `.gitignore` aktualisieren: `EDITOR_MIGRATION.md`

### 1.2 Config-Parser (`backend/config-schema/config-parser.ts`)

**Aufgabe**: INI/CFG-Format parsen, Kommentare extrahieren (OHNE Type-Interpretation)

```typescript
/**
 * Raw parsed configuration data - keine Typ-Interpretation!
 * Parser gibt nur rohe Daten zurück
 */
export interface RawConfigSection {
  name: string;
  parameters: RawConfigParameter[];
}

export interface RawConfigParameter {
  name: string;
  value: string;              // Always as string, type determined later
  comments: string[];         // Raw comment lines above parameter (unparsed)
}

export interface RawConfigData {
  sections: RawConfigSection[];
}

/**
 * Parse CFG file content
 * @param cfgContent Raw file content
 * @returns Structured raw config data (no type interpretation)
 */
export function parseCfgFile(cfgContent: string): RawConfigData {
  // Implementation
}
```

**Parser-Logik** (Type-agnostisch):
1. Zeile für Zeile iterieren
2. `[SectionName]` erkennen → neue Sektion
3. `key = value` erkennen → Parameter
4. `#` oder `//` Zeilen sammeln → Raw Comments (werden NICHT geparst!)
5. Whitespace trimmen, leere Zeilen ignorieren
6. Strukturierte Ausgabe mit Rohdaten

**Wichtig**: Der Parser macht KEINE Type-Interpretation! Die Comments bleiben einfach als Rohtext erhalten.

### 1.3 Schema-Extrahierung (`backend/config-schema/schema-extractor.ts`)

**Aufgabe**: Aus den RAW-Kommentaren (vom Parser) die Metadaten extrahieren und Typen bestimmen

```typescript
export type ParameterType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'enum' 
  | 'range';

export interface ParameterSchema {
  name: string;
  type: ParameterType;
  default: string | number | boolean;
  description: string;                  // "Meaning" aus CFG (wird als Info unter Input angezeigt)
  translationKey: string;               // Z.B. "configEditor.parameters.bShowConfigDialogAtStartup"
  
  // For enum/range types
  possibleValues?: string[];
  labels?: string[];        // Z.B. ["NEXT_CUBE030", "NEXT_CUBE040"]
  min?: number;
  max?: number;
}

export interface SectionSchema {
  name: string;
  parameters: ParameterSchema[];
}

export interface ConfigSchema {
  sections: Record<string, SectionSchema>;
}

/**
 * Extract schema from raw config data
 * @param rawConfig Parsed CFG data (from parser, still raw comments)
 * @returns Structured schema with interpreted types and metadata
 */
export function extractSchema(rawConfig: RawConfigData): ConfigSchema {
  // Implementation: Parse comments, extract Type, Values, Default, etc.
}
```

**Extrahierungs-Workflow** (2-Schritt Prozess):

1. **Parser liefert**: `RawConfigData` mit unparsed Comments

   ```
   { name: "bShowConfigDialogAtStartup", value: "TRUE", comments: ["# Type: Bool", "# Meaning: ..."] }
   ```

2. **Extractor parsed Comments** und erstellt Schema

   ```
   { name: "bShowConfigDialogAtStartup", type: "boolean", default: true, ... }
   ```

**Extrahierungs-Logik** für die Comments:

```
# Type: Bool
# Possible Values: TRUE/FALSE
# Meaning: Whether to show the configuration dialog at startup.
# Default: TRUE
bShowConfigDialogAtStartup = TRUE

# Possible Values: TRUE/FALSE
# Meaning: Whether to show the configuration dialog at startup.
# Default: TRUE
bShowConfigDialogAtStartup = TRUE
```

Aus diesen Kommentaren extrahieren:
- `type`: "bool" → "boolean"
- `possibleValues`: ["TRUE", "FALSE"]
- `labels`: ["TRUE", "FALSE"]
- `default`: "TRUE" → true
- `description`: "Whether to show..." (aus "Meaning")
- `translationKey`: Generiert aus Parameter-Name
  - Beispiel: `bShowConfigDialogAtStartup` → `configEditor.parameters.bShowConfigDialogAtStartup`
  - Format: `configEditor.parameters.{originalParameterName}`

**Translation-Key-Generierung für Parameter**:
Der Parametername wird 1:1 als Suffix verwendet (nicht transformiert).
Dies erlaubt exakte Zuordnung und einfache manuelle Übersetzungsverwaltung.
- Parametername: `bShowConfigDialogAtStartup` → Key: `configEditor.parameters.bShowConfigDialogAtStartup`
- Format: `configEditor.parameters.{originalParameterName}`

**Translation-Key-Generierung für Sektionen**:
Sektionsnamen werden aus CamelCase in Leerzeichen-getrennte Wörter konvertiert:
- Sektionsname: `ConfigDialog` → displayName: `Config Dialog` → Key: `configEditor.sections.ConfigDialog`
- Sektionsname: `SystemSettings` → displayName: `System Settings` → Key: `configEditor.sections.SystemSettings`
- Format: `configEditor.sections.{originalSektionsName}`

**Zweck von `displayName`**:
Der `displayName` dient zwei Zwecken:
1. **Fallback**: Wenn eine Übersetzung für `translationKey` nicht vorhanden ist, wird `displayName` angezeigt
2. **Referenz für Translations-Generator**: Das `displayName` ist die englische Source-of-Truth, die vom Translations-Generator verwendet wird, um die JSON-Dateien automatisch zu pre-populieren
   - Beispiel: Der Generator liest `displayName: "Config Dialog"` und fügt in `frontend/lib/translations/de.json` ein: `"configEditor.sections.ConfigDialog": "Config Dialog"` ein
   - Dies kann der Übersetzer dann anpassen: `"configEditor.sections.ConfigDialog": "Konfigurationsdialog"`

**Im Frontend**:
```typescript
// Retrieve translation with displayName as fallback
const label = getTranslation('configEditor.sections.ConfigDialog') || sectionSchema.displayName;
```

**Im Translations-Generator** (Phase 4):
```typescript
// Iterate schema and pre-populate missing keys with displayName
function generateTranslationKeys(schema: ConfigSchema): void {
  for (const [sectionName, section] of Object.entries(schema.sections)) {
    ensureTranslationKey(
      section.translationKey,
      section.displayName  // ← Englischer Text als Vorgabewert
    );
    
    for (const param of section.parameters) {
      ensureTranslationKey(
        param.translationKey,
        param.name  // ← Or param description for more meaningful suggestions
      );
    }
  }
}
```

### 1.4 TypeScript Schema-Types (`shared/previous-config/schema-types.ts`)

```typescript
export type ParameterType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'enum' 
  | 'range';

export interface ParameterSchema {
  name: string;
  type: ParameterType;
  default: string | number | boolean;
  description: string;
  possibleValues?: string[];
  labels?: string[];
  min?: number;
  max?: number;
}

export interface SectionSchema {
  name: string;                        // Originalname aus CFG (z.B. "ConfigDialog")
  displayName: string;                 // Formatierter Name (z.B. "Config Dialog")
  translationKey: string;              // Z.B. "configEditor.sections.ConfigDialog"
  parameters: ParameterSchema[];
}

export interface ConfigSchema {
  sections: Record<string, SectionSchema>;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
```

### 1.5 Beispiel-Struktur: `schema.json`

```json
{
  "sections": {
    "ConfigDialog": {
      "name": "ConfigDialog",
      "displayName": "Config Dialog",
      "translationKey": "configEditor.sections.ConfigDialog",
      "parameters": [
        {
          "name": "bShowConfigDialogAtStartup",
          "type": "boolean",
          "default": true,
          "description": "Whether to show the configuration dialog at startup.",
          "translationKey": "configEditor.parameters.bShowConfigDialogAtStartup"
        }
      ]
    },
    "System": {
      "name": "System",
      "displayName": "System",
      "translationKey": "configEditor.sections.System",
      "parameters": [
        {
          "name": "nMachineType",
          "type": "enum",
          "default": "0",
          "description": "Machine type.",
          "translationKey": "configEditor.parameters.nMachineType",
          "possibleValues": ["0", "1", "2"],
          "labels": ["NEXT_CUBE030", "NEXT_CUBE040", "NEXT_STATION"]
        },
        {
          "name": "nMemoryBankSize0",
          "type": "number",
          "default": 16,
          "description": "Size of memory bank 0 in MB.",
          "translationKey": "configEditor.parameters.nMemoryBankSize0",
          "min": 0,
          "max": 32
        }
      ]
    }
  }
}
```

### 1.10 Validator (`backend/config-schema/validator.ts`)

```typescript
/**
 * Validate a config value against schema
 */
export function validateConfigValue(
  sectionName: string,
  paramName: string,
  value: any,
  schema: ConfigSchema
): ValidationResult {
  const section = schema.sections[sectionName];
  if (!section) {
    return { valid: false, error: `Section not found: ${sectionName}` };
  }

  const param = section.parameters.find(p => p.name === paramName);
  if (!param) {
    return { valid: false, error: `Parameter not found: ${paramName}` };
  }

  // Type checking based on param.type
  // Range/enum validation
}
```

**Validierungsregeln**:
- Boolean: nur `true` / `false`
- Number: parsebar als Int/Float
- Range: innerhalb min/max
- Enum: in `possibleValues`
- String: beliebig

### 1.11 Schema-Generator Script (`scripts/generate-config-schema.sh`)

```bash
#!/bin/bash
set -e

CONFIG_FILE="backend/config-schema/reference.cfg"
SCHEMA_FILE="shared/previous-config/schema.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Config file not found: $CONFIG_FILE"
  exit 1
fi

echo "📝 Generating schema from $CONFIG_FILE..."

# Nutzt das Backend für Parsing
# npx ts-node generiert das JSON
npx tsx -e "
  import { readFileSync } from 'fs';
  import { writeFileSync } from 'fs';
  import { parseCfgFile } from './backend/config-schema/config-parser';
  import { extractSchema } from './backend/config-schema/schema-extractor';

  const content = readFileSync('$CONFIG_FILE', 'utf-8');
  const raw = parseCfgFile(content);
  const schema = extractSchema(raw);
  
  writeFileSync('$SCHEMA_FILE', JSON.stringify(schema, null, 2));
  console.log('✅ Schema generated:', '$SCHEMA_FILE');
"
```

Alternativ als `package.json` Task:
```json
{
  "scripts": {
    "generate:schema": "tsx scripts/generate-config-schema.ts"
  }
}
```

### 1.8 Tests (`backend/__tests__/config-schema.test.ts`)

```typescript
describe('Config Schema Generation', () => {
  describe('parseCfgFile', () => {
    it('should parse basic CFG structure', () => {
      // Test
    });
    
    it('should extract comments above parameters', () => {
      // Test
    });
  });

  describe('extractSchema', () => {
    it('should extract boolean parameters', () => {
      // Test
    });
    
    it('should extract enum parameters with possible values', () => {
      // Test
    });
    
    it('should extract range parameters', () => {
      // Test
    });
  });

  describe('validateConfigValue', () => {
    it('should validate boolean values', () => {
      // Test
    });
    
    it('should reject invalid enum values', () => {
      // Test
    });
  });
});
```

### 1.8 `.gitignore` Aktualisierung

```gitignore
# Generated config schema (shared zwischen Frontend & Backend)
shared/previous-config/schema.json
EDITOR_MIGRATION.md
```

### 1.9 Validierungschecklist Phase 1

```bash
# Parser testen
npm run test -- config-schema.test.ts

# Type checking
npm run typecheck

# Linter
npm run lint

# Build
npm run build

# Schema generieren
npm run generate:schema

# Manuell prüfen
cat shared/previous-config/schema.json | jq '.sections | keys'
```

**Phase 1 ist abgeschlossen, wenn**:
- ✅ `config-parser.ts` schreibt (`RawConfigData`)
- ✅ `schema-extractor.ts` extrahiert Schema
- ✅ `schema.json` wird korrekt generiert
- ✅ `validator.ts` validiert Values
- ✅ Tests alle grün
- ✅ Build fehlerfrei
- ✅ Linter clean

---

## 🎨 SF-Symbole für Sektionen - Strategie

**Problem**: Wie weist man dynamisch generierten Sektionen sinnvolle SF-Symbole zu, ohne unsinnige Icons zu zeigen?

### Lösungsansätze

#### **Option 1: Explizites Mapping in der Schema (empfohlen)**

Jede Sektion bekommt ein explizites `sfSymbol` Feld im generierten Schema. Der Parser verwaltet ein zusätzliches Mapping-File.

**Vorteile**:
- ✅ Volle Kontrolle über Icons
- ✅ Keine Heuristik nötig
- ✅ Leicht zu maintainen
- ✅ Erweiterbar für neue Sektionen

**Nachteile**:
- ❌ Mapping-File muss manuell gepflegt werden
- ❌ Bei neuen Sektionen muss Icon manuell hinzugefügt werden

**Umsetzung**:

1. Neue Datei: `backend/config-schema/section-symbols.json`
   
   Apple SF-Symbol Namen (wie in `scripts/generate-sf-symbols.ts` verwendet):
   ```json
   {
     "ConfigDialog": "gearshape.fill",
     "System": "server.rack",
     "Display": "display",
     "Memory": "memorychip",
     "Disk": "externaldrive.fill",
     "Network": "network",
     "Mouse": "computermouse",
     "Keyboard": "keyboard"
   }
   ```
   
   **Wichtig**: Die Namen müssen exakt den Apple SVG-Namen entsprechen, die im `scripts/generate-sf-symbols.ts` Script verwendet werden (z.B. `gearshape.fill`, `server.rack`, nicht `gearshape`).

2. Schema erweitern:
   ```typescript
   export interface SectionSchema {
     name: string;
     displayName: string;
     translationKey: string;
     sfSymbol: string;              // Neues Feld
     parameters: ParameterSchema[];
   }
   ```

3. Parser liest Mapping und fügt es zum Schema hinzu:
   ```typescript
   function extractSchema(rawConfig: RawConfigData): ConfigSchema {
     const symbolMapping = readSymbolMapping('backend/config-schema/section-symbols.json');
     
     const sections: Record<string, SectionSchema> = {};
     for (const section of rawConfig.sections) {
       sections[section.name] = {
         name: section.name,
         displayName: toDisplayName(section.name),
         translationKey: `configEditor.sections.${section.name}`,
         sfSymbol: symbolMapping[section.name] || 'gearshape',  // Fallback
         parameters: extractParameters(section)
       };
     }
     return { sections };
   }
   ```

4. Frontend:
   ```typescript
   <div className="flex items-center gap-2">
     <SFSymbol name={schema.sfSymbol} />
     <h3>{getTranslation(schema.translationKey)}</h3>
   </div>
   ```

---

#### **Option 2: Intelligente Heuristik (Keyword-Matching)**

Basierend auf Keywords im Sektionsnamen wird automatisch ein passendes Icon gewählt.

**Vorteile**:
- ✅ Keine manuellen Mappings nötig
- ✅ Funktioniert auch für unbekannte Sektionen
- ✅ Automatisch skalierbar

**Nachteile**:
- ❌ Kann zu unsinnigen Icons führen
- ❌ Heuristik ist schwer zu tunen
- ❌ Schwer zu dokumentieren, welches Icon warum gewählt wird

**Umsetzung**:

```typescript
function guessSymbolForSection(sectionName: string): string {
  const name = sectionName.toLowerCase();
  
  const keywords = {
    'gearshape.fill': ['config', 'dialog', 'settings', 'option'],
    'server.rack': ['system', 'machine', 'hardware'],
    'display': ['display', 'screen', 'monitor', 'video'],
    'memorychip': ['memory', 'ram', 'bank'],
    'externaldrive.fill': ['disk', 'drive', 'storage', 'ide'],
    'network': ['network', 'ethernet', 'connection'],
    'computermouse': ['mouse', 'pointer', 'input'],
    'keyboard': ['keyboard', 'key'],
  };
  
  for (const [symbol, kws] of Object.entries(keywords)) {
    if (kws.some(kw => name.includes(kw))) {
      return symbol;
    }
  }
  
  return 'gearshape.fill'; // Fallback
}
```

**Hinweis**: Die Symbol-Namen werden automatisch von `scripts/generate-sf-symbols.ts` in React-Komponenten-Namen konvertiert (z.B. `gearshape.fill` → `GearshapeFill`), sodass sie als SF-Symbol-Komponenten verwendbar sind.

---

#### **Option 3: Hybrid (Empfohlen: Mapping mit Heuristik-Fallback)**

Kombiniert Mapping mit Heuristik. Neue Sektionen bekommen automatisch Icons, bekannte Sektionen verwenden explizite Mappings.

**Umsetzung**:

```typescript
function getSectionSymbol(sectionName: string, mapping: Record<string, string>): string {
  // Check mapping first
  if (mapping[sectionName]) {
    return mapping[sectionName];
  }
  
  // Fallback zu Heuristik
  return guessSymbolForSection(sectionName);
}
```

---

#### **Option 4: Symbol-Kategorien im CFG-Comment**

Der Parser liest einen speziellen Comment aus dem CFG für das Symbol.

**Beispiel in CFG**:
```
# @symbol: gearshape.fill
# @category: Configuration
[ConfigDialog]

# @symbol: server.rack
# @category: System
[System]
```

**Nachteile**: 
- ❌ CFG-Struktur wird komplexer
- ❌ Erfordert Parsing von speziellen Comments
- ❌ User müssen CFG-Kommentare kennen

---

### Empfehlung: **Option 3 (Hybrid)**

1. `section-symbols.json` für explizite Mappings erstellen
2. Heuristik als Fallback für unbekannte Sektionen
3. Best of both worlds:
   - Bekannte Sektionen haben sinnvolle Icons
   - Neue Sektionen werden automatisch versucht zu kategorisieren
   - Fallback auf default Icon, wenn nichts passt

---

## 📋 Phase 2: Backend API erweitern

**Dauer**: ~1-2 Stunden  
**Deliverable**: `/api/config/schema` Endpoint + CFG ↔ JSON Conversion  
**Status**: ✅ Abgeschlossen

### API-Struktur

Versionierte API-Struktur für zukünftige Kompatibilität:

```
backend/
  ├── api/
  │   └── v1/
  │       ├── index.ts              (Router-Einstiegspunkt)
  │       ├── config-schema.ts       (Schema-Endpoints)
  │       └── config.ts              (Config-Read/Write-Endpoints)
  └── index.ts                        (Express Setup, Middleware, Router-Mount)
```

Express-Setup in `backend/index.ts`:
```typescript
import v1Router from './api/v1/index';

app.use('/api/v1', v1Router);  // Alle v1 Endpoints unter /api/v1/*
```

Dies ermöglicht später einfach v2, v3 etc. hinzuzufügen:
```typescript
import v1Router from './api/v1/index';
import v2Router from './api/v2/index';

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);  // Neue Version mit Breaking Changes
```

### 2.1 Schema-Endpoint (`backend/api/v1/config-schema.ts`)

```typescript
// GET /api/v1/config/schema
// Returns: ConfigSchema
router.get('/config/schema', (req, res) => {
  try {
    const schema = loadSchema();  // Cachen
    res.json(schema);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load schema' });
  }
});
```

### 2.2 Config-Converter (`backend/config-schema/converter.ts`)

```typescript
/**
 * Convert CFG file to PreviousConfig JSON
 */
export function cfgToJson(
  cfgContent: string,
  schema: ConfigSchema
): PreviousConfig {
  const raw = parseCfgFile(cfgContent);
  // Parse and validate against schema
  // Return as typed PreviousConfig
}

/**
 * Convert PreviousConfig JSON to CFG file format
 */
export function jsonToCfg(
  config: PreviousConfig,
  schema: ConfigSchema
): string {
  // Format mit Comments und Structure wie original
}
```

### 2.3 Config-Service (`backend/services/configurationService.ts`)

Anpassen:
- Import `Validator`, `Converter`
- Validierung vor `saveConfiguration()`
- Error-Handling für invalide Values

### 2.4 Tests

```typescript
describe('Config Conversion', () => {
  it('should convert CFG to JSON correctly', () => {});
  it('should convert JSON back to CFG', () => {});
  it('should validate before saving', () => {});
});
```

---

## 📋 Phase 3: Frontend UI-Komponenten

**Dauer**: ~2-3 Stunden  
**Deliverable**: Dynamische, schema-basierte Input-Komponenten  
**Status**: ❌ Nicht gestartet

### 3.1 Schema Hook (`frontend/hooks/useConfigSchema.ts`)

**WICHTIG**: Immer `apiPaths` Enum verwenden, nicht "Magic Strings"!

```typescript
import { apiPaths } from '@shared/api/constants';

export function useConfigSchema(): ConfigSchema | null {
  const [schema, setSchema] = useState<ConfigSchema | null>(null);
  
  useEffect(() => {
    // Use apiPaths enum instead of hardcoded strings
    fetch(apiPaths.ConfigSchema.get.full)
      .then(r => r.json())
      .then(setSchema);
  }, []);
  
  return schema;
}
```

**Hinweis zu `apiPaths`**:
- `apiPaths` ist die Single Source of Truth für alle API-Endpoints
- Definiert in `shared/api/constants.ts`
- Hat sowohl `.full` (für Frontend: `/api/v1/config/schema`) als auch `.relative` (für Backend Router: `/config/schema`)
- Nutzt typsichere Werte statt "Magic Strings"
- Bei Änderungen am API-Pfad muss nur `apiPaths` aktualisiert werden

**Beispiel apiPaths Struktur**:
```typescript
export const apiPaths = {
  ConfigSchema: {
    get: { full: '/api/v1/config/schema', relative: '/config/schema' }
  },
  Configuration: {
    list: { full: '/api/v1/configurations', relative: '' },
    // ... weitere Endpoints
  }
} as const;
```

### 3.2 PAConfigInput Komponente (`frontend/components/controls/PAConfigInput.tsx`)

**Struktur**: Input-Komponenten ausgelagert nach Typ

```
frontend/components/controls/
  ├── PAConfigInput.tsx                    (Main wrapper, dispatcher)
  └── config-inputs/
      ├── PABooleanInput.tsx               (Toggle für boolean)
      ├── PAEnumInput.tsx                  (Dropdown für enum)
      ├── PANumberRangeInput.tsx           (Number Input für range/number)
      └── PAStringInput.tsx                (Text Input für string)
```

**PAConfigInput.tsx** - Einstiegspunkt (Dispatcher):

```typescript
interface PAConfigInputProps {
  schema: ParameterSchema;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  disabled?: boolean;
  size?: PASize;
}

export function PAConfigInput({
  schema,
  value,
  onChange,
  disabled,
  size
}: PAConfigInputProps) {
  // Dispatcher zu typ-spezifischen Komponenten
  switch (schema.type) {
    case 'boolean':
      return (
        <PABooleanInput 
          value={value as boolean}
          onChange={onChange}
          disabled={disabled}
        />
      );
    
    case 'enum':
      return (
        <PAEnumInput 
          schema={schema}
          value={String(value)}
          onChange={onChange}
          disabled={disabled}
        />
      );
    
    case 'number':
    case 'range':
      return (
        <PANumberRangeInput 
          schema={schema}
          value={Number(value)}
          onChange={onChange}
          disabled={disabled}
          size={size}
        />
      );
    
    case 'string':
    default:
      return (
        <PAStringInput 
          value={String(value)}
          onChange={onChange}
          disabled={disabled}
          size={size}
        />
      );
  }
}
```

**PABooleanInput.tsx**:
```typescript
interface PABooleanInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function PABooleanInput({ value, onChange, disabled }: PABooleanInputProps) {
  return (
    <Toggle 
      checked={value} 
      onChange={onChange} 
      disabled={disabled} 
    />
  );
}
```

**PAEnumInput.tsx**:
```typescript
interface PAEnumInputProps {
  schema: ParameterSchema;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PAEnumInput({ 
  schema, 
  value, 
  onChange, 
  disabled 
}: PAEnumInputProps) {
  return (
    <Dropdown
      title={value}
      onSelect={(eventKey) => onChange(eventKey)}
      renderToggle={(props, ref) => (
        <Button {...props} ref={ref} block disabled={disabled}>
          <span>{value}</span>
        </Button>
      )}
    >
      {schema.possibleValues?.map((val, idx) => (
        <Dropdown.Item 
          key={val} 
          eventKey={val}
          active={value === val}
        >
          {schema.labels?.[idx] || val}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}
```

**PANumberRangeInput.tsx**:
```typescript
interface PANumberRangeInputProps {
  schema: ParameterSchema;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: PASize;
}

export function PANumberRangeInput({ 
  schema, 
  value, 
  onChange, 
  disabled, 
  size 
}: PANumberRangeInputProps) {
  return (
    <Input
      type="number"
      value={String(value)}
      onChange={(v) => onChange(parseInt(v) || 0)}
      min={schema.min}
      max={schema.max}
      disabled={disabled}
      size={size}
    />
  );
}
```

**PAStringInput.tsx**:
```typescript
interface PAStringInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size?: PASize;
}

export function PAStringInput({ 
  value, 
  onChange, 
  disabled, 
  size 
}: PAStringInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      size={size}
    />
  );
}
```

**Vorteile dieser Struktur**:
- ✅ Jede Komponente hat eine klare, einzelne Verantwortung
- ✅ Einfach zu testen (jede Komponente isoliert)
- ✅ Einfach zu erweitern (neue Typen hinzufügen)
- ✅ JSX bleibt lesbar (keine großen switch-Blöcke)
- ✅ Imports strukturiert in `config-inputs/` Folder
- ✅ Typsicherheit bei Props bleiben gewährleistet

### 3.3 PAConfigFieldPartial (`frontend/components/partials/config-editor/PAConfigFieldPartial.tsx`)

```typescript
interface PAConfigFieldPartialProps {
  schema: ParameterSchema;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  error?: string;
  size?: PASize;
  translation: Translations;              // For dynamic label translation
}

export function PAConfigFieldPartial({
  schema,
  value,
  onChange,
  error,
  size,
  translation
}: PAConfigFieldPartialProps) {
  // Retrieve translated label from translation key, fallback to parameter name
  // Retrieve translated label from translation key, fallback to parameter name
  const label = getTranslation(translation, schema.translationKey) || schema.name;
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <PAConfigInput 
        schema={schema} 
        value={value} 
        onChange={onChange} 
        size={size}
      />
      {/* Infobox mit "Meaning" Text (schema.description) */}
      <div className="text-xs text-[var(--rs-text-secondary)] bg-[var(--rs-bg-active)] px-2 py-1 rounded">
        {schema.description}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

/**
 * Helper: Nested Translation abrufen
 * Z.B. translationKey = "configEditor.parameters.bShowConfigDialogAtStartup"
 */
function getNestedTranslation(obj: any, path: string): string | undefined {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
}
```

**⚠️ WICHTIG - Utility Separation**: Diese Funktion gehört NICHT in die Komponente!

**Korrekte Platzierung**: `frontend/lib/utils/translation.ts` (neue Datei):

```typescript
/**
 * Translation utilities for accessing nested translation objects
 * Centralized place for all translation-related helper functions
 */

import type { Translations } from '../translations';

/**
 * Get nested translation value from translation object
 * 
 * Safely retrieves values from nested translation objects using dot notation.
 * Returns undefined if path not found, allowing for fallback values.
 * 
 * @param obj Translation object (typically the Translations interface)
 * @param path Dot-separated path (e.g., "configEditor.parameters.bShowConfigDialogAtStartup")
 * @returns Translation string or undefined if not found
 * 
 * @example
 * getTranslation(translation, 'configEditor.parameters.bShowConfigDialogAtStartup')
 * // Returns: "Show configuration dialog at startup" (or undefined)
 */
export function getTranslation(obj: Translations, path: string): string | undefined {
  return path.split('.').reduce((curr: any, prop) => curr?.[prop], obj);
}

/**
 * Get translation with fallback
 * 
 * Retrieves translation and provides a fallback if not found.
 * Useful for ensuring a string is always returned.
 * 
 * @param obj Translation object
 * @param path Dot-separated path
 * @param fallback Fallback string if translation not found
 * @returns Translation string or fallback
 */
export function getTranslationOrFallback(
  obj: Translations,
  path: string,
  fallback: string
): string {
  return getTranslation(obj, path) || fallback;
}
```

**Integration in `frontend/lib/utils/index.ts`**:
```typescript
// Export translation utilities
export * from './translation';
```

**Im Component dann verwenden**:
```typescript
import { getTranslation } from '@/lib/utils/translation';

// Im Component:
const label = getTranslation(translation, schema.translationKey) || schema.name;
```

**Naming Convention für Utility-Dateien**:
- `color.ts`: Farbmanipulation (Parse, Convert, Adjust)
- `file.ts`: Datei-I/O-Utilities (Download, Export)
- `palette.ts`: Palette-Berechnung
- `styling.ts`: UI/CSS-bezogene Utilities (Shadows, Transitions, Theming)
- `translation.ts`: **NEU** - Translation-Zugriff und -Transformation

### 3.4 PAConfigSectionPartial (`frontend/components/partials/config-editor/PAConfigSectionPartial.tsx`)

```typescript
interface PAConfigSectionPartialProps {
  section: SectionSchema;
  values: Record<string, any>;
  onChange: (paramName: string, value: any) => void;
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  icon?: ReactNode;
  size?: PASize;
  translation: Translations;            // For label translations
}

export function PAConfigSectionPartial({
  section,
  values,
  onChange,
  expanded,
  onToggle,
  icon,
  size,
  translation
}: PAConfigSectionPartialProps) {
  return (
    <PACard
      header={
        <div 
          className="cursor-pointer flex items-center gap-2"
          onClick={() => onToggle(!expanded)}
        >
          {icon && <span>{icon}</span>}
          <span>{section.name}</span>
          <SFChevronDown 
            size={16} 
            className={`transform transition ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      }
    >
      {expanded && (
        <div className="space-y-4">
          {section.parameters.map(param => (
            <PAConfigFieldPartial
              key={param.name}
              schema={param}
              value={values[param.name]}
              onChange={(val) => onChange(param.name, val)}
              size={size}
              translation={translation}  // For label translation
            />
          ))}
        </div>
      )}
    </PACard>
  );
}
```

### 3.5 Tests

```typescript
describe('PAConfigInput', () => {
  it('should render Toggle for boolean type', () => {});
  it('should render Dropdown for enum type', () => {});
  it('should render number Input for number type', () => {});
});
```

---

## 📋 Phase 4: Frontend Integration

**Dauer**: ~2-3 Stunden  
**Deliverable**: Refactored Editor mit dynamischem Layout  
**Status**: ❌ Nicht gestartet

### 4.1 Translation-Integration

Die neuen `translationKey`-Werte folgen dem Muster:
```
configEditor.parameters.{originalParameterName}
```

Zu `frontend/lib/translations/de.ts` müssen Einträge hinzugefügt werden:
```typescript
export const translations = {
  // ...
  configEditor: {
    parameters: {
      bShowConfigDialogAtStartup: 'Konfigurationsdialog beim Start anzeigen',
      nMachineType: 'Maschinentyp',
      nMemoryBankSize0: 'Speichergröße Bank 0',
      bColor: 'Farbe',
      bTurbo: 'Turbo-Modus',
      // ... etc. for all parameters
    },
    sections: {
      ConfigDialog: 'Konfigurationsdialog',
      System: 'System',
      Screen: 'Bildschirm',
      // ... etc.
    },
    // ... rest
  }
};
```

Gleiches für `en.ts`, `es.ts`, `fr.ts`, `it.ts`.

**Hinweis**: Dies kann später auch **automatisch generiert** werden aus dem Schema mit einem Fallback-Modus.

### 4.2 PAEditorViewPartial refactorn

Alte Version:
```tsx
// Hardcoded Sections
<EditorSectionPartial title="System">
  <EditorFieldPartial label="CPU Type">
    <Dropdown>...</Dropdown>
  </EditorFieldPartial>
  // ... 20+ more hardcoded fields
</EditorSectionPartial>
```

Neue Version:
```tsx
const schema = useConfigSchema();

return (
  <div className="grid gap-4">
    {schema?.sections && Object.values(schema.sections).map(section => (
      <PAConfigSectionPartial
        key={section.name}
        section={section}
        values={configData[section.name] || {}}
        onChange={(paramName, value) => 
          updateConfigField([section.name, paramName], value)
        }
        expanded={expandedSections[section.name] || false}
        onToggle={(expanded) => 
          setExpandedSections(prev => ({
            ...prev,
            [section.name]: expanded
          }))
        }
        size={controlSize}
        translation={translation}  // Für Label-Übersetzung
      />
    ))}
  </div>
);
```

### 4.3 useConfigEditor Hook anpassen

```typescript
// Old structure (nested):
configData.system.cpu_type

// Remains the same, only add validation with schema
const validateAndUpdate = (path: string[], value: any) => {
  const schema = useConfigSchema();
  const validation = validateConfigValue(
    path[0],
    path[1],
    value,
    schema
  );
  
  if (validation.valid) {
    updateConfigField(path, value);
  } else {
    showError(validation.error);
  }
};
```

---

## 📋 Phase 5: Testing & Polishing

**Dauer**: ~1-2 Stunden  
**Deliverable**: Fehlerfreier Build, alle Tests grün, Linter clean  
**Status**: ❌ Nicht gestartet

### 5.1 Validierungschecklist

```bash
# Frontend Tests
npm run test:frontend

# Backend Tests
npm run test:backend

# Alle Tests
npm run test

# Type Checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Visual Check (lokal starten)
npm run dev
# + npm run backend
```

### 5.2 Fehlerbehebung

Bei Fehlern:
- ESLint-Warnings fixen
- TypeScript-Fehler beheben
- Test-Failures debuggen
- Build-Fehler adressieren

### 5.3 Abschluss-Checklist

- ✅ Alle Tests grün
- ✅ Linter clean (0 warnings)
- ✅ Build erfolgreich
- ✅ Keine TypeScript-Fehler
- ✅ Funktionale Tests im Browser
- ✅ Config speichern/laden funktioniert
- ✅ UI responsive auf allen Größen
- ✅ Validierung funktioniert

---

## 🚀 Workflow Pro Phase

### Allgemeiner Workflow
```bash
# 1. Code schreiben
# 2. Tests ausführen
npm run test

# 3. Type Checking
npm run typecheck

# 4. Linting
npm run lint

# 5. Build
npm run build

# 6. Lokal testen
npm run dev
npm run backend  # in separate terminal

# 7. Wenn alles ok → User committed
# 8. Nächste Phase starten
```

### Bei Fehlern
```bash
# Fehler anschauen
npm run lint -- --fix  # Auto-fixes
npm run test -- --watch  # Watch-mode für schnelles Iterieren

# TypeScript-Fehler debuggen
npm run typecheck

# Oder direkt mit Browser Dev Tools testen
```

---

## 📊 Erfolgsmessungen

### Nach Phase 1
- [ ] Parser testet CFG-Dateien korrekt
- [ ] Schema wird aus CFG extrahiert
- [ ] `schema.json` ist valide
- [ ] Alle Unit-Tests grün

### Nach Phase 2
- [ ] GET `/api/v1/config/schema` liefert Schema
- [ ] Validierung vor Save funktioniert
- [ ] CFG ↔ JSON Konvertierung korrekt
- [ ] Backend-Tests grün

### Nach Phase 3
- [ ] UI-Komponenten rendern dynamisch
- [ ] Toggle/Dropdown/Input zeigen richtige Kontrollen
- [ ] Value-Änderungen funktionieren
- [ ] Frontend-Tests grün

### Nach Phase 4
- [ ] Editor zeigt alle Schema-Sektionen
- [ ] Hardcoded Sections entfernt
- [ ] Speichern/Laden funktioniert
- [ ] Validierungsfehler angezeigt

### Nach Phase 5
- [ ] Build fehlerfrei
- [ ] Linter clean
- [ ] Alle Tests grün
- [ ] Produktionsreif

---

## 📝 Notizen

### Wichtige Datei-Verschiebungen
```bash
# Old
default_for_admin.cfg (Root)

# New
backend/config-schema/reference.cfg
```

### Neue Dependencies
Keine neuen NPM-Dependencies nötig. Alles mit TypeScript + existenden Libraries.

### Breaking Changes
Keine geplanten Breaking Changes. Bestehende Funktionalität bleibt erhalten.

### Zukunftserweiterungen
- Custom UI-Hint-System (z.B. "slider" für Range)
- Conditional Fields (Parameter A zeigt Parameter B nur wenn...)
- Import/Export UI
- Config-Comparison Tool

---

## 🤔 Fragen während Implementation

Bei Unklarheiten während der Implementierung:
1. Diese Datei aktualisieren
2. Fragen stellen
3. Plan anpassen falls nötig
4. Weitermachen

---

**Erstellt**: 4. Januar 2026  
**Status**: Planning  
**Nächster Schritt**: Phase 1 starten
