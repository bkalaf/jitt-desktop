import * as fs from 'graceful-fs';
import path from 'path';
import { checkDirectory } from './checkDirectory';

export function writeFile(filename: string) {
    return (value: string) => {
        const folder = path.dirname(filename);
        checkDirectory(folder);
        fs.writeFileSync(filename, value);
    };
}
