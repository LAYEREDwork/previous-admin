import fs from 'fs'
import path from 'path'

import { beforeAll, afterAll } from 'vitest'

const PROJECT_ROOT = path.resolve(__dirname, '../../')

async function removeProjectTmpDirs() {
  try {
    const entries = await fs.promises.readdir(PROJECT_ROOT, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('tmp-')) {
        const fullPath = path.join(PROJECT_ROOT, entry.name)
        try { await fs.promises.rm(fullPath, { recursive: true, force: true }) } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
}

beforeAll(async () => {
  // Clean any leftover tmp-* directories in the project root before tests
  await removeProjectTmpDirs()
})

afterAll(async () => {
  // Cleanup again after all tests have run
  await removeProjectTmpDirs()
})

// ensure cleanup on unexpected process exit
process.on('exit', () => {
  try {
    // synchronous removal to avoid async in exit handler
    const entries = fs.readdirSync(PROJECT_ROOT, { withFileTypes: true })
    for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith('tmp-')) {
        try { fs.rmSync(path.join(PROJECT_ROOT, entry.name), { recursive: true, force: true }) } catch { /* ignore */ }
      }
    }
  } catch { /* ignore */ }
})
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock window.matchMedia for Rsuite components that use useMediaQuery
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});