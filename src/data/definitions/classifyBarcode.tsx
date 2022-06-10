import { isLower, isUpper } from '../../common';


export function classifyBarcode(bc: string) {
    switch (bc.length) {
        case 8:
            return 'UPCA';
        case 10:
            return 'ISBN10';
        case 12:
            return 'UPCE';
        case 13:
            return bc.startsWith('978') || bc.startsWith('979') ? 'ISBN13' : 'EAN13';
        case 14:
            return 'ELID';

        default:
            return bc.split('').some((x: string) => isLower(x) || isUpper(x)) ? 'ASIN' : undefined;
    }
}
