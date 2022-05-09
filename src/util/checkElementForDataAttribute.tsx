export function checkElementForDataAttribute(name: string) {
    return function (el: HTMLElement) {
        return el.dataset[name];
    };
}
