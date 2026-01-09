import * as childProcess from 'child_process';
import fs from 'fs';
import path from 'path';

export function runCommand(command: string, args: string[] = [], cwd?: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = (childProcess.spawn as any)(command, args, { cwd, shell: false });
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
      process.stdout.write(chunk);
    });
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
      process.stderr.write(chunk);
    });

    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code === 0) resolve({ code: 0, stdout, stderr });
      else reject(new Error(`Command failed: ${command} ${args.join(' ')} (code=${code})\n${stderr}`));
    });
  });
}

export async function downloadWithCurl(url: string, dest: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  // Use curl if available - keeps implementation simple and robust on POSIX systems
  await runCommand('curl', ['-L', '-f', '-s', '-S', '-o', dest, url]);
}

export async function extractArchive(archivePath: string, destDir: string): Promise<string> {
  await fs.promises.mkdir(destDir, { recursive: true });
  const lower = archivePath.toLowerCase();
  if (lower.endsWith('.tar.gz') || lower.endsWith('.tgz') || lower.includes('/tarball/') ) {
    await runCommand('tar', ['-xzf', archivePath, '-C', destDir]);
  } else if (lower.endsWith('.zip') || lower.endsWith('.zipball')) {
    await runCommand('unzip', ['-q', archivePath, '-d', destDir]);
  } else {
    // try tar by default
    await runCommand('tar', ['-xzf', archivePath, '-C', destDir]);
  }
  // Return first child directory if present
  const children = await fs.promises.readdir(destDir, { withFileTypes: true });
  for (const entry of children) {
    if (entry.isDirectory()) return path.join(destDir, entry.name);
  }
  return destDir;
}

export async function createBackup(projectDir: string, backupDir: string): Promise<void> {
  await fs.promises.mkdir(backupDir, { recursive: true });
  // use rsync for efficient copy
  await runCommand('rsync', ['-a', '--delete', '--exclude', 'node_modules', '--exclude', '.git', `${projectDir}/`, `${backupDir}/`]);
}

export async function replaceProject(sourceDir: string, targetDir: string): Promise<void> {
  // sync source into target, excluding data dirs
  await runCommand('rsync', ['-a', '--delete', '--exclude', 'node_modules', '--exclude', '.git', '--exclude', '.previous-admin', `${sourceDir}/`, `${targetDir}/`]);
}

export async function restoreBackup(backupDir: string, targetDir: string): Promise<void> {
  // restore backup into target
  await runCommand('rsync', ['-a', '--delete', `${backupDir}/`, `${targetDir}/`]);
}
