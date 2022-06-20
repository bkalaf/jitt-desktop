import { checkElementForDataAttribute } from './checkElementForDataAttribute';

export function attemptToGetFileName(el: HTMLElement): string | undefined {
    const result = checkElementForDataAttribute('filename')(el);
    if (result != null)
        return result;
    if (el.parentElement != null)
        return attemptToGetFileName(el.parentElement);
    return undefined;
}
