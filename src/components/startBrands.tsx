import * as fs from 'graceful-fs';
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { writeFile } from '../common/fs/writeFile';
import { ifExistsDelete } from './ifExistsDelete';
import { joinText } from './joinText';
import { characters } from './MainWindow';
import { sequences } from "./sequences";


export function startBrands(log: (...args: any[]) => void) {
    function purgeFiles() {
        ifExistsDelete(files.brands);
        ifExistsDelete(files.brandsDone);
        ifExistsDelete(files.brandsTodo);
        writeFile(files.brandsTodo)(sequences().map(joinText).join('\n'));
    }
    if (fs.existsSync(files.brandsDone)) {
        const total = characters.length * characters.length * characters.length;
        const dones = readFile(files.brandsDone).split('\n');
        const actual = dones.length;
        log(`EXPECTED TOTAL`, total, actual);
        if (total === actual) {
            purgeFiles();
        } else {
            ifExistsDelete(files.brandsTodo);
            fs.writeFileSync(
                files.brandsTodo,
                sequences()
                    .map(joinText)
                    .filter((x) => !dones.includes(x))
                    .join('\n')
            );
        }
    } else {
        purgeFiles();
    }
    const result = readFile(files.brandsTodo)
        .split('\n')
        .map((x) => x.split('')) as [string, string, string][];
    log('todo', result.length);
    return result;
}
