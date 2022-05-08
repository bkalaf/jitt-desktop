export function checkForDataAttribute(name: string) {
    return function (el: HTMLElement) {
        return el.dataset[name];
    };
}
