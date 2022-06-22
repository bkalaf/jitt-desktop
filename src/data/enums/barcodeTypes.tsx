export const barcodeTypes = {
    UPCA: 'UPC-A',
    ISBN10: 'ISBN-10',
    UPCE: 'UPC-E',
    ISBN13: 'ISBN-13',
    EAN13: 'EAN-13',
    ASIN: 'ASIN',
    ELID: 'ELID',
    SKU: 'SKU'
};
export type BarcodeType = keyof typeof barcodeTypes;

export const isUPCLike = (x: BarcodeType) => ['UPCA', 'UPCE', 'ISBN10', 'ISBN13', 'EAN13'].includes(x);