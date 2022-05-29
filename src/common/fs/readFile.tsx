import * as fs from 'graceful-fs';

export function readFile(filename: string) {
    console.log(`readFile(filename): ${filename}`);
    return fs.readFileSync(filename).toString();
}
