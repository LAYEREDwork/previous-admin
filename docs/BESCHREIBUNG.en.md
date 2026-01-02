# Complete Functional Description of the Project "Previous Admin"

## Overview
Previous Admin is a web-based management tool specifically designed for configuring the Previous NeXT Computer Emulator. It allows users to securely and user-friendly manage, organize, and synchronize emulator configurations. The tool runs as a self-contained web service on the user's system and provides an intuitive interface for creating, editing, importing, and exporting configurations. It supports multilingualism and offers real-time monitoring of system metrics.

## Backend Functions

The backend forms the server-side foundation of the tool and provides the core logic for data management and communication. It handles all requests from the frontend, manages data persistence, and ensures a stable environment.

### Configuration Management
- Enables creating, reading, updating, and deleting emulator configurations.
- Configurations can be sorted in a custom order to facilitate organization.
- An active configuration can be selected, which is then used for the emulator.
- The system synchronizes configurations directly with the emulator's configuration file.

### Import and Export
- Individual configurations can be exported as JSON files.
- A complete backup of the entire database is possible to secure all configurations and settings.
- Import functions allow uploading JSON files to restore or share configurations.
- The tool supports restoring the database from a backup.

### System Monitoring and Metrics
- Collects real-time data on system resources such as CPU, memory, and disk.
- Provides these metrics via a continuous connection to monitor system status live.
- Platform-specific adjustments for Linux and macOS ensure accurate measurements.

### Network and Integration
- Supports automatic network discovery to make the tool accessible on the local network.
- Provides API endpoints for all main functions, enabling seamless communication with the frontend.

## Frontend Functions

The frontend represents the user interface through which all interactions with the tool take place. It is designed responsively, supports various languages, and offers a modern, user-friendly experience.

### Configuration Overview
- Displays a list of all stored configurations, with options for sorting and filtering.
- Users can reorder configurations via drag-and-drop.
- An active configuration can be selected directly from the list.

### Configuration Editing
- Provides a detailed editing interface for individual configurations.
- Users can customize all aspects of a configuration, such as system settings, display options, and storage devices.
- Changes are validated and saved in real-time.

### Import and Export
- A special page for importing configurations from JSON files.
- Export options allow downloading individual configurations or the entire database.
- Visual feedback shows the progress and success of operations.

### System Information
- An overview page with live metrics on CPU, memory, and disk.
- Graphical representations help monitor system performance.
- Users can track their system's status in real-time.

### Additional Functions
- An information page with resources and links to the Previous Emulator.
- Full support for multiple languages, with options for language selection.
- A dark mode for better comfort during extended use.
- Responsive design that works optimally on desktop and mobile devices.

The tool is designed to make managing emulator configurations as simple and secure as possible, without requiring the user to have technical knowledge. It integrates seamlessly into the emulator's workflow and provides comprehensive support for all common tasks.