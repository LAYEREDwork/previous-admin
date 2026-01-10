# Scripts Documentation

This document provides an overview of all available scripts in the Previous Admin project. Scripts are divided into npm scripts (defined in `package.json`) and standalone scripts (in the `scripts/` directory).

## npm Scripts

npm scripts are executed via `npm run <script-name>` and are primarily used for development, building, testing, and deployment tasks.

### Development Scripts

- **[`dev`](package.json)**: Starts the Vite development server for the frontend. Used during development to serve the React app with hot reloading.
- **[`backend`](package.json)**: Starts the Node.js backend server using tsx. Runs the Express server on port 3001. Used during development alongside `dev`.
- **[`restart:backend`](package.json)**: Kills any running backend process and restarts it. Useful for quick backend restarts without stopping the frontend.
- **[`start`](package.json)**: Alias for `preview`. Starts the production build in preview mode.

### Build Scripts

- **[`build`](package.json)**: Builds the frontend for production using Vite. Creates optimized assets in the `dist/` directory.
- **[`build:prod`](package.json)**: Runs code generation scripts first, then builds for production. Ensures all generated files are up-to-date before building.
- **[`preview`](package.json)**: Serves the production build locally for testing. Used after `build` to verify the production version.

### Code Quality Scripts

- **[`lint`](package.json)**: Runs ESLint on the entire codebase to check for code style and potential errors. Should be run before commits.
- **[`typecheck`](package.json)**: Performs TypeScript type checking without emitting files. Ensures type safety across the project.

### Testing Scripts

- **[`test`](package.json)**: Runs both frontend and backend tests sequentially.
- **[`test:frontend`](package.json)**: Runs frontend tests using Vitest. Tests React components and hooks.
- **[`test:backend`](package.json)**: Runs backend tests using Vitest. Tests Node.js logic and APIs.

### Code Generation Scripts

These scripts generate various assets automatically. They have dependencies on each other for the full generation pipeline.

- **[`generate`](package.json)**: Runs all generation scripts. Used for complete asset regeneration (development).
- **[`generate:prod`](package.json)**: Runs generation scripts needed for production builds (excludes screenshots).
- **[`generate:sfsymbols`](package.json)**: Generates SF Symbol icon components and data from SVG files. Dependency for UI icons.
- **[`generate:schema`](package.json)**: Generates TypeScript types from JSON schema files. Required for config validation.
- **[`generate:fontlist`](package.json)**: Generates available fonts list from public assets. Used for font selection UI.
- **[`generate:translationkeys`](package.json)**: Generates translation key types and files. Essential for i18n support.
- **[`generate:screenshots`](package.json)**: Generates documentation screenshots using Playwright. Used for docs updates.

### Database Scripts

- **[`import:exampledb`](package.json)**: Imports example database data for testing. Used in CI/CD or for development setup.

## Standalone Scripts

These are executable scripts in the `scripts/` directory, run directly or via npm scripts.

### Shell Scripts

- **[`setup.sh`](setup.sh)**: Main setup script for installation, update, uninstall, and status. Creates `padmin` CLI command after installation. Usage: `sudo bash setup.sh install|update|uninstall|status`
- **[`schema.sh`](scripts/build/schema.sh)**: Bash script that processes config schema files. Called by `npm run generate:schema`.
- **[`start-all.sh`](scripts/dev/start-all.sh)**: Starts both frontend and backend servers. Useful for full development environment setup.
- **[`uninstall.sh`](scripts/install/uninstall.sh)**: Uninstalls the application from the system. Supports dynamic user via `PA_TARGET_USER` environment variable.
- **[`admin.sh`](scripts/update/admin.sh)**: Updates Previous Admin to the latest version. Supports dynamic user via `PA_TARGET_USER` environment variable.
- **[`badges.sh`](scripts/update/badges.sh)**: Updates README badges (e.g., LOC, CI status). Called by CI pipeline.

### TypeScript/JavaScript Scripts

- **[`sfsymbols.ts`](scripts/build/sfsymbols.ts)**: TypeScript script to generate SF Symbol components. Run via `npm run generate:sfsymbols`.
- **[`fontlist.ts`](scripts/build/fontlist.ts)**: Generates font list from assets. Run via `npm run generate:fontlist`.
- **[`translations.ts`](scripts/build/translations.ts)**: Processes translation files. Run via `npm run generate:translationkeys`.
- **[`screenshots.mjs`](scripts/build/screenshots.mjs)**: Node.js script for screenshot generation. Run via `npm run generate:screenshots`.
- **[`import-db.ts`](scripts/dev/import-db.ts)**: Imports example data. Run via `npm run import:exampledb`.

### Python Scripts
 

## Dependencies and Usage

### Script Dependencies

- `generate:prod` depends on `generate:sfsymbols`, `generate:schema`, `generate:translationkeys`, `generate:fontlist`
- `generate` depends on all generation scripts including `generate:screenshots`
- `build:prod` depends on `generate:prod`
- `test` depends on `test:frontend` and `test:backend`

### When to Use

- **Development**: Use `dev` and `backend` for local development. Run `lint` and `typecheck` before committing.
- **Pre-commit**: Always run `lint`, `typecheck`, and `test` to ensure code quality.
- **Build/Release**: Use `build:prod` for production builds. Run `generate` periodically to update assets.
- **CI/CD**: Scripts like `generate:screenshots`, `update_badges.sh`, and `import:exampledb` are used in automated pipelines.
- **Maintenance**: Use `uninstall.sh` for cleanup, `start-all.sh` for quick setup.

## Notes

- All generation scripts should be run after changes to their respective source files (e.g., after adding new SF Symbols or translations).
- The `scripts/` directory contains the actual implementations, while `package.json` provides convenient npm aliases.
