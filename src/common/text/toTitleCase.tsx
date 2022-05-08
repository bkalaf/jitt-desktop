import { isTitleCase } from './isTitleCase';
import { isPascalCase } from './isPascalCase';
import { isSnakeCase } from './isSnakeCase';
import { isUpper } from './isUpper';
import { isCamelCase } from './isCamelCase';
import { isKebabCase } from './isKebabCase';
import { splitAt } from '../array/splitAt';
import { capitalize } from './capitalize';
import { decapitalize } from './decapitalize';
import { concatText } from './concatText';
import { toLower } from './toLower';

export function toTitleCase(str: string) {
    const splitted = isKebabCase(str)
        ? str.split('-')
        : isSnakeCase(str)
        ? str.split('_')
        : isCamelCase(str) || isPascalCase(str)
        ? splitAt(isUpper)(decapitalize(str).split('')).map(concatText)
        : isTitleCase(str)
        ? str.split(' ')
        : [str];
    return splitted.map(toLower).map(capitalize).join(' ');
}
