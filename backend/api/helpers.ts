/**
 * Helper utilities for API routes
 */

import { exec } from 'child_process';
import { promisify } from 'util';

interface ExecResult {
  stdout: string;
  stderr: string;
}

/**
 * Promisified version of child_process.exec
 *
 * Executes shell commands asynchronously with Promise support.
 * Use with await or .then() for cleaner async code.
 *
 * @type {Function}
 *
 * @param {string} command - Shell command to execute
 * @param {Object} [options] - Options object (optional)
 *   - cwd {string}: Working directory for command execution
 *   - env {Object}: Environment variables
 *   - timeout {number}: Timeout in milliseconds (default: no timeout)
 *   - encoding {string}: Output encoding (default: 'utf8')
 *   - maxBuffer {number}: Max size of stdout/stderr (default: 1MB)
 *
 * @returns {Promise<{stdout: string, stderr: string}>}
 *   - stdout {string}: Command standard output
 *   - stderr {string}: Command standard error output
 *
 * @throws {Error} If command execution fails or times out
 *   - error.code {number}: Exit code of command
 *   - error.stdout {string}: Standard output
 *   - error.stderr {string}: Standard error
 *
 * @example
 * try {
 *   const { stdout } = await execAsync('git status');
 *   console.log(stdout);
 * } catch (error) {
 *   console.error('Command failed:', error.message);
 * }
 *
 * @example
 * // With options
 * const { stdout } = await execAsync('git pull', { cwd: '/path/to/repo' });
 */
export const execAsync = promisify(exec) as (command: string, options?: unknown) => Promise<ExecResult>;
