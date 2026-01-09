import { PassThrough } from 'stream';

import { vi, describe, it, expect, beforeAll } from 'vitest';

// We will test runCommand by partially mocking child_process.spawn
vi.mock(import('child_process'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    spawn: vi.fn(),
  };
});

let spawn: any;
let runCommand: any;

beforeAll(async () => {
  const cp = await import('child_process') as any;
  spawn = cp.spawn;
  const helpers = await import('../helpers');
  runCommand = helpers.runCommand;
});

describe('runCommand', () => {
  it('resolves when process exits with code 0', async () => {
    const stdout = new PassThrough();
    const stderr = new PassThrough();

    const fakeChild: any = {
      stdout,
      stderr,
      on: (event: string, cb: any) => {
        if (event === 'close') {
          // simulate async close
          setTimeout(() => cb(0), 10);
        }
        return fakeChild;
      },
    };

    (spawn as any).mockImplementation(() => fakeChild);

    // write some output
    setTimeout(() => {
      stdout.write('hello');
      stderr.write('');
      stdout.end();
      stderr.end();
    }, 1);

    const res = await runCommand('echo', ['hi']);
    expect(res.code).toBe(0);
    expect(res.stdout).toContain('hello');
  });

  it('rejects when process exits with non-zero code', async () => {
    const stdout = new PassThrough();
    const stderr = new PassThrough();

    const fakeChild: any = {
      stdout,
      stderr,
      on: (event: string, cb: any) => {
        if (event === 'close') {
          setTimeout(() => cb(2), 10);
        }
        return fakeChild;
      },
    };

    (spawn as any).mockImplementation(() => fakeChild);

    setTimeout(() => {
      stderr.write('error occurred');
      stderr.end();
      stdout.end();
    }, 1);

    await expect(runCommand('false', [])).rejects.toThrow(/Command failed/);
  });
});
