import { useCallback, useRef, useState } from 'react';
import React from 'react';
import { ignore } from '../common/ignore';
import useLocalRealm from './useLocalRealm';
import { IDefinitionProps, ValidationFunction } from '../data/definitions';
import { RegisterFunction } from './useRegister';
import { getProperty, setProperty, snd } from '../common';
import { isString } from '../common/array/is';
import { useToggle } from './useToggle';
import { $currentUser } from '../components/globals';
import { getProps } from '../data/definitions/getProps';
import { useToast } from './useToast';
import { isNotNil } from '../common/isNotNull';

export type ControlOpts = {
    validators?: string[];
    local?: boolean;
};

export function useMap<T>(
    initial: Record<string, T> = {}
): [getter: (key: string) => T | undefined, subscribe: (key: string, value: T) => () => void, getMap: () => Record<string, T>] {
    const state = useRef<Record<string, T>>(initial);
    const setItem = useCallback((key: string, value: T) => {
        state.current[key] = value;
    }, []);
    const unsetItem = useCallback((key: string) => {
        return () => delete state.current[key];
    }, []);
    const register = useCallback(
        (key: string, value: T) => {
            setItem(key, value);
            return unsetItem(key);
        },
        [setItem, unsetItem]
    );
    const getter = useCallback((name: string) => {
        return state.current[name];
    }, []);
    const map = useCallback(() => {
        const result = state.current;
        console.log(`getMap`, result);
        return result;
    }, []);
    return [getter, register, map];
}
export function runOutputFunction(form: React.RefObject<HTMLFormElement>, [name, func]: [name: string, func: (fd: FormData) => any]) {
    if (form.current == null) throw new Error('no form ref');
    const element = form.current.elements.namedItem(name);
    if (element == null) throw new Error(`bad name: ${name}`);
    (element as DataElement).value = func(new FormData(form.current));
}
export function runOutputFolder(form: React.RefObject<HTMLFormElement>) {
    return function (pv: null, cv: [string, (fd: FormData) => any]) {
        runOutputFunction(form, cv);
        return null;
    };
}
export function convertFromFDFolder(form: React.RefObject<HTMLFormElement>) {
    return function (pv: Record<string, any>, [name, func]: [string, (x: any) => any]) {
        if (form.current == null) throw new Error('no form ref');
        const formdata = new FormData(form.current);
        console.log(`formdata`, formdata);
        console.log(Array.from(formdata.entries()));
        const current = formdata.get(name);
        return setProperty(name)(func(current))(pv);
    };
}
export function convertToFDFolder(form: React.RefObject<HTMLFormElement>) {
    return function (pv: Record<string, any>, [name, func]: [string, (x: any) => any]) {
        if (form.current == null) throw new Error('no form ref');
        const element = form.current.elements.namedItem(name);
        if (element == null) throw new Error(`bad name: ${name}`);
        const current = getProperty(name)(pv);
        (element as DataElement).value = func(current);
        return pv;
    };
}
export function runValidators(realm: Realm, form: React.RefObject<HTMLFormElement>) {
    return function (err: React.RefObject<Record<string, string[]>>, [name, validators]: [string, ValidationFunction[]]) {
        if (err.current == null) throw new Error('bad error object');
        if (form.current == null) throw new Error('no form ref');
        const element: DataElement | null = form.current.elements.namedItem(name) as DataElement | null;
        if (element == null) throw new Error(`bad name: ${name}`);
        const formdata = new FormData(form.current);
        const value = formdata.get(name);
        const results = validators.map((f) => f(value, realm));
        const msgs = results.filter(isString);
        element.setCustomValidity(msgs.length > 0 ? msgs.join('\n') : '');
        if (!element.validity.valid && !element.validity.customError) {
            msgs.push(element.validationMessage);
        }
        err.current[name] = msgs;
        return err;
    };
}

export function useElementRef<T>() {
    return useRef<T | null>(null);
}
export function useUncontrolledForm<TFormData, TSubmitResult = void>(
    convertFromFormData: (fd: any) => TFormData,
    initialData?: Record<string, any>
): [handleSubmit: (onSubmit: (fd: any) => void) => (ev: React.FormEvent) => void, register: RegisterFunction, onInput: (ev: React.FormEvent) => void, isFeedbacking: boolean, getFeedback: (name: string) => () => string] {
    const formRef = useElementRef<HTMLFormElement>();
    const realm = useLocalRealm();

    const [getValidator, subValidator, validators] = useMap<ValidationFunction[]>({});
    const [getOutput, subOutput, outputs] = useMap<(x: any) => any>({});

    const feedback = useRef<Record<string, string>>({});
    const failureToast = useToast('failure');
    const [isFeedbacking, setFeedbacking, showFeedback, hideFeedback] = useToggle(false);
    const register = useCallback(
        (
            name: string,
            opts: Omit<IDefinitionProps, 'children' | 'name'>
        ): Omit<IDefinitionProps, 'children' | 'validators' | 'convertFromFD' | 'convertToFD' | 'toOutput' | 'pattern'> & { id: string; pattern?: string } => {
            console.log('register', name, opts);
            const { validators, convertFromFD, convertToFD, toOutput, pattern, ...remain } = opts;
            subValidator(name, validators ?? []);
            if (toOutput) {
                subOutput(name, toOutput);
            }
            return { ...remain, pattern: pattern?.toString(), name, id: `${name.split('.').reverse()[0]}-control` };
        },
        [subOutput, subValidator]
    );
    const validate = useCallback((ev: React.FormEvent) => {
        hideFeedback();
        const errs: Record<string, string> = {};
        const target = ev.target as HTMLFormElement;
        const temp1 = new FormData(target as any);
        const temp2 = temp1.entries();
        const temp3 = Array.from(temp2);
        const formData: Record<string, any> = {};
        temp3.forEach(([n, v]) => {
            if (getProps(formData).includes(n)) {
                const curv = formData[n];
                formData[n] = Array.isArray(curv) ? [...curv, v] : [curv, v];
            } else {
                formData[n] = v;
            }
        });
        Object.entries(validators()).forEach(([name, validators]) => {
            const element = target.elements.namedItem(name) as DataElement;
            element.setCustomValidity('');
            const value = formData[name];
            const msgs = validators.map((f) => f(value, realm)).filter(isString);
            element.setCustomValidity(msgs.join('\n'));
            if (!element.validity.valid) errs[name] = element.validationMessage;
        });
        if (getProps(errs).length > 0) showFeedback();
        feedback.current = errs;
        return getProps(errs).length === 0;
    }, [hideFeedback, realm, showFeedback, validators]);
    const handleSubmit = useCallback(
        (onSubmit: (fd: any) => void) => {
            return function (ev: React.FormEvent) {
                ev.preventDefault();
                ev.stopPropagation();
                const target = ev.target as DataElement;
                const form = target.form as HTMLFormElement;
                const temp1 = new FormData(target as any);
                const temp2 = temp1.entries();
                const temp3 = Array.from(temp2);
                const formData: Record<string, any> = {};
                console.log(`owner`, $currentUser()?.profile.email);
                formData.owner = $currentUser()?.profile.email;
                temp3.filter(x => isNotNil(x[1])).forEach(([n, v]) => {
                    if (getProps(formData).includes(n)) {
                        const curv = formData[n];
                        formData[n] = Array.isArray(curv) ? [...curv, v] : [curv, v];
                    } else {
                        formData[n] = v;
                    }
                });
                console.log(temp2);
                console.log(temp3);
                console.log(formData);
                console.log(`formData`, formData);
                const isValid = validate(ev);
                if (!isValid) {
                    failureToast(Object.entries(feedback.current).map(snd).join('\n'), 'VALIDATION FAILED', `${Object.entries(feedback.current).map(snd).length} validation errors`);
                    return;
                };
                const fd: any = convertFromFormData(formData);
                fd.owner = $currentUser()?.profile.email;
                try {
                    onSubmit(fd);
                } catch (error) {
                    console.error(error);
                    alert(error);
                    throw error;
                }
            };
        },
        [convertFromFormData, failureToast, validate]
    );
    const onInput = useCallback(
        (ev: React.FormEvent) => {
            const target = ev.target as DataElement;
            const form = target.form as HTMLFormElement;
            if (form == null) return;
            const formData = Object.fromEntries(Object.entries(new FormData(form)));
            console.log(`formData`, formData);
            Object.entries(outputs()).forEach(([n, o]) => {
                (form.elements as any)[n].value = o(formData);
            });
        },
        [outputs]
    );
    const getFeedback = useCallback((name: string) => {
        return () => feedback.current[name] ?? '';
    }, []);
    return [handleSubmit, register, onInput, isFeedbacking, getFeedback];
}
