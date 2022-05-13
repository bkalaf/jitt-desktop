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

/**
 * @deprecated
 */
export function convertFormData<T>(oc: RealmClass<T>, getProperty: (typeName: string, name: string) => PropertyData, typeName: string) {
    return function (fd: FormData) {
        console.group('convertFormData');
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        const oc = schema.find((x) => x.schema.name === typeName);

        if (oc == null) throw new Error('no result');
        try {
            const res = Object.create(oc.prototype);
            console.log('res', res);
            Array.from(fd.entries()).forEach(([name, value]) => {
                const info = getProperty(typeName, name);
                console.log('info', info);
                const deserialize = info?.toDB ?? identity;
                console.log('name, value, info, deserialize', name, value, info, deserialize);
                setReferenceField(name)(res)(deserialize(value as any));
                console.log('result', res);
            });
            console.log(res);
            console.groupEnd();
            return res;
        } catch (error) {
            alert((error as any).message);
        }
    };
}
