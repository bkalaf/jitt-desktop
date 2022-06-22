/* eslint-disable react/no-children-prop */
/* eslint-disable react/boolean-prop-naming */
/* eslint-disable @typescript-eslint/ban-types */
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faBanSmoking, faCheckDouble, faKey, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import React, { HTMLInputTypeAttribute } from 'react';
import { useMemo } from 'react';
import { getProperty, toTitleCase } from '../../common';
import { DuotoneIcon } from '../../components/icons/DuotoneIcon';
import { ObjectId } from 'bson';
import { Definition } from './Definition';
import { Definitions } from './Definitions';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { SortDescriptor } from 'realm';
import { LookupEle } from './LookupEle';
import { DatalistEle } from './LookupEle';
import { ListEle } from './LookupEle';
import { FormControl } from './FormControl';
import { InputEle } from './InputEle';
import { OutputEle } from './OutputEle';

export type TypeDefinitionFunction<T = {}> = React.FunctionComponent<Omit<IDefinitionProps, 'children'> & T>;

export type ValidationFunction = (x: any, realm: Realm) => boolean | string;

export type IDefinitionProps = {
    name: string;
    displayName?: string;
    icon?: IconDefinition;
    list?: string;
    iconSize?: SizeProp;
    Field: FieldFunctionComponent;
    tooltipFunction?: string;
    row?: Realm.Object & Record<string, string>;
    isList?: boolean;
    isDictionary?: boolean;
    isSet?: boolean;
    Control: (props: any) => JSX.Element | null;
    min?: number;
    max?: number;
    filter?: string[];
    maxLength?: number;
    toSummary?: (x: any) => any;
    minLength?: number;
    pattern?: RegExp;
    convertToFD?: ((x: any, realm: Realm) => string) | ((x: any) => string);
    convertFromFD?: ((x: string, realm: Realm) => any) | ((x: string) => any);
    toOutput?: (x: any) => any;
    enumMap?: Record<string, string>;
    sort?: SortDescriptor[];
    optionLabel?: string;
    optionValue?: string;
    lookupTable?: string;
    step?: number;
    multiple?: boolean;
    size?: number;
    rows?: number;
    validators?: Array<ValidationFunction>;
    required?: boolean;
    readOnly?: boolean;
    init?: () => any;
    defaultValue?: any;
    type?: HTMLInputTypeAttribute;
    children: TypeDefinitionFunction;
    span?: number;
    onBlur?: (ev: React.FocusEvent) => void;
};
export type DefinedType = React.FunctionComponent<{ row?: any; children: (props: Omit<IDefinitionProps, 'children'>) => JSX.Element }>;

export function uniqueValidator(collection: string, propertyName: string) {
    return (x: any, realm: Realm) => (realm.objects(collection).filtered(`${propertyName} == $0`, x).length === 0 ? true : `${toTitleCase(propertyName)} must be unique. Received: ${x}.`);
}

export function NullElement(props: any) {
    return null;
}
export function ListInputDef({ children, displayName, name, span }: { children: TypeDefinitionFunction<{}>; span?: number; displayName?: string; name: string }) {
    const label = displayName ? displayName : toTitleCase(name);

    return (
        <Definition Control={ListEle} Field={FormControl} name={name} displayName={label} span={span} toSummary={(x) => x.join(';')}>
            {children}
        </Definition>
    );
}
export function ReferenceDef({
    children,
    displayName: $displayName,
    name,
    lookupTable,
    label,
    sort,
    filter
}: {
    children: TypeDefinitionFunction<{}>;
    displayName?: string;
    name: string;
    sort?: SortDescriptor[];
    lookupTable: string;
    label: string;
    filter?: string;
}) {
    const displayName = $displayName ? $displayName : toTitleCase(name);
    return (
        <Definition Control={LookupEle} Field={FormControl} name={name} displayName={displayName} lookupTable={lookupTable} optionLabel={label} optionValue='_id' filter={filter ? [filter] : undefined} sort={sort ?? []}>
            {children}
        </Definition>
    );
}
export function OutputDef({ children, name, displayName: $displayName, toSummary }: { children: TypeDefinitionFunction; displayName?: string; name: string; toSummary: (x: any) => any }) {
    const displayName = $displayName ? $displayName : toTitleCase(name);

    return <Definition children={children} Control={OutputEle} Field={FormControl} displayName={displayName} name={name} toSummary={toSummary} />;
}
export function LinkingObjDef({ toSummary, name, displayName: $displayName, children }: { toSummary: (x: any) => any; name: string; displayName?: string; children: TypeDefinitionFunction<{}> }) {
    const displayName = $displayName ? $displayName : toTitleCase(name);

    return (
        <Definition name={name} displayName={displayName} toSummary={toSummary} Control={NullElement} Field={FormControl}>
            {children}
        </Definition>
    );
}
export function DatalistDef({
    children,
    displayName: $displayName,
    name,
    lookupTable,
    label,
    sort,
    list
}: {
    children: TypeDefinitionFunction<{}>;
    displayName?: string;
    name: string;
    list: string;
    sort?: SortDescriptor[];
    lookupTable: string;
    label: string;
}) {
    const displayName = $displayName ? $displayName : toTitleCase(name);
    return (
        <Definition Control={DatalistEle} Field={FormControl} name={name} displayName={displayName} lookupTable={lookupTable} optionLabel={label} optionValue='_id' sort={sort ?? []} list={list}>
            {children}
        </Definition>
    );
}
export function Template({ children }: { children: TypeDefinitionFunction<{}> }) {
    const realm = useLocalRealm();
    return (
        <Definitions>
            <Definition
                name='_id'
                displayName='ID'
                icon={faKey}
                iconSize='lg'
                tooltipFunction='x => x.toHexString()'
                required
                readOnly
                convertFromFD={(x: string) => new ObjectId(x)}
                convertToFD={(x: ObjectId) => x.toHexString()}
                init={() => new ObjectId()}
                Control={InputEle}
                Field={FormControl}>
                {children}
            </Definition>
        </Definitions>
    );
}
export function TableCell(props: Omit<IDefinitionProps, 'children'>) {
    const { icon, enumMap, optionLabel, optionValue, iconSize, toSummary, tooltipFunction, name, row, type, isList } = props;
    console.log('props', props);
    const value = useMemo(() => (row ? getProperty(name)(row) : undefined), [row, name]);
    const tooltip = tooltipFunction ? eval(tooltipFunction)(value) : undefined;
    const output = useMemo(() => (toSummary ? toSummary(value) : value), [toSummary, value]);
    console.log('value/tooltip/output', value, tooltip, output);
    if (type === 'checkbox') {
        return (
            <td className='px-2 py-0.5 text-base font-normal text-center text-white' title={tooltip}>
                {value && <DuotoneIcon icon={faCheckDouble} primary='yellowgreen' size='2x' secondary='springgreen' />}
                {!value && <DuotoneIcon icon={faBanSmoking} primary='firebrick' size='2x' secondary='goldenrod' />}
            </td>
        );
    }
    if (icon) {
        return (
            <td className='px-2 py-0.5 text-base font-normal text-center text-white' title={tooltip}>
                <DuotoneIcon icon={icon} size={iconSize} primary='white' secondary='red' />
            </td>
        );
    }
    if (optionLabel) {
        console.log(`output, optionLabel`, output, optionLabel);
        return <td className='px-2 py-0.5 text-base font-normal text-center text-white'>{output ? output[optionLabel] : null}</td>;
    }
    if (enumMap) {
        return <td className='px-2 py-0.5 text-base font-normal text-center text-white'>{enumMap[output]}</td>;
    }
    return <td className='px-2 py-0.5 text-base font-normal text-center text-white'>{output}</td>;
}

export interface IUnsubscribe {
    (): void;
}
export type FieldFunctionComponent = TypeDefinitionFunction<{ isFeedbacking: boolean; getFeedback: (name: string) => () => string }>;

export type SubscriberMap = Map<string, (x: any) => any>;

export function InsertFormControls({ Definition, isFeedbacking, getFeedback }: { Definition: DefinedType; isFeedbacking: boolean; getFeedback: (name: string) => () => string }) {
    console.log(Definition);
    return (
        <>
            <Definition>
                {(p) => {
                    const ElField = p.Field!;
                    return <ElField {...p} isFeedbacking={isFeedbacking} getFeedback={getFeedback} />;
                }}
            </Definition>
        </>
    );
}
