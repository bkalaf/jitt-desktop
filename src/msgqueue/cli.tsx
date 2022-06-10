import cp from 'child_process';
import { promisify } from 'util';
import { appSettings } from '../settings';

const spawnPromise = promisify(cp.spawn)

const log = (x: string) => process.stdout.write(`${x}\n`)
async function runCmd(exe: string, ...args: string[]) {    
    await spawnPromise(exe, args, { shell: true });
    return log(`spawn executed ${exe} ${args.join(' ')}`);
}

export const convertCSV = () => runCmd('ssconvert', appSettings.files.printLabelsCSV, appSettings.files.printLabelsXLSX);