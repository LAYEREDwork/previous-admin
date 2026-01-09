import fs from 'fs';
import os from 'os';
import path from 'path';
import { PassThrough } from 'stream';

import { vi, describe, it, expect, beforeAll, afterEach } from 'vitest';

// Partially mock child_process.spawn to simulate commands and their filesystem side-effects
vi.mock(import('child_process'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    spawn: vi.fn(),
  };
});

let spawn: any;
let helpers: any;
const createdTmpDirs: string[] = [];

afterEach(() => {
  // Clean up any temporary directories created during tests
  for (const dir of createdTmpDirs.splice(0)) {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});

beforeAll(async () => {
  const cp = await import('child_process') as any;
  spawn = cp.spawn;
  helpers = await import('../helpers');
});

function copyDirSync(sourceDir: string, destDir: string) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDirSync(srcPath, destPath);
    else if (entry.isFile()) fs.copyFileSync(srcPath, destPath);
  }
}

describe('helpers file operations (mocked commands)', () => {
  it('downloadWithCurl writes a file to dest', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-download-'));
    createdTmpDirs.push(tmpDir);
    const destPath = path.join(tmpDir, 'downloaded.txt');

    // Mock spawn to simulate curl writing the output file
    (spawn as any).mockImplementation((_command: string, _args: string[]) => {
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      const fakeChild: any = {
        stdout,
        stderr,
        on: (event: string, cb: any) => {
          if (event === 'close') {
            // perform side-effect: write dest file when curl is invoked
            if (_command === 'curl') {
              const outIndex = _args.indexOf('-o');
              const outPath = outIndex >= 0 ? _args[outIndex + 1] : destPath;
              fs.mkdirSync(path.dirname(outPath), { recursive: true });
              fs.writeFileSync(outPath, 'mocked download content');
            }
            setTimeout(() => cb(0), 5);
          }
          return fakeChild;
        },
      };
      return fakeChild;
    });

    await helpers.downloadWithCurl('https://example.invalid/file', destPath);
    const content = fs.readFileSync(destPath, 'utf-8');
    expect(content).toContain('mocked download content');
  });

  it('extractArchive creates a child directory and returns its path', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-archive-'));
    createdTmpDirs.push(tmpDir);
    const archivePath = path.join(tmpDir, 'fake.tar.gz');
    const extractDest = path.join(tmpDir, 'out');

    // create a placeholder archive file
    fs.writeFileSync(archivePath, 'not a real archive');

    // Mock spawn to simulate tar extracting into extractDest and creating a subdirectory
    (spawn as any).mockImplementation(() => {
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      const fakeChild: any = {
        stdout,
        stderr,
        on: (event: string, cb: any) => {
          if (event === 'close') {
            // simulate extraction creating a folder
            const childDir = path.join(extractDest, 'repo-123');
            fs.mkdirSync(childDir, { recursive: true });
            fs.writeFileSync(path.join(childDir, 'file.txt'), 'extracted');
            setTimeout(() => cb(0), 5);
          }
          return fakeChild;
        },
      };
      return fakeChild;
    });

    const extractedDir = await helpers.extractArchive(archivePath, extractDest);
    expect(fs.existsSync(path.join(extractedDir, 'file.txt'))).toBe(true);
  });

  it('createBackup copies project files to backupDir via rsync mock', async () => {
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-project-'));
    const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-backup-'));
    createdTmpDirs.push(projectDir, backupDir);
    fs.writeFileSync(path.join(projectDir, 'a.txt'), 'hello');
    fs.mkdirSync(path.join(projectDir, 'subdir'));
    fs.writeFileSync(path.join(projectDir, 'subdir', 'b.txt'), 'world');

    (spawn as any).mockImplementation((_command: string, _args: string[]) => {
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      const fakeChild: any = {
        stdout,
        stderr,
        on: (event: string, cb: any) => {
          if (event === 'close') {
            if (_command === 'rsync') {
              // last two args expected to be source/target
              const src = _args[_args.length - 2].replace(/\\/g, '/').replace(/\\/g, '/');
              const dst = _args[_args.length - 1].replace(/\\/g, '/');
              // remove trailing slashes
              const srcClean = src.replace(/\/+$/, '');
              const dstClean = dst.replace(/\/+$/, '');
              copyDirSync(srcClean, dstClean);
            }
            setTimeout(() => cb(0), 5);
          }
          return fakeChild;
        },
      };
      return fakeChild;
    });

    await helpers.createBackup(projectDir, backupDir);
    expect(fs.readFileSync(path.join(backupDir, 'a.txt'), 'utf-8')).toBe('hello');
    expect(fs.readFileSync(path.join(backupDir, 'subdir', 'b.txt'), 'utf-8')).toBe('world');
  });

  it('replaceProject syncs source into target via rsync mock', async () => {
    const sourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-src-'));
    const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-target-'));
    createdTmpDirs.push(sourceDir, targetDir);
    fs.writeFileSync(path.join(sourceDir, 'x.txt'), 'X');
    fs.writeFileSync(path.join(targetDir, 'y.txt'), 'Y');

    (spawn as any).mockImplementation((_command: string, _args: string[]) => {
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      const fakeChild: any = {
        stdout,
        stderr,
        on: (event: string, cb: any) => {
          if (event === 'close') {
            if (_command === 'rsync') {
              const src = _args[_args.length - 2].replace(/\\+$/, '');
              const dst = _args[_args.length - 1].replace(/\\+$/, '');
              copyDirSync(src, dst);
            }
            setTimeout(() => cb(0), 5);
          }
          return fakeChild;
        },
      };
      return fakeChild;
    });

    await helpers.replaceProject(sourceDir, targetDir);
    // target should now contain x.txt and may have y.txt removed
    expect(fs.readFileSync(path.join(targetDir, 'x.txt'), 'utf-8')).toBe('X');
  });

  it('restoreBackup copies backup into target via rsync mock', async () => {
    const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-backup2-'));
    const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-target2-'));
    createdTmpDirs.push(backupDir, targetDir);
    fs.writeFileSync(path.join(backupDir, 'z.txt'), 'Z');

    (spawn as any).mockImplementation((_command: string, _args: string[]) => {
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      const fakeChild: any = {
        stdout,
        stderr,
        on: (event: string, cb: any) => {
          if (event === 'close') {
            if (_command === 'rsync') {
              const src = _args[_args.length - 2].replace(/\\+$/, '');
              const dst = _args[_args.length - 1].replace(/\\+$/, '');
              copyDirSync(src, dst);
            }
            setTimeout(() => cb(0), 5);
          }
          return fakeChild;
        },
      };
      return fakeChild;
    });

    await helpers.restoreBackup(backupDir, targetDir);
    expect(fs.readFileSync(path.join(targetDir, 'z.txt'), 'utf-8')).toBe('Z');
  });
});
