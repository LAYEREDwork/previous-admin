# Instruktionen für den Assistant (aus `/.github/copilot-instructions.md` abgeleitet)

Zweck
- Dieses Dokument fasst die projekt-spezifischen Arbeitsregeln und Copilot-Anweisungen zusammen, damit der Assistant präzise, konsistent und projektkonform arbeitet.

Allgemeine Verhaltensregeln
- Kommuniziere auf Deutsch, sofern nicht anders angefragt.
- Sei präzise, kurz und freundlich; antworte wie ein technischer Partner.
- Nutze niemals einzelne Buchstaben als Bezeichner; verwende immer beschreibende Variablennamen.
- Ergänze in jedem Code nicht-triviale Stellen mit Kommentaren in englischer Sprache.
- Formatiere Code sauber mit konsistenter Einrückung und Leerzeilen.
- Füge JSDoc/Documentation-Comments für alle Funktionen und Klassen hinzu, wenn du Code erstellst oder änderst.

Qualität und Prüfungen
- Bevor du Änderungen committest oder weitergibst, führe Linter, Typecheck und Build-Tasks aus; behebe dabei auftretende Fehler, sofern sie durch deine Änderung verursacht wurden.
- Schreibe Tests, wenn die Änderung funktional signifikant ist oder neue Logik hinzukommt.

Projekt-spezifische Regeln
- Verwende `@`-Imports für interne Module anstelle relativer Pfade, wenn möglich.
- Verwende vorhandene Implementierungen; vermeide Duplikate (DRY). Suche zuerst nach existierenden Types/Constants/Helpers.
- Farb- und UI-Änderungen: stelle sicher, dass neue Farben theme-aware (Light/Dark) sind.
- Nutze `PASize`-Enum-Konstanten statt Magic Strings für component `size` Props.
- Nutze zentrale API-Pfad-Definitionen aus `shared/api/constants.ts` (keine harten String-Literale).
- Wenn du die Symbol-/SF-Symbol-Pipeline berührst, halte die SSoT-Dateien (`frontend/components/sf-symbols/available-symbols.ts`) konsistent.

Update- und Release-Verfahren
- Verwende niemals `git pull` zum Aktualisieren der Anwendung; Updates erfolgen durch Herunterladen und Extrahieren von GitHub-Releases (siehe `scripts/update.ts`).

Custom Commands und Verhalten
- `:arch`: Liefert eine kurze Zusammenfassung der Architektur des aktuellen Projekts. Wird der Befehl mit einem `>`-Symbol gefolgt von einem Dateinamen aufgerufen, schreibe die Anweisungen als Markdown in eine Datei mit diesem Namen im Projektstamm.
- `:badges`: Führe das Skript `scripts/update_badges.sh` aus.
- `:cm`: Erzeuge eine kompakte Commit-Message in englischer Sprache für die Änderungen seit dem letzten Commit. Es sollen nur kürzlich geänderte Dateien berücksichtigt werden (`git status`). Die Nachricht soll eine Überschrift und eine ungeordnete Liste enthalten, formatiert als Klartext in einem Codeblock.
- `:dev-setup`: Liefere schrittweise Anweisungen zum Einrichten der Entwicklungsumgebung für das aktuelle Projekt. Wird der Befehl mit `>` und einem Dateinamen aufgerufen, schreibe die Anweisungen als Markdown in eine Datei mit diesem Namen im Projektstamm.
- `:desc`: Erstelle eine vollständige funktionale Beschreibung des Projekts, unterteilt in Backend und Frontend, ohne technische Details, als Markdown. Wird der Befehl mit `>` und einem Dateinamen aufgerufen, schreibe den Text in die genannte Datei im Projektstamm. Enthält der Dateiname eine Sprach-Suffix wie `.de.md` oder `.en.md`, schreibe die Beschreibung in der entsprechenden Sprache.
- `:desct`: Wie `:desc`, jedoch mit allen technischen Details. Gleicht das Verhalten beim optionalen `>`-Dateiparameter an `:desc` an (Schreibvorgang, Sprachsuffix).
- `:docs <topic>`: Generiere ausführliche Dokumentation zum angegebenen Thema im Kontext dieses Projekts. Die Dokumentation muss im Markdown-Format vorliegen und, wo passend, Codebeispiele enthalten. Wird der Befehl mit `>` und einem Dateinamen aufgerufen, schreibe die Dokumentation als Markdown in die genannte Datei im Projektstamm. Wird kein Thema angegeben, generiere eine umfassende Dokumentation für das gesamte Projekt.
- `:ls`: Gib eine alphabetisch sortierte Liste aller benutzerdefinierten Befehle, die mit `:` beginnen, inkl. ihrer Beschreibungen als Markdown aus. Gruppiere sie dabei thematisch sortiert und gib jeder Themengruppe eine Headline.
- `:scan`: Scanne den Projektcode und aktualisiere deinen Kontext. Ändere dabei auf keinen Fall irgendeinen Code.
- `:undo`: Mache die letzten Änderungen am Code rückgängig und stelle den vorherigen Zustand wieder her.
- `:release`: Erstelle prägnante, nicht-technische Release-Notes in englischer Sprache für die Änderungen seit dem letzten Release. Die Release-Notes sollen den neuen Versionsnamen als Überschrift enthalten (z. B. "## Version 1.2.0") sowie eine Liste der wichtigsten neuen Funktionen, Verbesserungen und Fehlerbehebungen. Formatiere die Notes als Markdown innerhalb eines Codeblocks. Um alle Änderungen für die Release-Notes zu ermitteln, überprüfe die Versionsnummer des neuesten Releases auf GitHub und den neuesten Tag; die Differenz beschreibt die Änderungen.
- `:npm`: Zeige alle benutzerdefinierten `npm run`-Skripte / Kommandos für dieses Projekt an.

Wichtige Dateipfade und Hinweise
- Haupt-Backend-Entry: `backend/index.ts`
- Frontend-Root: `frontend/App.tsx`
- Gemeinsame Typen: `shared/types.ts`
- Config-Manager: `backend/config/index.ts` und platform-spezifische Implementationen in `backend/config/`
- Symbol-Quelle: `frontend/components/sf-symbols/available-symbols.ts`

Arbeitsablauf bei Änderungen
1. Scanne das Projekt (`:scan`) bevor du größere Änderungen machst.
2. Erstelle eine minimal-invasive Änderung; vermeide Refactors, die nicht explizit angefragt wurden.
3. Führe Linter/Typecheck/Build lokal aus; füge Tests hinzu falls nötig.
4. Schreibe klare Commit-Messages; benutze `:cm` zur Komprimierung.

Dokumentations- und Übersetzungsregeln
- Bewahre bestehende Stil- und Tonalitätskonventionen bei neuen Texten.
- Übersetze neue Texte vollständig und konsistent für alle vorhandenen Sprachen im Projekt.

Quelle
- Diese Regeln wurden aus `/.github/copilot-instructions.md` extrahiert und als kurzes, praktisch anwendbares Instruktionsdokument für den Assistant aufbereitet.
