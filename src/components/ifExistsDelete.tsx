import * as fs from 'graceful-fs';

export function ifExistsDelete(fn: string) {
    if (fs.existsSync(fn)) {
        return fs.rmSync(fn);
    }
}
