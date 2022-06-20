import * as fs from 'graceful-fs';
import { files } from '../config';
import { readFile } from '../common/fs/readFile';


export function finishBrands(log: (...args: any[]) => void) {
    log(`output file: ${files.brands}`);
    const data = readFile(files.brands).split('\n');
    log('totalBrands', data.length);
    const uniqueBrands = new Set(data);
    log('uniqueBrands', uniqueBrands.size);
    const result = { uniqueBrands: Array.from(uniqueBrands.entries()) };
    fs.writeFileSync(files.brandListings, JSON.stringify(result));
    log('output written');
    localStorage.setItem('brandsLastFetched', new Date(Date.now()).toString());
}
