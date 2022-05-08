import { isDotNotation } from '../../util/isDotNotation';

export function setProperty(prop: string) {
    return function inner(value: any) {
        return function outer(obj: Record<string, any>): Record<string, any> {
            if (!isDotNotation(prop)) {
                if (value == null) {
                    const result = { ...obj };
                    delete result[prop];
                    return result;
                }
                return { ...obj, [prop]: value };
            }
            const [head, ...tail] = prop.split('.');
            const obj2 = obj[head] ?? {};
            return { ...obj, [head]: setProperty(tail.join('.'))(value)(obj2) };
        };
    };
}
