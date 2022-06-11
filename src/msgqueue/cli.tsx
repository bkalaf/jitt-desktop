import cp from 'child_process';
import { promisify } from 'util';
import { process as electronProcess } from '@electron/remote';
import { escapeFileName } from './photoPipeline';
const spawnPromise = promisify(cp.spawn);

const log = (x: string) => process.stdout.write(`${x}\n`);

export async function runCmd(exe: string, ...args: string[]) {
    console.log('trying to run', exe, args);
    await spawnPromise(exe, args, { shell: true });
    return log(`spawn executed ${exe} ${args.join(' ')}`);
}

export function runCmdSync(exe: string, ...args: string[]) {
    console.log('trying to run', exe, args);
    log(`spawn executed "${exe} ${args.map(escapeFileName).join(' ')}"`);

    const streams = cp.spawnSync(exe, args.map(escapeFileName), { shell: true });
    log(`errors: ${streams.stdout.toString()}\n`);
    log(`errors: ${streams.stderr.toString()}\n`);
    console.log('status', streams.status);
}
