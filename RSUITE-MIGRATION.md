# RSUITE-MIGRATION.md

## Umsetzungsplan: Migration zu RSuite Controls mit Light/Dark Mode

### Ziele
- Alle Custom Controls durch Standard RSuite Controls ersetzen
- Light und Dark Mode mit RSuite Themes implementieren
- RSuite Default-Farben verwenden
- Noise Texture entfernen
- Nicht benötigte Controls und Elemente entfernen
- Dokumentation aktualisieren
- DRY-Prinzip strikt einhalten

### Aktuelle Situation
**Custom Controls (frontend/components/controls/):**
- PAButton.tsx (neu, 3D-Style)
- PACard.tsx (neu, 3D-Style)
- PAEmptyView.tsx
- PAIconButton.tsx
- PAInput.tsx (neu, 3D-Style)
- PALanguageSwitcher.tsx
- PAModal.tsx
- PANeXTLogo.tsx
- PANeomorphButton.tsx
- PANeomorphDropdown.tsx
- PANeomorphDropdownMenu.tsx
- PANeomorphSegmentedControl.tsx
- PASegmentedControl.tsx (aktualisiert, 3D-Style)
- PASwitch.tsx (neu, 3D-Style)

**Verwendungen:**
- PAAboutPage.tsx: PAButton, PAInput, PACard, PASegmentedControl, PASwitch
- Verschiedene Partials: PAButton, PAInput, PACard, PASwitch, PAModal, etc.

**Dokumentation:**
- docs/BESCHREIBUNG.en.md
- docs/BESCHREIBUNG.md
- docs/SCREENSHOTS.md
- README.md

### Schritt-für-Schritt Plan

#### Phase 1: Vorbereitung
1. **RSuite Theme Setup**
   - CustomProvider mit theme="auto" oder "dark" konfigurieren
   - Light/Dark Mode Toggle implementieren
   - RSuite CSS-Variablen für Farben verwenden

2. **CSS Bereinigung**
   - 3D-Styles (embossed-shadow, recessed-shadow) entfernen
   - Custom Control CSS entfernen (pa-button, pa-input, etc.)
   - Noise Texture aus index.css entfernen
   - RSuite-only Styles behalten

#### Phase 2: Control Migration
3. **Button Migration**
   - PAButton.tsx -> rsuite Button
   - Alle Verwendungen aktualisieren
   - Props mapping: size -> size, appearance -> appearance, etc.

4. **Input Migration**
   - PAInput.tsx -> rsuite Input
   - Verwendungen aktualisieren

5. **Card Migration**
   - PACard.tsx -> rsuite Panel
   - Verwendungen aktualisieren

6. **Switch Migration**
   - PASwitch.tsx -> rsuite Toggle
   - Verwendungen aktualisieren

7. **Segmented Control Migration**
   - PASegmentedControl.tsx -> rsuite ButtonGroup oder Nav
   - Verwendungen aktualisieren

8. **Andere Controls**
   - PAIconButton -> rsuite IconButton
   - PAModal -> rsuite Modal
   - PALanguageSwitcher behalten oder migrieren
   - PANeXTLogo behalten

#### Phase 3: Bereinigung
9. **Entfernen ungenutzter Controls**
   - Alle 3D-Style Controls löschen
   - Neomorph Controls löschen (falls nicht verwendet)
   - Unused Imports entfernen

10. **Code Cleanup**
    - DRY-Prinzip anwenden
    - Konsistente Props verwenden
    - TypeScript Types aktualisieren

#### Phase 4: Dokumentation
11. **Dokumentation aktualisieren**
    - BESCHREIBUNG.md: Entfernen 3D-Style Referenzen, RSuite erwähnen
    - SCREENSHOTS.md: Neue Screenshots mit RSuite Design
    - README.md: Setup und Features aktualisieren

#### Phase 5: Testing
12. **Qualitätssicherung**
    - Nach jedem Schritt: npm run lint && npm run typecheck && npm run build
    - Fehler selbstständig beheben
    - Funktionalität testen

### Fragen
- [1] Beides. Beim Erstaufruf soll automatisch eingestellt werden. Der Switch zum manuellen Umschalten bekommt drei Optionen: Light, System, Dark ✅
- [2] `SegmentedControl` ✅
- [3] Ja, `Toggle` verwenden ✅
- [4] alle entfernen und durch RSuite Controls ersetzen ✅
- [5] erstmal Default Farbe, evtl. gibt es im Anschluss noch Anpassungen ✅

### Risiken
- Breaking Changes bei Props-Mapping
- Theme-Kompatibilität
- Performance-Impact durch RSuite

### Erfolgskriterien
- Keine Custom 3D-Controls mehr
- Light/Dark Mode funktioniert
- Build erfolgreich ohne Fehler
- Dokumentation aktuell
- DRY eingehalten