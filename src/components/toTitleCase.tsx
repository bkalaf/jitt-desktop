import { isSnakeCase, isPascalCase, isUpper, isTitleCase } from './TopBar';
import { isCamelCase } from "./isCamelCase";
import { isKebabCase } from "./isKebabCase";
import { splitAt } from "./splitAt";
import { capitalize } from "./capitalize";
import { decapitalize } from "./decapitalize";

export function toTitleCase(str: string) {
    const splitted = isKebabCase(str)
        ? str.split('-')
        : isSnakeCase(str)
            ? str.split('_')
            : isCamelCase(str) || isPascalCase(str)
                ? splitAt(isUpper)(decapitalize(str).split('')).map((x) => x.join(''))
                : isTitleCase(str)
                    ? str.split(' ')
                    : [str];
    return splitted
        .map((x) => x.toLowerCase())
        .map(capitalize)
        .join(' ');
}
