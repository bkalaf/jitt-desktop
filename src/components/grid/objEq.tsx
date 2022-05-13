import { distinct } from '../../common/array/distinct';
import { deepEq } from "../../common/deepEq";

export function objEq(o1: Record<string, any>, o2: Record<string, any>) {
    if (Object.getOwnPropertyNames(o1).length != Object.getOwnPropertyNames(o2).length) return false;
    if (distinct([...Object.getOwnPropertyNames(o1), ...Object.getOwnPropertyNames(o2)]).length !== Object.getOwnPropertyNames(o1).length) return false;
    const result = Object.getOwnPropertyNames(o1).every((x) => {
        if (!deepEq(o1[x], o2[x])) return false;
        return true;
    });
    return result;
}
