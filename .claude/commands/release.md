# Release Notes erstellen

Erstelle prägnante, nicht-technische Release Notes auf Englisch für die Änderungen seit dem letzten Release.

## Anweisungen

1. Ermittle die aktuelle Version aus `package.json`
2. Hole den letzten Release-Tag von GitHub: `gh release list --limit 1`
3. Vergleiche die Änderungen: `git log {LAST_TAG}..HEAD --oneline`
4. Optional: Prüfe detaillierte Änderungen auf GitHub:
   `https://github.com/LAYEREDwork/previous-admin/compare/{OLD_TAG}...{NEW_TAG}`

## Format

Gib die Release Notes als Markdown in einem Code-Block aus:

```markdown
## Version X.Y.Z

### Neue Features
- Feature 1
- Feature 2

### Verbesserungen
- Verbesserung 1
- Verbesserung 2

### Fehlerbehebungen
- Fix 1
- Fix 2
```

**WICHTIG**:
- Kein Techno-Babble — verständlich für Endbenutzer
- Thematisch gruppieren mit klaren Überschriften
- Nur relevante Änderungen für Benutzer (keine internen Refactorings)
