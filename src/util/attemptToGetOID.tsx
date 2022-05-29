import { checkElementForDataAttribute } from './checkElementForDataAttribute';

export function attemptToGetOID(el: HTMLElement): string | undefined {
    const result = checkElementForDataAttribute('oid')(el);
    if (result != null) return result;
    if (el.parentElement != null) return attemptToGetOID(el.parentElement);
    return undefined;
}
export function attemptToGetID(el: HTMLElement): string | undefined {
    const result = checkElementForDataAttribute('id')(el);
    if (result != null) return result;
    if (el.parentElement != null) return attemptToGetID(el.parentElement);
    return undefined;
}