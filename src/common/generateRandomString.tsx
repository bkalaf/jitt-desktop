import { charRange } from './array/charRange';
import { createFrom } from './array/createFrom';

export const chars = {
    lower: charRange('a', 'z'),
    upper: charRange('A', 'Z'),
    digit: charRange('0', '9'),
    symbols: ['-'.charCodeAt(0), '_'.charCodeAt(0)]
};
export function generateRandomString(len: number) {
    const arr = createFrom(() => Math.random(), len);
    const chs = [...chars.lower, ...chars.upper, ...chars.digit, ...chars.symbols];
    return arr.map((x) => String.fromCharCode(chs[Math.floor(x * chs.length)])).join('');
}
