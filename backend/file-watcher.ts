import chokidar from 'chokidar';
import { readConfig } from './config-manager';

export class ConfigFileWatcher {
  private watcher: any = null;
  private callback: any = null;

  constructor() {
  }

  watch(configPath, callback) {
    if (this.watcher) {
      this.unwatch();
    }

    const watcher = chokidar.watch(configPath, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
      }
    });

    let isProcessing = false;

    watcher.on('change', async () => {
      if (isProcessing) return;

      isProcessing = true;
      try {
        const config = await readConfig(configPath);
        if (config) {
          callback(config);
        }
      } catch (error) {
        console.error('Error reading config after file change:', error);
      } finally {
        setTimeout(() => {
          isProcessing = false;
        }, 1000);
      }
    });

    watcher.on('error', (error) => {
      console.error('File watcher error:', error);
    });

    this.watcher = watcher;
    this.callback = callback;
  }

  unwatch() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      this.callback = null;
    }
  }

  unwatchAll() {
    this.unwatch();
  }
}
