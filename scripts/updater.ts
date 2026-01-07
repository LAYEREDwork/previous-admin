#!/usr/bin/env tsx
import { spawn } from 'child_process';
import readline from 'readline';

/**
 * Simple TypeScript updater wrapper
 * - Spawns the existing bash update script
 * - Emits JSON lines to stdout for each log line
 *
 * Lines emitted are JSON objects, one per line, e.g.
 * { type: 'start', timestamp: 123 }
 * { type: 'log', stream: 'stdout'|'stderr', message: '...' }
 * { type: 'exit', code: 0 }
 */

const scriptPath = `${process.cwd()}/scripts/update.sh`;

function emitEvent(event: unknown) {
  process.stdout.write(JSON.stringify(event) + '\n');
}

async function run() {
  emitEvent({ type: 'start', timestamp: Date.now(), script: scriptPath });

  // Run the bash script directly; do not use sudo here — caller may use sudo if needed
  const proc = spawn('bash', [scriptPath], { cwd: process.cwd(), env: process.env });

  const rlOut = readline.createInterface({ input: proc.stdout });
  rlOut.on('line', (line) => emitEvent({ type: 'log', stream: 'stdout', message: line }));

  const rlErr = readline.createInterface({ input: proc.stderr });
  rlErr.on('line', (line) => emitEvent({ type: 'log', stream: 'stderr', message: line }));

  proc.on('close', (code) => {
    emitEvent({ type: 'exit', code });
    process.exit(code === null ? 1 : code);
  });

  proc.on('error', (err) => {
    emitEvent({ type: 'error', message: err.message });
    process.exit(1);
  });
}

run().catch((err) => {
  emitEvent({ type: 'error', message: err?.message || String(err) });
  process.exit(1);
});
