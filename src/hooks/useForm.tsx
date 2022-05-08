import { useCallback, useRef, useState } from 'react';
import React from 'react';
import { ignore } from '../common/ignore';
import { useArray } from './useArray';

export type ControlOpts = {
    validators?: string[];
    local?: boolean;
};
export function useForm<TFormData, TSubmitResult = undefined>(
    convert: (fd: FormData) => any,
    objectClass: RealmClass<any>
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
    const addLocal = useCallback(
        (name: string) => {
            console.group('addLocal');
            const temp = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(objectClass), name)?.get?.toString()?.replace(`get ${name}() {`, ``) ?? '';
            console.log(`temp`, temp);
            const regEx = /^this[.]((\w.)+\w*)$/g;

            const local = temp
                .substring(0, temp.lastIndexOf('}') - 1)
                .replace('return ', `${name}.value =`)
                .split(' ')
                .map((x) => {
                    const result = x.replace(regEx, x.replace('this.', '').includes('.') ? "'$1'.value" : '$1.value');
                    return result;
                })
                .join(' ');
            appendLocal(local);
            console.groupEnd();
        },
        [appendLocal, objectClass]
    );
    const register = useCallback(
        (name: string, opts?: ControlOpts) => {
            if (opts?.local) {
                // const onInput = (fd: any) => Object.getOwnPropertyDescriptor(Object.getPrototypeOf(fd), name)?.get?.toString().replace('get', 'function').concat(`; ${name}.value = ${name}.bind(new FormData())();`) ?? '';
                addLocal(name);
            }
            const newOpts = { ...(opts ?? {}), validators: opts?.validators ?? [] };
            controls.current.set(name, newOpts);
            return { name, id: name };
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
            onSubmit: (fd: TFormData) => Promise<TSubmitResult>,
            onSuccess: (result?: TSubmitResult) => void = ignore,
            onFailure: (result?: Error) => void = ignore
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
                    const result = onSubmit(convert(formData));
                    result.then(onSuccess).catch(onFailure);
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
