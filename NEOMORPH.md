# Neomorph Components Refactoring Plan

Dieser Plan beschreibt die Vereinheitlichung der neomorphen Components `PANeomorphButton`, `PANeomorphDropdown` und `PANeomorphSegmentedControl`. Die gemeinsame Logik für Frame, Ring und embossed/recessed Bereiche wird extrahiert, um Wiederverwendbarkeit zu ermöglichen und zukünftige neomorphe Controls zu erleichtern.

## Schritt 1: Analyse der aktuellen Components

Analyse der drei Components:

### PANeomorphButton
- **Frame**: Äußerer recessed Bereich mit Schatten für Tiefe.
- **Ring**: Optionaler Ring um den Button herum.
- **Button**: Innerer embossed Bereich mit erhöhten Schatten.
- Verwendet `computePalette` für Farben basierend auf `baseColor`.
- Höhe basiert auf `size: PASize`.
- Form: `PANeomorphControlShape.rect` oder `.pill`.

### PANeomorphDropdown
- **Popover**: Äußerer Container (ähnlich Frame).
- **Div**: Innerer Bereich mit recessed/embossed Effekten.
- Verwendet `computePalette` für Hintergrundfarbe.
- Hat inset-Schatten für embossed Look.
- Höhe ist dynamisch, aber ähnliche Logik.

### PANeomorphSegmentedControl
- **Äußerer Container**: Recessed Frame mit inset-Schatten.
- **Aktiver Slider**: Embossed Bereich mit erhöhten Schatten.
- Verwendet `computePalette` und berechnet zusätzliche Farben.
- Höhe basiert auf `size`.
- Form: `PANeomorphControlShape.pill` oder `.rect`.

**Gemeinsamkeiten:**
- Alle berechnen eine Palette mit `computePalette(baseColor)` (fallback: Website-Hintergrundfarbe).
- Alle haben Schatten für Licht und Schatten (embossed: hell oben-links, dunkel unten-rechts; recessed: umgekehrt).
- Alle skalieren mit `size` für Höhe.
- Alle unterstützen `shape` für rect oder pill.
- Alle verwenden `PATexture.fineNoise` für Textur.
- Duplizierte Logik für Corner-Radii, Schatten-Berechnungen.

## Schritt 2: Probleme mit der aktuellen Implementierung

- **Duplikation**: Schatten-Berechnungen, Farb-Anpassungen, Höhen/Radii sind in jeder Component wiederholt.
- **Inkonsistenz**: Zum Beispiel verwendet Button komplexe Schatten, Dropdown einfache inset, SegmentedControl mischt beides.
- **Schwierige Erweiterung**: Neue Controls müssten die Logik neu implementieren.
- **Parameter**: Nicht alle verwenden die gleichen konfigurierbaren Breiten (frameWidth, ringWidth, buttonBorderWidth).

## Schritt 3: Geplanter Refactoring-Ansatz

Die gemeinsame Logik wird in eine wiederverwendbare Utility-Funktion extrahiert. Diese Funktion berechnet alle notwendigen Styles basierend auf den Parametern.

### Neue Utility-Funktion: `computeNeomorphControlStyle`

**Standort:** `frontend/lib/utils/styling.ts` (neben `containerHeightsPixel` etc.)

**Parameter:**
- `size: PASize` - Bestimmt die Gesamthöhe des Controls.
- `shape: PANeomorphControlShape` - `.rect` oder `.pill`.
- `baseColor?: string` - Optionale Basis-Farbe; default die Hintergrundfarbe der Website.
- `color?: string` - Optionale Farbe für den Ring; default `palette.frameBackground` (recessed Background).
- `frameWidth: number = 2` - Breite des äußeren Frames.
- `ringWidth: number = 1` - Breite des Rings (immer vorhanden).
- `buttonBorderWidth: number = 2` - Breite des inneren Buttons/Rands.

**Rückgabe:** Ein Objekt vom Typ `PANeomorphControlStyle`:
```typescript
interface PANeomorphControlStyle {
  frame: React.CSSProperties;  // Für äußeren recessed Container
  ring: React.CSSProperties;   // Für Ring
  button: React.CSSProperties; // Für inneren embossed Bereich
  palette: Palette;            // Die berechnete Farb-Palette
}
```

**Logik der Funktion:**
1. **Palette berechnen:** `computePalette(baseColor || websiteBackgroundColor)`
2. **Höhe und Radii:**
   - `height = containerHeightsPixel[size]`
   - `cornerRadius = shape === 'pill' ? height / 2 : height / 4`
3. **Schatten für recessed (Frame):**
   - `inset frameWidth px frameWidth px shadowBlur px frameShadowDark`
   - `inset -frameWidth px -frameWidth px shadowBlur px frameShadowLight`
4. **Ring-Styles:** Immer vorhanden, backgroundColor = color || palette.frameBackground
5. **Schatten für embossed (Button):**
   - `-buttonBorderWidth px -buttonBorderWidth px shadowBlur px buttonShadowLight`
   - `buttonBorderWidth px buttonBorderWidth px shadowBlur px buttonShadowDark`
6. **Farben:** Verwende Palette für backgroundColor, etc.
7. **Texture:** Verwende `PATexture.fineNoise` für alle Controls.

**Begründung für diese Struktur:**
- **Frame:** Immer recessed, für den äußeren Container.
- **Ring:** Immer vorhanden, mit konfigurierbarer Farbe für Hervorhebung.
- **Button:** Immer embossed, für interaktive Bereiche.
- **Texture:** Alle Controls verwenden `PATexture.fineNoise` für konsistente Textur.
- Dies deckt alle drei Components ab und ermöglicht Flexibilität.

## Schritt 4: Anpassung der Components

### PANeomorphButton
- Verwende `computeNeomorphControlStyle(size, shape, baseColor, color, frameWidth, ringWidth, buttonBorderWidth)`
- Äußeres div: `...styles.frame`
- Ring div: `...styles.ring` (immer vorhanden)
- Button: `...styles.button`
- Entferne duplizierte Logik für Schatten, Höhen, etc.

### PANeomorphDropdown
- Refaktoriere zu einem `PANeomorphButton` als Toggle.
- Erstelle neue Component `PANeomorphDropdownMenu` für das Menü.
- Verwende `computeNeomorphControlStyle` für das Menü-Styles.
- Da kein Ring/Button, verwende `frame` für recessed Container im Menü.
- Passe an für Popover-Styles.

### PANeomorphDropdownMenu
- Neue Component für das Dropdown-Menü.
- Verwendet `computeNeomorphControlStyle` für recessed Container.
- Items als embossed Buttons.

**Vorteile:**
- Weniger Code-Duplikation.
- Konsistente Schatten und Farben.
- Einfache Anpassung von Breiten.
- Neue Controls können die Funktion direkt verwenden.

## Schritt 5: Implementierungsreihenfolge

1. **Erstelle `computeNeomorphControlStyle` in `styling.ts`** mit aussagekräftigen JSDoc-Kommentaren.
2. **Teste die Funktion** mit Unit-Tests.
3. **Refaktoriere PANeomorphButton** als erstes, da es das komplexeste ist; füge JSDoc-Kommentare hinzu.
4. **Erstelle `PANeomorphDropdownMenu`** mit JSDoc-Kommentaren.
5. **Refaktoriere PANeomorphDropdown** unter Verwendung von `PANeomorphButton` und `PANeomorphDropdownMenu`; füge JSDoc-Kommentare hinzu.
6. **Refaktoriere PANeomorphSegmentedControl**; füge JSDoc-Kommentare hinzu.
7. **Führe Integrationstests durch** und passe an.
8. **Aktualisiere Dokumentation** und füge Beispiele hinzu.
9. **Füge JSDoc-Kommentare hinzu** zu allen neuen und refaktorierten Komponenten, Funktionen und Interfaces.

## Schritt 6: Potenzielle Herausforderungen

- **Unterschiedliche Anforderungen:** SegmentedControl hat einen Slider, der sich bewegt – stelle sicher, dass die Styles kompatibel sind.
- **Performance:** Stelle sicher, dass die Berechnungen effizient sind (memoization falls nötig).
- **Backward Compatibility:** Halte bestehende Props bei, aber vereinheitliche interne Logik.
- **Testing:** Schreibe Tests für die neue Funktion und aktualisiere Component-Tests.

## Schritt 7: Zukünftige Vorteile

Mit dieser refaktorierten Logik können neue neomorphe Controls schnell erstellt werden, indem `computeNeomorphControlStyle` aufgerufen und die zurückgegebenen Styles angewendet werden. Dies fördert Code-Reuse und Konsistenz im Design-System.</content>
<parameter name="filePath">/Users/phranck/Sites/previous-admin/NEOMORPH.md