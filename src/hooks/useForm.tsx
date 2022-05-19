import { useCallback, useRef, useState } from 'react';
import React from 'react';
import { ignore } from '../common/ignore';
import { useArray } from './useArray';
import { useMetaDataContext } from '../components/Toaster';
import { useRoutedCollection } from './useRoutedCollection';
import { convertFromFormData } from '../components/convertFromFormData';
import { useLocalRealm } from './useLocalRealm';

export type ControlOpts = {
    validators?: string[];
    local?: boolean;
};
export function useForm<TFormData, TSubmitResult = undefined>(
    convert: (fd: FormData) => Promise<any>,
    objectClass: () => any
): [
    handleSubmit: (
        onSubmit: (fd: TFormData) => Promise<TSubmitResult>,
        onSuccess?: (result?: TSubmitResult) => void,
        onFailure?: (result?: Error) => void
    ) => (ev: React.FormEvent) => void,
    register: (name: string, opts?: ControlOpts) => React.HTMLAttributes<HTMLElement>,
    formRef: React.RefObject<HTMLFormElement>,
    onInput: (ev: React.FormEvent<HTMLFormElement>) => void
] {
    const { arr: locals, append: appendLocal, remove: deleteLocal } = useArray<string>([]);
    const formRef = useRef<HTMLFormElement | null>(null);
    const controls = useRef<Map<string, ControlOpts & { validators: string[] }>>(new Map());
    const unregister = useCallback((key: string) => {
        controls.current?.delete(key);
    }, []);
    const { getFormPayload, getInfoFor } = useMetaDataContext();
    const [collection] = useRoutedCollection();
    const realm = useLocalRealm();
    const addLocal = useCallback(
        (name: string) => {
            console.group('addLocal');
            const proto = Object.getPrototypeOf((getFormPayload(collection) as any)());
            console.log('proto', proto);
            const descriptor = Object.getOwnPropertyDescriptor(proto, name);
            console.log('descriptor', descriptor);
            const funcText = descriptor?.get?.toString();
            console.log('funcText', funcText);
            if (!formRef.current) throw Error('bad ref');
            const formData = new FormData(formRef.current);
            const fd = convertFromFormData((getFormPayload(collection) as any)(), getInfoFor, collection, realm)(formData);
            console.log('formData', formData, 'fd', fd);
            const revisedText = `${funcText?.replace(
                `get ${name}`,
                `document.getElementById(${formRef.current.id}).elements.namedItem(${name}).value = function get${name}`
            )}.bind(convertFromFormData((getFormPayload(collection) as any)(), getInfoFor, collection, realm)(new FormData(document.getElementById(${
                formRef.current.id
            }))}))()`;
            console.log(`revistedText`, revisedText);
            appendLocal(revisedText);
            console.groupEnd();
        },
        [appendLocal, collection, getFormPayload, getInfoFor, objectClass, realm]
    );
    const register = useCallback(
        (name: string, opts?: ControlOpts) => {
            console.log('register', name, opts);
            if (opts?.local) {
                console.log('register oninput');
                // const onInput = (fd: any) => Object.getOwnPropertyDescriptor(Object.getPrototypeOf(fd), name)?.get?.toString().replace('get', 'function').concat(`; ${name}.value = ${name}.bind(new FormData())();`) ?? '';

                addLocal(name);
            }
            const newOpts = { ...(opts ?? {}), validators: opts?.validators ?? [] };
            controls.current.set(name, newOpts);
            return { ...opts, name, id: name };
        },
        [addLocal]
    );
    const validate = useCallback(() => {
        if (formRef.current == null) throw new Error('formref not set');
        if (controls.current == null) throw new Error('controls not set');

        const getElement = (name: string) => formRef.current!.elements.namedItem(name) as DataElement;
        Array.from(controls.current.keys()).map((key) => {
            const { validators } = controls.current.get(key)!;
            const el = getElement(key);
            const result = validators.map((str) => eval(str)(el.value));
            const msgs = result.filter((x) => typeof x === 'string');
            const message = msgs.join('\n');
            el.setCustomValidity(message);
        });
        return formRef.current.reportValidity();
    }, []);
    const handleSubmit = useCallback(
        (
            onSubmit: (fd: TFormData) => Promise<TSubmitResult>
            // onSuccess: (result?: TSubmitResult) => void = ignore,
            // onFailure: (result?: Error) => void = ignore
        ) => {
            return function (ev: React.FormEvent) {
                console.log('submit event', ev);
                ev.preventDefault();
                ev.stopPropagation();
                try {
                    if (formRef.current == null) throw new Error('formref not set');
                    const formData = new FormData(formRef.current);
                    console.log('fd', Array.from(formData.entries()));
                    if (!validate()) throw new Error('Did not pass validation');
                    const result = convert(formData).then(onSubmit);
                    return result;
                    // result.then(onSuccess).catch(onFailure);
                } catch (error) {
                    console.error((error as any).message);
                    process.stdout.write((error as any).message);
                    throw error;
                }
            };
        },
        [convert, validate]
    );
    const onInput = useCallback(
        (ev: React.FormEvent<HTMLFormElement>) => {
            // return eval(locals.map(f => f(convert(new FormData(ev.target as HTMLFormElement)))).join('\n'));
            locals.map(eval);
        },
        [locals]
    );
    return [handleSubmit, register, formRef, onInput];
}

// const str = 'const x = this.address.city + this.selfStorage.name + this.state';
// const reg = /^this[.]((\w.)+\w*)$/g;
// console.log(str.split(' ').map(x => x.replace(reg, 'dd.$1.value')).join(' '));
