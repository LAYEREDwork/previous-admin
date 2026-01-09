import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

import { downloadWithCurl, extractArchive, createBackup, replaceProject, runCommand, restoreBackup } from './helpers';

/**
 * Minimal Updater skeleton for Previous Admin backend.
 * - Emits structured status events
 * - Supports a DEV_MODE that simulates steps
 * - Intended to be invoked by a privileged wrapper script (see scripts/padmin-updater)
 */

export const enum UpdateStatus {
  Running = 'running',
  Error = 'error',
  Completed = 'completed',
  Idle = 'idle',
}

export interface UpdateEvent {
  key: string; // translation key or status code
  args?: Record<string, string>;
  progress?: number; // 0-100
  status: UpdateStatus;
  message?: string; // human readable fallback (for logs)
}

export class Updater extends EventEmitter {
  private status: UpdateEvent = { key: 'updater.starting', progress: 0, status: UpdateStatus.Idle };
  private projectDir: string;

  constructor(projectDirectory = path.resolve(__dirname, '..', '..')) {
    super();
    this.projectDir = projectDirectory;
  }

  public async startUpdate(options: { dev?: boolean } = {}) {
    let backupDir: string | null = null;
    const logFile = process.env.UPDATER_LOG || path.join(process.env.HOME || '/tmp', '.previous-admin', 'logs', 'updater.log');

    const writeLog = async (line: string) => {
      try {
        await fs.promises.mkdir(path.dirname(logFile), { recursive: true });
        await fs.promises.appendFile(logFile, `[${new Date().toISOString()}] ${line}\n`);
      } catch {
        // ignore logging failures
      }
    };

    try {
      this.emitStatus('updater.running', { progress: 1 }, 'Update started');
      await writeLog('Update started');

      if (options.dev) {
        await this.simulateSteps();
      } else {
        const REPO = 'https://api.github.com/repos/LAYEREDwork/previous-admin/releases/latest';
        this.emitStatus('updater.checking', { progress: 5 }, 'Checking latest release');
        await writeLog('Checking latest release');

        // fetch release metadata via curl to avoid adding deps
        const tempDir = path.join('/tmp', `previous-admin-update-${Date.now()}`);
        await fs.promises.mkdir(tempDir, { recursive: true });

        // get release JSON
        const releaseJsonPath = path.join(tempDir, 'release.json');
        await runCommand('curl', ['-sSf', '-H', 'Accept: application/vnd.github.v3+json', '-H', 'User-Agent: Previous-Admin-Updater', '-o', releaseJsonPath, REPO]);
        const releaseData = JSON.parse(await fs.promises.readFile(releaseJsonPath, 'utf8'));
        const version = (releaseData.tag_name || '').replace(/^v/, '');
        const assetUrl = (releaseData.assets && releaseData.assets[0] && releaseData.assets[0].browser_download_url) || releaseData.tarball_url || releaseData.zipball_url;

        if (!assetUrl) throw new Error('No release asset URL found');

        this.emitStatus('updater.downloading', { progress: 15 }, `Downloading version ${version}`);
        await writeLog(`Downloading ${assetUrl}`);
        const archivePath = path.join(tempDir, 'update.asset');
        await downloadWithCurl(assetUrl, archivePath);

        this.emitStatus('updater.extracting', { progress: 30 }, 'Extracting files');
        await writeLog('Extracting files');
        const sourceDir = await extractArchive(archivePath, path.join(tempDir, 'src'));

        backupDir = path.join(process.env.HOME || '/tmp', '.previous-admin', 'backup', `previous-admin-backup-${Date.now()}`);
        this.emitStatus('updater.backup', { progress: 40 }, 'Creating backup');
        await writeLog(`Creating backup ${backupDir}`);
        await createBackup(this.projectDir, backupDir);

        this.emitStatus('updater.installing', { progress: 55 }, 'Installing new files');
        await writeLog(`Replacing project with ${sourceDir}`);
        await replaceProject(sourceDir, this.projectDir);

        // Update version file
        try {
          const versionFile = path.join(process.env.HOME || '', '.previous-admin', 'version.json');
          await fs.promises.mkdir(path.dirname(versionFile), { recursive: true });
          await fs.promises.writeFile(versionFile, JSON.stringify({ version }, null, 2), 'utf8');
        } catch {
          // non-fatal
        }

        this.emitStatus('updater.dependencies', { progress: 65 }, 'Installing dependencies');
        await writeLog('Installing dependencies');
        await runCommand('npm', ['install', '--prefer-offline'], this.projectDir);

        this.emitStatus('updater.building', { progress: 80 }, 'Building application');
        await writeLog('Building application');
        await runCommand('npm', ['run', 'build'], this.projectDir);

        this.emitStatus('updater.starting', { progress: 90 }, 'Starting services');
        await writeLog('Starting services');
        // try to restart services; ignore failures
        try {
          await runCommand('systemctl', ['--user', 'restart', 'previous-admin-backend', 'previous-admin-frontend']);
        } catch (err) {
          // non-fatal; log
          await writeLog(`Failed to restart services: ${err instanceof Error ? err.message : String(err)}`);
        }

        // cleanup temp dir
        try { await fs.promises.rm(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
        await writeLog('Cleanup finished');
      }

      this.emitStatus('updater.completed', { progress: 100 }, 'Update completed');
      await writeLog('Update completed successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await writeLog(`Update failed: ${message}`);
      this.emitStatus('updater.error', { progress: 0 }, message, UpdateStatus.Error);

      // Attempt rollback if backup exists
      if (backupDir) {
        try {
          this.emitStatus('updater.rollback', { progress: 0 }, 'Restoring backup');
          await writeLog(`Restoring backup from ${backupDir}`);
          await restoreBackup(backupDir, this.projectDir);
          await writeLog('Rollback completed');
        } catch (rollbackErr) {
          const rbMsg = rollbackErr instanceof Error ? rollbackErr.message : String(rollbackErr);
          await writeLog(`Rollback failed: ${rbMsg}`);
          // emit rollback failure but keep original error status
          this.emitStatus('updater.error', { progress: 0 }, `Rollback failed: ${rbMsg}`, UpdateStatus.Error);
        }
      }
    }
  }

  public getStatus(): UpdateEvent {
    return this.status;
  }

  private emitStatus(key: string, meta: Partial<UpdateEvent> = {}, message?: string, status?: UpdateStatus) {
    const evt: UpdateEvent = {
      key,
      args: meta.args,
      progress: meta.progress ?? this.status.progress,
      status: status ?? (key === 'updater.completed' ? UpdateStatus.Completed : UpdateStatus.Running),
      message: message ?? meta.message
    };
    this.status = evt;
    this.emit('status', evt);
  }

  private async simulateSteps() {
    this.emitStatus('updater.downloading', { progress: 10 }, 'DEV: downloading');
    await this.sleep(400);
    this.emitStatus('updater.extracting', { progress: 30 }, 'DEV: extracting');
    await this.sleep(400);
    this.emitStatus('updater.backup', { progress: 45 }, 'DEV: backup');
    await this.sleep(300);
    this.emitStatus('updater.installing', { progress: 60 }, 'DEV: installing');
    await this.sleep(500);
    this.emitStatus('updater.building', { progress: 80 }, 'DEV: building');
    await this.sleep(400);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// If run directly, provide a minimal CLI
if (require.main === module) {
  (async () => {
    const argv = process.argv.slice(2);
    const devFlag = argv.includes('--dev') || argv.includes('--simulate');
    const updater = new Updater();

    updater.on('status', (s: UpdateEvent) => {
      // write status file next to project data directory so frontend can read via backend
      const statusFile = path.resolve(process.cwd(), '.update-status.json');
      try {
        fs.writeFileSync(statusFile, JSON.stringify(s));
      } catch {
        // ignore
      }
      // also write to stdout as newline-delimited JSON for wrappers
      process.stdout.write(JSON.stringify(s) + '\n');
    });

    await updater.startUpdate({ dev: devFlag });
    process.exit(0);
  })();
}
