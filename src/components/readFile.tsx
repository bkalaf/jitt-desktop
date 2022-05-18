import * as fs from 'graceful-fs';

export function readFile(filename: string) {
    return fs.readFileSync(filename).toString();
}
