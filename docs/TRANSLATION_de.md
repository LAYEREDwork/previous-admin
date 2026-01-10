# Translation-Keys Generierung

## Übersicht

Das Script `scripts/generate-translation-keys.ts` automatisiert die Verwaltung von Übersetzungsschlüsseln für den Config-Editor. Es sorgt dafür, dass alle erforderlichen Übersetzungen in allen unterstützten Sprachen (Deutsch, Englisch, Spanisch, Französisch, Italienisch) konsistent gepflegt werden.

## Zweck und Verwendung

### Wozu werden Translation-Keys benötigt?

Translation-Keys sind eindeutige Identifikatoren für übersetzbare Textelemente im Previous Admin Config-Editor. Sie werden verwendet um:

- **Konfigurationssektion zu kennzeichnen**: Jede Sektion (z.B. "General", "Network", "Advanced") hat einen eigenen Translation-Key
- **Konfigurationsparameter zu kennzeichnen**: Jeder Parameter (z.B. "Port", "Timeout", "Debug Mode") hat einen eigenen Translation-Key
- **Mehrsprachige UI zu unterstützen**: Die Keys ermöglichen die zentrale Verwaltung von Übersetzungen für alle Sprachen

### Wo werden die Keys verwendet?

1. **Im Config-Editor Frontend** (`frontend/components/partials/config-editor/`)
   - Beim Rendern von Sektionsnamen
   - Beim Anzeigen von Parameternamen
   - Bei der Hilfe und Beschreibungen von Konfigurationsoptionen

2. **In den Übersetzungsdateien** (`frontend/lib/i18n/locales/`)
   - `de.ts` - Deutsche Übersetzungen
   - `en.ts` - Englische Übersetzungen
   - `es.ts` - Spanische Übersetzungen
   - `fr.ts` - Französische Übersetzungen
   - `it.ts` - Italienische Übersetzungen

3. **Im Runtime-Code**
   - Übersetzungen werden zur Laufzeit nachgeschlagen
   - Die UI rendert die übersetzten Texte basierend auf der aktuellen Spracheinstellung

## Wie funktioniert die Generierung?

### Ablauf

```
┌─────────────────────────────────────────────────────────┐
│ 1. Schema laden (schema.json)                           │
│    - Liest alle Sections und ihre Parameter             │
│    - Extrahiert translationKey Properties               │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Erforderliche Keys bestimmen                         │
│    - Erstellt Liste aller benötigten Translations-Keys  │
│    - Separiert nach Sections und Parameters             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Für jede Sprache:                                    │
│    a) Bestehende Übersetzung laden                      │
│    b) Keys mergen (neue Keys hinzufügen)                │
│    c) Aktualisierte Datei speichern                     │
└─────────────────────────────────────────────────────────┘
```

### Detaillierte Erklärung der Funktionen

#### `loadSchema(): ConfigSchema`

Liest die `schema.json` Datei und parsed sie zu einem TypeScript-Objekt. Die Schema enthält die vollständige Struktur aller Konfigurationssektionen und Parameter.

```typescript
// Schema-Struktur beispiel:
{
  sections: {
    general: {
      name: "General",
      translationKey: "sections.general",
      parameters: [
        {
          name: "Port",
          translationKey: "parameters.port"
        }
      ]
    }
  }
}
```

#### `getRequiredTranslationKeys(schema: ConfigSchema)`

Extrahiert alle Translation-Keys aus dem Schema:

- Iteriert über alle Sektionen
- Sammelt `translationKey` aus jeder Sektion
- Iteriert über alle Parameter in jeder Sektion
- Sammelt `translationKey` aus jedem Parameter
- Gibt ein strukturiertes Objekt zurück mit getrennten Sections und Parameters

**Rückgabewert:**
```typescript
{
  sections: {
    "sections.general": "General",
    "sections.network": "Network",
    // ... weitere Sections
  },
  parameters: {
    "parameters.port": "Port",
    "parameters.timeout": "Timeout",
    // ... weitere Parameter
  }
}
```

#### `loadTranslations(language: Language): TranslationStrings`

Lädt die bestehende Übersetzungsdatei für eine Sprache:

1. Liest die TypeScript-Datei (z.B. `de.ts`)
2. Nutzt Regex um das Export-Objekt zu extrahieren
3. Evaluiert das JavaScript-Objekt sicher (appName wird injiziert)
4. Gibt das geparsed Objekt zurück

**Warum wird `eval()` verwendet?**
- Die Übersetzungsdateien verwenden `appName` als Template-Variable
- `eval()` wird mit kontrolliertem Kontext ausgeführt (nur `appName` wird injiziert)
- Dies ist sicher, da der Code von uns selbst generiert wird

#### `mergeTranslationKeys(existing, requiredKeys)`

Merged neue Keys in die bestehenden Übersetzungen:

1. Deep-Copy der bestehenden Übersetzungen
2. Stelle sicher, dass die `configEditor.sections` und `configEditor.parameters` Struktur existiert
3. Für jeden erforderlichen Key:
   - Wenn der Key noch nicht existiert → füge ihn mit dem Default-Wert hinzu
   - Wenn der Key existiert → behalte die bestehende Übersetzung
4. Gibt das aktualisierte Objekt zurück

**Wichtig:** Bestehende Übersetzungen werden niemals überschrieben. Es werden nur neue Keys hinzugefügt.

#### `saveTranslations(language: Language, translations: TranslationStrings)`

Speichert die aktualisierten Übersetzungen zurück in die Datei:

1. Erzeugt die Import-Statements neu
2. Konvertiert das Übersetzungsobjekt zu formatiertem TypeScript-Code
3. Schreibt die komplette Datei mit korrekter Formatierung
4. Escape-Sequenzen werden korrekt behandelt (Anführungszeichen, Backslashes, Newlines)

### Struktur der Übersetzungsdateien

Die Übersetzungsdateien haben eine spezifische Struktur:

```typescript
import { appName } from '../../constants';
import { Translations } from '.';

export const de: Translations = {
  appName: 'Previous Admin',
  common: {
    // ... gemeinsame Übersetzungen
  },
  configEditor: {
    sections: {
      'sections.general': 'Allgemein',
      'sections.network': 'Netzwerk',
      // ... weitere Sections
    },
    parameters: {
      'parameters.port': 'Port',
      'parameters.timeout': 'Timeout',
      // ... weitere Parameter
    }
  }
};
```

## Woher stammen die ursprünglichen Texte?

### Quellen der Übersetzungen

1. **Schema-Default-Werte**
   - Wenn ein neuer Translation-Key generiert wird, wird der Display-Name oder Parameter-Name aus dem Schema als Default-Text verwendet
   - Dies ist meist der englische Name (z.B. "Port", "Timeout")
   - Diese Defaults sind Platzhalter - sie sollten von echten Übersetzungen ersetzt werden

2. **Bestehende manuelle Übersetzungen**
   - Nach der Generierung sollten alle Texte von Muttersprachlern überprüft und korrekt übersetzt werden
   - Die Übersetzungen werden manuell in den Language-Dateien gepflegt
   - Mit jeder Ausführung des Scripts werden nur neue Keys hinzugefügt, niemals existierende Übersetzungen überschrieben

3. **Schema-Struktur**
   - Die Sektionen und Parameter kommen aus `schema.json`
   - Diese wird von `scripts/build/schema.sh` automatisch generiert
   - Die Schema wird aus `backend/config-schema/reference.cfg` generiert
   - Die `reference.cfg` ist die authoritative Quelle aller Konfigurationsoptionen

## Die Generierungskette: Von Config zu Übersetzungen

Es gibt eine wichtige Abhängigkeitskette, die verstanden werden sollte:

```
┌─────────────────────────────────────────────────────────────────┐
│ reference.cfg (Quelle aller Config-Optionen)                   │
│ - Sektionen und Parameter definiert                            │
│ - Symbol-Mappings definiert                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
           npm run generate:schema
           scripts/build/schema.sh
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ schema.json (Auto-generiert)                                   │
│ - Strukturiertes JSON aus reference.cfg                        │
│ - Includes translationKey Properties                           │
│ - Input für Translation-Key-Generierung                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
             npm run generate-translation-keys
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ {de,en,es,fr,it}.ts (Übersetzungsdateien)                      │
│ - Translation-Keys automatisch synchronisiert                  │
│ - Neue Keys erhalten Default-Werte aus Schema                 │
│ - Bestehende Übersetzungen bleiben erhalten                   │
└─────────────────────────────────────────────────────────────────┘
```

### Wichtig für die Wartung

Wenn neue Konfigurationsoptionen zur Previous Config hinzugefügt werden:

1. **Zuerst**: `reference.cfg` aktualisieren (Sektionen/Parameter hinzufügen)
2. **Dann**: `npm run generate:schema` ausführen (schema.json wird regeneriert)
3. **Danach**: `npm run generate-translation-keys` ausführen (Translation-Keys werden synchronisiert)

Dies stellt sicher, dass alle Teile des Systems synchronisiert bleiben.

## Verwendung

### Script ausführen

```bash
npm run generate-translation-keys
```

### Output

Das Script gibt einen Überblick über die Generierung:

```
🔄 Generating translation keys...

✅ Schema loaded
✅ Found 17 sections and 143 parameters

Processing de...
  ✅ Updated de.ts
Processing en...
  ✅ Updated en.ts
Processing es...
  ✅ Updated es.ts
Processing fr...
  ✅ Updated fr.ts
Processing it...
  ✅ Updated it.ts

✅ Translation keys generation completed!
```

## Best Practices

### Für Entwickler

1. **Nach neuen Config-Optionen**: Wenn neue Sections oder Parameter in die Schema hinzugefügt werden, danach `npm run generate-translation-keys` ausführen
2. **Vor Release**: Immer vor einem Release das Script ausführen, um sicherzustellen, dass alle Keys aktuell sind
3. **Nicht manuell bearbeiten**: Bearbeite nicht die Auto-Generated Sections/Parameters in den Übersetzungsdateien - diese werden beim nächsten Lauf überschrieben

### Für Übersetzer

1. **Nur manuelle Felder ändern**: Übersetzer sollten nur die Übersetzungstext (die Werte) ändern, nicht die Keys
2. **Alle Sprachen aktuell halten**: Wenn eine Übersetzung aktualisiert wird, sollten alle 5 Sprachversionen aktualisiert werden
3. **Konsistenz**: Verwende konsistente Begriffe über alle Übersetzungen hinweg (z.B. "Port" sollte in allen Sprachen konsistent übersetzt werden)

## Technische Details

### Dateiformat

- **Input**: `shared/previous-config/schema.json`
- **Input**: `frontend/lib/i18n/locales/{language}.ts` (für jede Sprache)
- **Output**: `frontend/lib/i18n/locales/{language}.ts` (aktualisiert)

### Abhängigkeiten

Das Script nutzt nur Standard-Node.js APIs:
- `fs` - Dateisystem
- `path` - Pfadverwaltung
- `fileURLToPath` - URL-zu-Pfad-Konvertierung für ES-Module

### Performance

- Script-Laufzeit: ~100-200ms (abhängig von Anzahl der Keys und Dateigröße)
- Keine externen HTTP-Anfragen
- Alle Operationen sind synchron (bewusste Entscheidung für einfache Wartung)

## Fehlerbehandlung

Das Script behandelt Fehler pro Sprache:

- Wenn eine Sprache nicht verarbeitet werden kann, wird ein Fehler angezeigt
- Andere Sprachen werden trotzdem weiterverarbeitet
- Ungültige Übersetzungsdateien führen zu einer klaren Fehlermeldung
