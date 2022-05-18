import * as fs from 'graceful-fs';
import path from 'path';

export function checkDirectory(folder: string) {
    if (fs.existsSync(folder))
        return;
    const next = folder.split(path.sep).reverse().slice(1).reverse().join(path.sep);
    console.log(`next`, next);
    checkDirectory(next);
    fs.mkdirSync(folder);
}
