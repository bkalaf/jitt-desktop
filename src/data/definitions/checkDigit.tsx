import { classifyBarcode } from "./classifyBarcode";

export function calculateFullBarcodeWithCheckDigit(bc: string) {
    const [actual, ...remain] = `${bc}0`.padStart(13, '0').split('').reverse();
    const head = remain.reverse();
    const summed = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3]
        .map((x: number, ix: number) => parseInt(head[ix], 10) * x)
        .reduce((pv: number, cv: number) => pv + cv, 0);
    const modulo = summed % 10;
    const subtracted = 10 - modulo;
    const expected = subtracted === 10 ? 0 : subtracted;
    return [bc, expected.toString()].join('');
}
export function checkDigit(bc: string): [passed: boolean, actual: number, expected: number] {
    const type = classifyBarcode(bc);
    if (type === 'ASIN' || type === 'ELID' || type == null)
        return [false, 0, 0];
    const [actual, ...remain] = bc.padStart(13, '0').split('').reverse();
    const head = remain.reverse();
    const summed = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3]
        .map((x: number, ix: number) => parseInt(head[ix], 10) * x)
        .reduce((pv: number, cv: number) => pv + cv, 0);
    const modulo = summed % 10;
    const subtracted = 10 - modulo;
    const expected = subtracted === 10 ? 0 : subtracted;
    return [parseInt(actual, 10) === expected, parseInt(actual, 10), expected] as [passed: boolean, actual: number, expected: number];
}
