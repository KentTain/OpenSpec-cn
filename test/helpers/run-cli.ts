import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');
const cliEntry = path.join(projectRoot, 'dist', 'cli', 'index.js');

let buildPromise: Promise<void> | undefined;

interface RunCommandOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

interface RunCLIOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  input?: string;
  timeoutMs?: number;
}

export interface RunCLIResult {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
  /** stderr with macOS Keychain trust-settings noise stripped. */
  get cleanStderr(): string;
  timedOut: boolean;
  command: string;
}

/** Pattern matching the macOS Keychain certificate trust-settings noise that
 *  can leak to stderr on some macOS configurations. */
const CERT_NOISE_RE = /^ERROR: failed to copy trust settings of system certificate-\d+\n?/gm;

function stripCertNoise(stderr: string): string {
  return stderr.replace(CERT_NOISE_RE, '');
}

function runCommand(command: string, args: string[], options: RunCommandOptions = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? projectRoot,
      env: { ...process.env, ...options.env },
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (error) => reject(error));
    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        const reason = signal ? `signal ${signal}` : `exit code ${code}`;
        reject(new Error(`Command failed (${reason}): ${command} ${args.join(' ')}`));
      }
    });
  });
}

export async function ensureCliBuilt() {
  if (existsSync(cliEntry)) {
    return;
  }

  if (!buildPromise) {
    buildPromise = runCommand('pnpm', ['run', 'build']).catch((error) => {
      buildPromise = undefined;
      throw error;
    });
  }

  await buildPromise;

  if (!existsSync(cliEntry)) {
    throw new Error('CLI entry point missing after build. Expected dist/cli/index.js');
  }
}

export async function runCLI(args: string[] = [], options: RunCLIOptions = {}): Promise<RunCLIResult> {
  await ensureCliBuilt();

  const finalArgs = Array.isArray(args) ? args : [args];
  const invocation = [cliEntry, ...finalArgs].join(' ');

  return new Promise<RunCLIResult>((resolve, reject) => {
    const child = spawn(process.execPath, [cliEntry, ...finalArgs], {
      cwd: options.cwd ?? projectRoot,
      env: {
        ...process.env,
        OPEN_SPEC_INTERACTIVE: '0',
        ...options.env,
      },
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    // Prevent child process from keeping the event loop alive
    child.unref();

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timeout = options.timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGKILL');
        }, options.timeoutMs)
      : undefined;

    child.stdout?.setEncoding('utf-8');
    child.stdout?.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr?.setEncoding('utf-8');
    child.stderr?.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('error', (error) => {
      if (timeout) clearTimeout(timeout);
      // Explicitly destroy streams to prevent hanging handles
      child.stdout?.destroy();
      child.stderr?.destroy();
      child.stdin?.destroy();
      reject(error);
    });

    child.on('close', (code, signal) => {
      if (timeout) clearTimeout(timeout);
      // Explicitly destroy streams to prevent hanging handles
      child.stdout?.destroy();
      child.stderr?.destroy();
      child.stdin?.destroy();
      const rawStderr = stderr;
      resolve({
        exitCode: code,
        signal,
        stdout,
        stderr,
        get cleanStderr() { return stripCertNoise(rawStderr); },
        timedOut,
        command: `node ${invocation}`,
      });
    });

    if (options.input && child.stdin) {
      child.stdin.end(options.input);
    } else if (child.stdin) {
      child.stdin.end();
    }
  });
}

export const cliProjectRoot = projectRoot;
