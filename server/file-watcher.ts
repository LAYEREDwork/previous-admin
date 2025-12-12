import chokidar from 'chokidar';
import { readConfig } from './config-manager';

export class ConfigFileWatcher {
  constructor() {
    this.watchers = new Map();
    this.callbacks = new Map();
  }

  watch(username, configPath, callback) {
    if (this.watchers.has(username)) {
      this.unwatch(username);
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

    this.watchers.set(username, watcher);
    this.callbacks.set(username, callback);
  }

  unwatch(username) {
    const watcher = this.watchers.get(username);
    if (watcher) {
      watcher.close();
      this.watchers.delete(username);
      this.callbacks.delete(username);
    }
  }

  unwatchAll() {
    for (const [username] of this.watchers) {
      this.unwatch(username);
    }
  }
}
