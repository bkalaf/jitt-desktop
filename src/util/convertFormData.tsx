import { PropertyData } from '../components/grid/PropertyData';
import { identity } from '../common/identity';
import { schema } from '../data';

export function setReferenceField(name: string) {
    return function (obj: Record<string, any>) {
        return function (value: any): any {
            if (!name.includes('.')) {
                obj[name] = value;
                return obj;
            }
            const [head, ...tail] = name.split('.');
            return setReferenceField(tail.join('.'))(obj[head])(value);
        };
    };
}


