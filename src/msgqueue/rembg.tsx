import { runCmd, runCmdSync } from './cli';


export function rembg(outputFn: string, inputFn: string) {
    return runCmdSync('rembg', '-o', outputFn, inputFn);
}
