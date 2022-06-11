import { runCmd, runCmdSync } from './cli';

export function mogrifyToPNG(fn: string) {
    return runCmdSync('mogrify', '-format', 'png', fn);
}
