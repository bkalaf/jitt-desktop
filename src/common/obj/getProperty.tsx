export function getProperty(name: string) {
    return function (obj: Record<string, any>): any {
        if (!name.includes('.')) {
            return obj[name];
        }
        const [head, ...tail] = name.split('.');
        return getProperty(tail.join('.'))(obj[head] ?? {});
    };
}
