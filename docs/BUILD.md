## Building the backend bundle

This project uses `esbuild` to create a single-file backend bundle that is safe to deploy
on constrained devices (Raspberry Pi). The bundle is produced at `backend/dist/bundle.js`.

Local build steps:

```bash
# install dependencies
npm install

# build the bundled backend
npm run build:backend:bundle

# optional: run a smoke test
npm run smoke-test
``` 

Provided helpers:
- `backend/build.sh` — installs deps and runs the bundle build
- `scripts/smoke-test.sh` — starts `backend/dist/bundle.js` and checks `/api/health`

In CI you should run `npm ci` and `npm run build:backend:bundle`, then package the
`backend/dist` directory into your release artifact.
