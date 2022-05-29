import { PropertyName } from 'typescript';
import { toTitleCase } from '../common';
import { zip } from '../common/array/zip';

export function calculateColumnList(
    typeName: string,
    partial: string[],
    ...replacements: [indexToReplace: string, displayName: string][]
): [typeName: string, PropertyName: string, displayName: string][] {
    const replacer = Object.fromEntries(replacements);
    const keys = Object.getOwnPropertyNames(replacer);
    const replaced = [
        'ID',
        ...partial.map((x, ix) => {
            if (!keys.includes(ix.toString())) return toTitleCase(x);
            return replacer[ix.toString()];
        })
    ];
    const names = ['_id', ...partial];
    return zip(names, replaced).map((arr) => [typeName, ...arr]);
}
