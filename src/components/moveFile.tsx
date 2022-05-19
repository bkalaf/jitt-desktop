import * as fs from 'graceful-fs';
import { checkDirectory } from '../common/fs/checkDirectory';
import path from 'path';


export function moveFile(src: string, destination: string) {
    checkDirectory(path.dirname(destination));
    if (!fs.existsSync(src)) {
        throw new Error('source does not exist');
    }
    fs.renameSync(src, destination);
}
