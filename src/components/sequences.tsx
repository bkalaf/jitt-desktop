import { characters } from './MainWindow';

export function sequences() {
    const result: [string, string, string][] = [];
    for (let i1 = 0; i1 < characters.length; i1++) {
        const el1 = characters[i1];
        for (let i2 = 0; i2 < characters.length; i2++) {
            const el2 = characters[i2];
            for (let i3 = 0; i3 < characters.length; i3++) {
                const el3 = characters[i3];
                // for (let i4 = 0; i4 < characters.length; i4++) {
                //     const el4 = characters[i4];
                // }
                result.push([el1, el2, el3]);
            }
        }
    }
    return result;
}
