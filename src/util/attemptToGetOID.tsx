import { checkElementForDataAttribute } from './checkElementForDataAttribute';

export function attemptToGetOID(el: HTMLElement): string | undefined {
    const result = checkElementForDataAttribute('oid')(el);
    if (result != null) return result;
    if (el.parentElement != null) return attemptToGetOID(el.parentElement);
    return undefined;
}
