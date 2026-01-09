import fs from 'fs';
import os from 'os';
import path from 'path';

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// We'll mock helpers and runCommand to simulate the real updater flow
vi.mock('../helpers', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    downloadWithCurl: vi.fn(),
    extractArchive: vi.fn(),
    createBackup: vi.fn(),
    replaceProject: vi.fn(),
    restoreBackup: vi.fn(),
  };
});

vi.mock(import('child_process'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    spawn: vi.fn(),
  };
});

let helpers: any;
let Updater: any;

beforeAll(async () => {
  helpers = await import('../helpers');
  Updater = (await import('../index')).Updater;
});

let tmpProjectDir = '';

beforeEach(() => {
  tmpProjectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-updater-project-'));
  fs.writeFileSync(path.join(tmpProjectDir, 'file.txt'), 'ORIGINAL', 'utf8');
});

afterEach(() => {
  try { fs.rmSync(tmpProjectDir, { recursive: true, force: true }); } catch { /* ignore */ }
  vi.resetAllMocks();
});

describe('Updater integration flow: backup -> replace fails -> rollback', () => {
  it('creates backup, fails replace, and restores backup', async () => {
    // Mock runCommand to handle the curl that writes release.json and other commands
    const mockedRunCommand = vi.fn(async (command: string, args: string[]) => {
      if (command === 'curl' && args.includes('-o')) {
        const outIndex = args.indexOf('-o');
        const outPath = args[outIndex + 1];
        const release = { tag_name: 'v9.9.9', tarball_url: 'https://example.invalid/archive.tar.gz' };
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify(release), 'utf8');
        return { code: 0, stdout: '', stderr: '' };
      }
      // other commands succeed
      return { code: 0, stdout: '', stderr: '' };
    });

    vi.spyOn(helpers as any, 'runCommand').mockImplementation(mockedRunCommand as any);

    // extractArchive should create a source directory containing a new file
    (helpers.extractArchive as any).mockImplementation(async (_archivePath: string, destDir: string) => {
      const src = path.join(destDir, 'repo-src');
      fs.mkdirSync(src, { recursive: true });
      fs.writeFileSync(path.join(src, 'file.txt'), 'NEW', 'utf8');
      return src;
    });

    // createBackup should copy projectDir -> backupDir
    (helpers.createBackup as any).mockImplementation(async (projectDir: string, backupDir: string) => {
      fs.mkdirSync(backupDir, { recursive: true });
      // simple recursive copy
      const copy = (src: string, dst: string) => {
        fs.mkdirSync(dst, { recursive: true });
        for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
          const s = path.join(src, entry.name);
          const d = path.join(dst, entry.name);
          if (entry.isDirectory()) copy(s, d);
          else fs.copyFileSync(s, d);
        }
      };
      copy(projectDir, backupDir);
    });

    // replaceProject will throw to simulate a failed install step
    (helpers.replaceProject as any).mockImplementation(async () => {
      throw new Error('simulated replace failure');
    });

    // restoreBackup should copy backupDir -> projectDir
    (helpers.restoreBackup as any).mockImplementation(async (backupDir: string, targetDir: string) => {
      const copy = (src: string, dst: string) => {
        fs.mkdirSync(dst, { recursive: true });
        for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
          const s = path.join(src, entry.name);
          const d = path.join(dst, entry.name);
          if (entry.isDirectory()) copy(s, d);
          else fs.copyFileSync(s, d);
        }
      };
      copy(backupDir, targetDir);
    });

    const updater = new Updater(tmpProjectDir);
    const events: any[] = [];
    updater.on('status', (s: any) => events.push(s));

    await updater.startUpdate({ dev: false });

    // After run, project file should still contain ORIGINAL (restored)
    const content = fs.readFileSync(path.join(tmpProjectDir, 'file.txt'), 'utf8');
    expect(content).toBe('ORIGINAL');

    // Ensure that we observed an error status and that rollback status was emitted
    const keys = events.map(e => e.key);
    expect(keys).toContain('updater.error');
    expect(keys).toContain('updater.rollback');
    expect(helpers.createBackup).toHaveBeenCalled();
    expect(helpers.restoreBackup).toHaveBeenCalled();
  }, 20000);
});
