import React, { useCallback, useRef, useState } from 'react';
import { useMemo } from 'react';
import { RegisterFunction, useRegister } from '../../hooks/useRegister';
import { $cn } from '../../util/$cn';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { IDefinitionProps } from './index';
import { getProps } from "./getProps";
import { DuotoneIcon } from '../../components/icons/DuotoneIcon';
import { faMessagePlus, faPlusSquare, faTrashCan } from '@fortawesome/pro-duotone-svg-icons';
import { usePreventDefault } from '../../hooks/usePreventDefault';
import ReactDOM from 'react-dom';
import { toTitleCase } from '../../common';

export function initialDictionary<TKey extends string, TValue>(keyMap: Record<string, string>, defaultValue?: Record<TKey, TValue | null>) {
    return function () {
        const result: Record<TKey, TValue | null> = {} as any;
        Object.keys(keyMap).forEach((k: string) => (result[k as TKey] = null));
        return defaultValue ?? result;
    };
}
export function EmbeddedEle(outer: { Controls: [string, any][] }) {
    return function InnerEmbedded(props: { register: RegisterFunction } & IDefinitionProps) {
        const realm = useLocalRealm();

        const {
            name,
            register,
            defaultValue,
            init,
            lookupTable,
            optionLabel,
            optionValue,
            enumMap,
            sort,
            list,
            span,
            displayName: $displayName,
            ...remain
        } = props;
        const spread = $cn(remain, {}, 'hidden peer flex');
        const displayName = $displayName ? $displayName : toTitleCase(name);
        return outer.Controls.map(([key, Comp]) => {
            const newName = `${name}.${key}`;

            return (
                <div key={newName} className='flex flex-col'>
                    <label className='flex'>{displayName}</label>
                    <Comp {...register(newName, spread)} />
                </div>
            );
        });
    };
}
export function DictionaryControl<TKey extends string, TValue>(
    props: Omit<IDefinitionProps, 'children'> & {
        getFeedback: (name: string) => () => string;
        isFeedbacking: boolean;
        keyMap: Record<string, string>;
    }
) {
    const { Control, defaultValue, keyMap, displayName: $displayName, name, optionLabel, optionValue, isFeedbacking, getFeedback, ...remain } = props;
    const register = useRegister();
    const feedback = useMemo(() => getFeedback(name)(), [getFeedback, name]);
    const displayName = $displayName ? $displayName : toTitleCase(name);
    const dictionary = initialDictionary(keyMap, defaultValue)();
    const spread = $cn(
        {},
        {
            'col-span-2 grid-cols-2': getProps(keyMap).length / 2 < 5,
            'col-span-3 grid-cols-3': getProps(keyMap).length / 2 >= 5 && getProps(keyMap).length / 3 < 6,
            'col-span-4 grid=cols-4': getProps(keyMap).length / 3 >= 6
        },
        'grid border border-black bg-sky-light rounded-lg shadow-lg shadow-red text-black font-fira-sans font-semibold text-lg'
    );
    return (
        <fieldset {...spread}>
            <legend>{displayName}</legend>
            {Object.entries(dictionary).map(([k, v]) => {
                return (
                    <div key={k} className='flex flex-row'>
                        <label className='flex justify-start'>{keyMap[k]}</label>
                        {Control!({
                            name: `${name}.${k}`,
                            register: register,
                            defaultValue: v,
                            className:
                                'flex text-black bg-white border border-black py-0.5 px-2 font-fira-sans font-normal text-base rounded-lg shadow-inner shadow-black peer',
                            ...({ ...remain, optionLabel, optionValue } as any)
                        })}
                    </div>
                );
            })}
        </fieldset>
    );
}
export function ListEle(props: { register: RegisterFunction } & IDefinitionProps) {
    const realm = useLocalRealm();

    const { name, register, defaultValue, init, lookupTable, optionLabel, optionValue, enumMap, sort, list, span, ...remain } = props;
    const spread = $cn(remain, {}, 'hidden peer');
    const prevent = usePreventDefault();
    const [backing, setBacking] = useState<string[]>(defaultValue ?? []);
    const detailsSpread = $cn(
        { open: backing.length > 0 },
        {
            'col-span-2': span === 2,
            'col-span-3': span === 3,
            'col-span-4': span === 4
        },
        'flex flex-col'
    );
    const [item, setItem] = useState<string>('');
    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setItem(ev.target.value);
    }, []);
    return (
        <>
            {ReactDOM.createPortal(<form id={`${name}-form`}></form>, document.getElementById('modal-root')!)}
            <select multiple size={5} value={backing} {...register(name, spread)}>
                {backing.map((itemLabel) => (
                    <option value={itemLabel} key={itemLabel} />
                ))}
            </select>
            <details {...detailsSpread}>
                <summary className='flex flex-row'>
                    <input
                        form={`${name}-form`}
                        type='text'
                        id={`${name}-list-input`}
                        className='flex px-2 py-0.5 border w-full border-black rounded-lg shadow-inner shadow-blue-dark text-base font-fira-sans font-normal'
                        onChange={onChange}
                        value={item}
                    />
                    <button
                        type='button'
                        onClick={(ev: React.MouseEvent) => {
                            ev.preventDefault();
                            ev.stopPropagation();

                            setBacking((prev) => [...prev, item]);
                            setItem('');
                        }}
                        className='inline-flex w-6 text-base text-white border border-black rounded-lg shadow-inner shadow-red bg-blue-dark font-fira-sans'>
                        <DuotoneIcon icon={faPlusSquare} primary='yellow' secondary='dodgerblue' size='lg' noBlock className='flex items-center w-6 h-6' />
                    </button>
                </summary>
                <ol className='flex flex-col pt-5'>
                    {backing.map((itemLabel, index) => {
                        return (
                            <li key={index} className='flex flex-row w-full font-bold text-black border border-black rounded-lg bg-cyan-light'>
                                <span className='flex flex-grow px-3 py-0.5'>{itemLabel}</span>
                                <button
                                    type='button'
                                    className='inline-flex w-6 text-base text-white border border-black rounded-lg shadow-inner shadow-red bg-blue-dark font-fira-sans'
                                    onClick={(ev: React.MouseEvent) => setBacking((prev) => prev.filter((x, ix) => x !== itemLabel))}>
                                    <DuotoneIcon primary='yellow' secondary='red' icon={faTrashCan} noBlock size='lg' className='flex items-center w-6 h-6' />
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </details>
        </>
    );
}
export function DatalistEle(props: { list: string; register: RegisterFunction } & IDefinitionProps) {
    const realm = useLocalRealm();

    const { name, register, defaultValue, init, lookupTable, optionLabel, optionValue, enumMap, sort, list, ...remain } = props;
    const $defaultValue = '';
    const spread = $cn(remain, {}, 'peer');

    return (
        <>
            <input list={list} {...register(name, spread)} />
        </>
    );
}
export function LookupEle(props: { register: RegisterFunction } & IDefinitionProps) {
    const realm = useLocalRealm();
    const { name, register, defaultValue, init, lookupTable, optionLabel, optionValue, enumMap, sort, filter, ...remain } = props;
    const $defaultValue = defaultValue ?? (init == null ? null : init());
    const spread = $cn(remain, {}, 'peer');
    console.log(`lookup`, lookupTable, optionValue, optionLabel);
    const data = useMemo(() => (lookupTable ? realm.objects<Record<string, any>>(lookupTable ?? '').snapshot() : undefined), [lookupTable, realm]);
    console.log(data);
    const map = useMemo(
        () =>
            enumMap && getProps(enumMap).length > 0
                ? [['', 'Choose from...'], ...Object.entries(enumMap)]
                : [
                      ['', 'Choose from...'],
                      ...((filter ? data?.filtered(filter) : data)
                          ?.map((x) => [x[optionValue ?? ''], x[optionLabel ?? '']] as [string, string])
                          ?.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0)) ?? [])
                  ],
        [data, enumMap, filter, optionLabel, optionValue]
    );
    console.log(`map`, map);
    return (
        <select autoComplete='' defaultValue={$defaultValue} {...register(name, spread)}>
            {useMemo(() => map.map(([value, label]) => <option key={value} value={value} label={label} />), [map])}
        </select>
    );
}
