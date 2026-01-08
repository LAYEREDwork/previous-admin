# Architektur-Zusammenfassung

Erstelle eine kurze Zusammenfassung der Projektarchitektur.

## Anweisungen

1. Beschreibe die Hauptkomponenten (Frontend, Backend, Database)
2. Erkläre die Kommunikation zwischen den Komponenten
3. Liste die wichtigsten Technologien auf
4. Zeige die Verzeichnisstruktur

## Optionale Ausgabe in Datei

Falls der Benutzer `> dateiname` angibt, schreibe die Zusammenfassung als Markdown in diese Datei im Projektstammverzeichnis.

## Format

```
┌─────────────────┐                    ┌──────────────────┐
│   Frontend      │  ◄─────────────►   │   Backend        │
│   React/Vite    │  HTTP + WebSocket  │   Express/Node   │
└─────────────────┘                    └──────────────────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │   SQLite     │
                                      └──────────────┘
```

Kommuniziere auf Deutsch.
