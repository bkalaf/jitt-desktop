import * as fs from 'graceful-fs';
import { files } from '../config';


export function writeBrands(entry: string, brands: string[]) {
    if (brands.length > 0) {
        fs.appendFileSync(files.brands, `${brands.join('\n')}\n`);
    }
    fs.appendFileSync(files.brandsDone, entry);
}
