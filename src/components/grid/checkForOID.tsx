import { checkForDataAttribute } from './checkForDataAttribute';

export function checkForOID(el: HTMLElement): string | undefined {
    const result = checkForDataAttribute('oid')(el);
    if (result != null) return result;
    if (el.parentElement != null) return checkForOID(el.parentElement);
    return undefined;
}
