# Copilot Instructions for `previous-admin`

## General Guidelines
- Never use a single character for variable names, parameters, or any identifiers; always use descriptive names.
- Always, in every kind of code, add comments to explain non-trivial parts in English.
- Always format code with proper indentation and spacing for better readability.
- Always add JSDoc documentation comments for all functions and classes in English.
- Never change code on your own without my explicit request.
- Always communicate in German.
- When adding features or making changes, always run linter, typecheck and build commands to ensure code quality. If there are any errors, always fix them before proceeding.
- When creating new colours, always ensure that they are theme-aware. This means that they should work in both light and dark mode.
- Always use "@" imports for internal modules instead of relative paths.
- Always follow the existing project structure and coding conventions.
- When writing documentation, always use a newline before a tripple backtick block.
- **CRITICAL - DRY Principle**: Before creating new types, constants, or configurations, ALWAYS search the codebase for similar or existing implementations. If something similar already exists:
  - Use the existing implementation instead of creating duplicates
  - If the existing implementation needs extension, refactor it to be more general/reusable
  - Never create redundant constants, mappings, or type definitions
  - Examples: Size configurations (`PASizeConfig`), icon mappings, color schemes, font settings, etc.

## Architecture Overview
- **Frontend**: React 19.2.3 + TypeScript app built with Vite, using Tailwind CSS and Rsuite UI components. Runs on port 2342 in development, served by backend in production.
- **Backend**: Node.js + Express server with TypeScript, handling REST API (`/api/*`) and platform-specific operations. Runs on port 3001 in development, 2342 in production.
- **Database**: SQLite database stored in `~/.previous-admin/previous-admin.db` with automatic schema initialization.
- **Communication**: Frontend communicates with backend via HTTP REST API.
- **Platform Support**: Platform-specific config managers for macOS and Linux (see `backend/config/` and `backend/platform/`).
- **State Management**: React contexts (`contexts/`) for global state, custom hooks (`hooks/`) for business logic.
- **Internationalization**: Full i18n support with German, English, Spanish, French, Italian translations in `frontend/lib/i18n/locales/`.

## Development Workflows
- **Start Development**: Run `npm run backend` in one terminal (starts backend on :3001) and `npm run dev` in another (starts frontend on :2342).
- **Build**: `npm run build` creates production frontend build served by backend on :2342.
- **Testing**: `npm run test` runs both frontend and backend tests with Vitest. Use `npm run test:frontend` or `npm run test:backend` to test separately.
- **Code Quality**: `npm run lint` (ESLint), `npm run typecheck` (TypeScript check).
- **Update Process**: Never use `git pull`; download and extract new versions from GitHub releases (see `scripts/update.ts`).
- **Production Setup**: Use `sudo ./setup.sh` for TUI-based installation (raspi-config style) with systemd services and Avahi/Bonjour discovery. After installation, use `sudo padmin` CLI command for management.
- **Uninstallation**: Use `sudo padmin uninstall` or `sudo scripts/uninstall.sh` for clean removal with optional database backup.

## Project-Specific Patterns
- **Config Management**: Use `ConfigManager` class (`backend/config/index.ts`) for reading/writing Previous emulator config files. Platform-specific implementations in `linux-config-manager.ts`/`macos-config-manager.ts`.
- **Database Operations**: Import from `backend/database/` modules; configurations stored with order, active status, and metadata.
- **API Routes**: REST endpoints in `backend/api/`. NEVER use magic string literals for endpoints! Always define them in `shared/api/constants.ts` in the `apiPaths` object and use them consistently across backend (relative paths) and frontend (full paths). Example: Use `apiPaths.Config.convertToCfg.relative` in backend routes and `apiPaths.Config.convertToCfg.full` in frontend fetch calls.
- **Custom Hooks**: Business logic extracted into hooks like `useConfigActions`, `useConfigList` for reusable frontend logic.
- **Error Handling**: Use `PAErrorBoundary` component and notification context for user-facing errors.
- **File Watching**: `backend/file-watcher.ts` monitors config file changes for auto-sync.
- **Metrics Collection**: Real-time system metrics via `backend/metrics.ts`.
- **Size Parameters**: ALWAYS use `PASize` enum constants (`PASize.xs`, `PASize.sm`, `PASize.md`, `PASize.lg`, `PASize.xl`) instead of magic string literals (`'xs'`, `'sm'`, `'md'`, etc.) in component `size` props and type definitions. The `PASize` enum is defined in `frontend/lib/types/sizes.ts`. Use type `PASize` for any size-related props and default values. This applies to all component size properties throughout the codebase.
- **SF Symbol Architecture** (**SOURCE OF TRUTH**): 
  - **Source of Truth**: `frontend/components/sf-symbols/available-symbols.ts` - Enum generated from actual SVG filenames, guarantees all symbols exist
  - **Symbol Validation**: Integrated into schema generation pipeline (`backend/config-schema/validate-symbols.ts`) - prevents broken references at generation time
  - **Semantic Keyword Matching**: Use intelligent section symbol recognition via keyword groups in `backend/config-schema/schema-extractor.ts`. When config section names contain keywords, corresponding symbols are assigned (case-insensitive substring match). Order matters - more specific groups checked first:
    - **Mouse/Input Device** → `computermouse.fill`: Keywords: `[mouse, computermouse, pointer, cursor, trackpad, touchpad, trackball]`
    - **Audio/Sound** → `hifispeaker.fill`: Keywords: `[sound, audio, speaker, voice, music, tone, sox, volume, mic, microphone, output, hifi, acoustic]`
    - **Printer** → `printer.fill`: Keywords: `[printer, print, output, printout, document, paper, laser, inkjet, plotter]`
    - **Keyboard/Input** → `keyboard.fill`: Keywords: `[keyboard, input, keys, shortcuts, control, modifier, keypad, keymap, hotkey, accelerator]`
    - **Display/Screen** → `display`: Keywords: `[display, screen, monitor, graphics, resolution, video, render, lcd, led, panel, viewport, framebuffer, vram, 3d, card, dimension]`
    - **Optical Drive** → `opticaldisc.fill`: Keywords: `[optical, cd, dvd, disc, cd-rom, dvd-rom, magneto, blu-ray, blueray, rom-drive]`
    - **Network** → `network`: Keywords: `[network, ethernet, wifi, internet, connection, tcp, ip, lan, wan, modem, router, bridge, hub, adapter, nic]`
    - **Storage/Drive** → `externaldrive.fill`: Keywords: `[scsi, drive, disk, storage, hd, ssd, volume, hard, ide, ata, sata, nvme, raid, partition]`
    - **Boot** → `autostartstop`: Keywords: `[boot, startup, launch, initialization, loader, bootloader, firmware, bios, uefi]`
    - **System/General** → `checkmark.app.fill`: Keywords: `[system, config, general, settings, preferences, options, setup, configuration, parameters, properties]` (default fallback)
  - **Symbol Mappings**: All section-to-symbol mappings in `backend/config-schema/section-symbols.json` are validated at generation time to ensure they reference symbols that exist in `available-symbols.ts`
  - **Pipeline**: `scripts/generate-sfsymbols.ts` → generates `available-symbols.ts` (SOURCE OF TRUTH) → other symbol files use this enum → schema generation validates all mappings

## Key Files and Directories
- `backend/index.ts`: Main server entry point with Express setup and routes.
- `frontend/App.tsx`: Root component with context providers and tab-based navigation.
- `shared/types.ts`: Shared TypeScript interfaces for Configuration, API responses.
- `backend/platform/`: Platform abstraction layer for OS-specific operations.
- `frontend/lib/database.ts`: Frontend database API client functions.
- `scripts/`: Automation scripts for setup, updates, and maintenance.

## Handling and Check of Version Numbers

* The SSoT is GitHub!
* There are tags and releases there. Only the GH release system should be used to check current and new versions.
* Previous Admin should "somehow" know its current version (aka release)
* Is there a higher release on GH it should notify the use on the "About" page
* The `:release` command should fetch the URL: https://github.com/LAYEREDwork/previous-admin/compare/OT...LT, where "OT" stands for "Old Tag" and "LT" stands for "Latest Tag". Specific example: https://github.com/LAYEREDwork/previous-admin/compare/1.1.1...1.1.2 - This displays all changes made between tag "1.1.1" and tag "1.1.2". These changes should be used to generate release notes in Markdown format without any techno babble that are easy for the user to understand.

## Custom Commands

- **`:arch`**: Provides a brief summary of the architecture of the current project. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory.
- **`:badges`**: Run the script `scripts/update/badges.sh`.
- **`:cm`**: Creates a compact commit message in English(!) for the changes since the last commit. Only recently changed files should be included (`git status`). The message should contain a headline and an unordered list, formatted as plain text in a code block.
- **`:dev-setup`**: Provide step-by-step instructions for setting up the development environment for the current project. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory.
- **`:desc`**: Produce a complete functional description of the project, divided into backend and frontend, without technical details, as Markdown. If the command is followed by a `>` symbol and a string, write the text to a file with that name in the project root directory. If the name contains a language suffix such as `.de.md` or `.en.md`, write the description in the corresponding language.
- **`:desct`**: Produce a complete functional description of the project, divided into backend and frontend, with all technical details, as Markdown. If the command is followed by a `>` symbol and a string, write the text to a file with that name in the project root directory. If the name contains a language suffix such as `.de.md` or `.en.md`, write the description in the corresponding language.
- **`:docs <topic>`**: Generate detailed documentation on the specified topic in the context of the current project. The documentation must be in Markdown format and include code examples where appropriate. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory. If no topic is specified, generate comprehensive documentation for the entire project.
- **`:ls`**: Output a list of all custom commands that start with ":" as Markdown sorted in alphabetical order.
- **`:scan`**: Scan the project’s code and update your context. Do not change the code under any circumstances!
- **`:undo`**: Undo the last changes in the code and return to the previous state.
- **`:release`**: Create user-friendly release notes in simple English, without technical jargon. Use the GitHub API to retrieve the release notes from the body of the latest release (as implemented in the update API: `latestRelease.body`). Format these as clear Markdown with thematic grouping and a version heading. The notes should highlight the most important improvements for end users, not technical details, no developer information, just the user-facing changes.
- **`:npm`**: Show all custom npm run scripts/commands for this project.
