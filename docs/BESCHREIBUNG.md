# Vollständige funktionale Beschreibung des Projekts "Previous Admin"

## Überblick
Previous Admin ist ein webbasiertes Verwaltungstool, das speziell für die Konfiguration des Previous NeXT Computer Emulators entwickelt wurde. Es ermöglicht Benutzern, Emulator-Konfigurationen sicher und benutzerfreundlich zu verwalten, zu organisieren und zu synchronisieren. Das Tool läuft als eigenständiger Webdienst auf dem System des Benutzers und bietet eine intuitive Oberfläche für die Erstellung, Bearbeitung, den Import und Export von Konfigurationen. Es unterstützt Mehrsprachigkeit und bietet Echtzeit-Überwachung von Systemmetriken.

## Backend-Funktionen

Das Backend bildet die serverseitige Grundlage des Tools und stellt die Kernlogik für Datenverwaltung und Kommunikation bereit. Es handhabt alle Anfragen vom Frontend, verwaltet die Datenpersistenz und sorgt für eine stabile Umgebung.

### Konfigurationsverwaltung
- Ermöglicht das Erstellen, Lesen, Aktualisieren und Löschen von Emulator-Konfigurationen.
- Konfigurationen können in einer benutzerdefinierten Reihenfolge sortiert werden, um die Organisation zu erleichtern.
- Eine aktive Konfiguration kann ausgewählt werden, die dann für den Emulator verwendet wird.
- Das System synchronisiert Konfigurationen direkt mit der Konfigurationsdatei des Emulators.

### Import und Export
- Einzelne Konfigurationen können als JSON-Dateien exportiert werden.
- Eine vollständige Sicherung der gesamten Datenbank ist möglich, um alle Konfigurationen und Einstellungen zu sichern.
- Importfunktionen erlauben das Hochladen von JSON-Dateien, um Konfigurationen wiederherzustellen oder zu teilen.
- Das Tool unterstützt die Wiederherstellung der Datenbank aus einem Backup.

### Systemüberwachung und Metriken
- Sammelt Echtzeit-Daten über Systemressourcen wie CPU, Speicher und Festplatte.
- Stellt diese Metriken über eine kontinuierliche Verbindung zur Verfügung, um den Systemzustand live zu überwachen.
- Plattformspezifische Anpassungen für Linux und macOS gewährleisten genaue Messungen.

### Netzwerk und Integration
- Unterstützt automatische Netzwerkerkennung, um das Tool im lokalen Netzwerk zugänglich zu machen.
- Bietet API-Endpunkte für alle Hauptfunktionen, die eine nahtlose Kommunikation mit dem Frontend ermöglichen.

## Frontend-Funktionen

Das Frontend stellt die Benutzeroberfläche dar, über die alle Interaktionen mit dem Tool erfolgen. Es ist responsiv gestaltet, unterstützt verschiedene Sprachen und bietet eine moderne, benutzerfreundliche Erfahrung.

### Konfigurationsübersicht
- Zeigt eine Liste aller gespeicherten Konfigurationen an, mit Optionen zur Sortierung und Filterung.
- Benutzer können Konfigurationen per Drag-and-Drop neu anordnen.
- Eine aktive Konfiguration kann direkt aus der Liste ausgewählt werden.

### Konfigurationsbearbeitung
- Bietet eine detaillierte Bearbeitungsoberfläche für einzelne Konfigurationen.
- Benutzer können alle Aspekte einer Konfiguration anpassen, wie Systemeinstellungen, Anzeigeoptionen und Speichergeräte.
- Änderungen werden in Echtzeit validiert und gespeichert.

### Import und Export
- Eine spezielle Seite für den Import von Konfigurationen aus JSON-Dateien.
- Export-Optionen erlauben das Herunterladen einzelner Konfigurationen oder der gesamten Datenbank.
- Visuelle Rückmeldungen zeigen den Fortschritt und Erfolg der Operationen an.

### Systeminformationen
- Eine Übersichtsseite mit Live-Metriken zu CPU, Speicher und Festplatte.
- Grafische Darstellungen helfen bei der Überwachung der Systemleistung.
- Benutzer können den Zustand ihres Systems in Echtzeit verfolgen.

### Zusätzliche Funktionen
- Eine Informationsseite mit Ressourcen und Links zum Previous Emulator.
- Vollständige Unterstützung für mehrere Sprachen, mit Optionen zur Sprachauswahl.
- Ein dunkler Modus für besseren Komfort bei längerer Nutzung.
- Responsive Design, das auf Desktop- und Mobilgeräten optimal funktioniert.

Das Tool ist darauf ausgelegt, die Verwaltung von Emulator-Konfigurationen so einfach und sicher wie möglich zu machen, ohne dass der Benutzer technische Kenntnisse benötigt. Es integriert sich nahtlos in den Workflow des Emulators und bietet umfassende Unterstützung für alle gängigen Aufgaben.