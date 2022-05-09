import { useCallback, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { SortDescriptor } from 'realm';
import { ControlOpts } from './useForm';
import { useRealm } from './useRealm';
import { useToast } from './useToast';
import { ignore } from '../common/ignore';
import { useSchema } from './useSchema';
import { useNavigateDown } from './useNavigateDown.1';

export function useInsertForm<T extends { _id: Realm.BSON.ObjectId }>(collection: string, sort: SortDescriptor[], convert: (fd: FormData) => T & Realm.Object) {
    const realm = useRealm();
    if (realm == null) throw new Error('no realm');

    // const query = useQuery(['selectAll', collection], () => realm.objects(collection).sorted(sort));
    const navigateDown = useNavigateDown();
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const { getProperty, getObjectClass } = useSchema();
    const isLocal = useCallback((name: string) => getProperty(collection, name)?.local ?? false, [collection, getProperty]);
    const formRef = useRef<HTMLFormElement>(null);
    const getGetFunction = useCallback(
        (name: string) => (ev: React.FormEvent<HTMLFormElement>) => {
            const functionText = (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(getObjectClass(collection)), name)?.get?.toString() ?? '')
                .replace(`get ${name}()`, 'function getter(el)')
                .concat(`;\n${name}.value = getter.bind(new FormData(el))(${ev.target as HTMLFormElement};`);
            console.log('functionText');
            eval(functionText);
        },
        [collection, getObjectClass]
    );
    const mutation = useMutation(
        ['insert', collection],
        (fd: FormData) => {
            try {
                const data = convert(fd);
                let result: undefined | (Realm.Object & T);
                realm.write(() => {
                    result = realm.create(collection, data);
                });
                return Promise.resolve(result!);
            } catch (error) {
                return Promise.reject(error);
            }
        },
        {
            onSuccess: (result: Realm.Object & T) => {
                if (result == null) throw new Error('result null');
                successToast('Inserted one (1) record.', 'INSERT SUCCESS', result._id.toHexString());
                navigateDown();
            },
            onError: (error: Error) => {
                failureToast(error.message, 'INSERT FAILED', error.name);
            }
        }
    );
    const registry = useRef<Map<string, ControlOpts>>(new Map());
    const inputEvent = useRef<Array<(ev: React.FormEvent<HTMLFormElement>) => void>>([]);
    const register = useCallback(
        (name: string, opts?: ControlOpts) => {
            registry.current.set(name, { ...opts, validators: opts?.validators ?? [] });
            if (opts?.local === true) {
                inputEvent.current = [...inputEvent.current, getGetFunction(name)];
            }
        },
        [getGetFunction]
    );
    const onInput = useCallback((ev: React.FormEvent<HTMLFormElement>) => {
        inputEvent.current.forEach((f) => f(ev));
    }, []);
    return [ignore, register, formRef, onInput];
}
