# Commit Message erstellen

Erstelle eine kompakte Commit Message auf Englisch für die Änderungen seit dem letzten Commit.

## Anweisungen

1. Führe `git status` aus um geänderte Dateien zu identifizieren
2. Führe `git diff` aus um die konkreten Änderungen zu sehen
3. Analysiere die Änderungen und deren Zweck
4. Erstelle eine Commit Message mit:
   - **Headline**: Prägnante Zusammenfassung (max. 50 Zeichen)
   - **Body**: Ungeordnete Liste der wichtigsten Änderungen

## Format

Gib die Message als Plain Text in einem Code-Block aus:

```
feat/fix/refactor/docs/chore: Kurze Beschreibung

- Änderung 1
- Änderung 2
- Änderung 3
```

**WICHTIG**: Nur kürzlich geänderte Dateien einbeziehen. Keine technischen Details die für den Commit irrelevant sind.
