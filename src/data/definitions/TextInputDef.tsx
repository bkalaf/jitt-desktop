/* eslint-disable @typescript-eslint/ban-types */
import React, { HTMLInputTypeAttribute } from 'react';
import { toTitleCase } from '../../common';
import { Definition } from './Definition';
import { FormControl } from './FormControl';
import { TypeDefinitionFunction, ValidationFunction } from './index';
import { TextAreaEle } from './TextAreaEle';
import { InputEle } from './InputEle';

export function TextAreaDef({
    children,
    displayName,
    rows,
    name,
    validators,
    toSummary,
    onBlur,
    ...remain
}: {
    children: TypeDefinitionFunction<{}>;
    displayName?: string;
    name: string;
    type?: HTMLInputTypeAttribute;
    required?: boolean;
    validators?: ValidationFunction[];
    rows: number;
    onBlur?: (ev: React.FocusEvent<HTMLInputElement>) => void;
    toSummary?: (x: any) => any;
}) {
    const label = displayName ? displayName : toTitleCase(name);
    return (
        <Definition Control={TextAreaEle} Field={FormControl} name={name} displayName={label} rows={rows} validators={validators} toSummary={toSummary} onBlur={onBlur as any}>
            {children}
        </Definition>
    );
}
export function TextInputDef({
    children,
    displayName,
    name,
    type: inputType,
    validators,
    toSummary,
    onBlur,
    ...remain
}: {
    children: TypeDefinitionFunction<{}>;
    displayName?: string;
    name: string;
    type?: HTMLInputTypeAttribute;
    required?: boolean;
    validators?: ValidationFunction[];
    onBlur?: (ev: React.FocusEvent<HTMLInputElement>) => void;
    toSummary?: (x: any) => any;
}) {
    const label = displayName ? displayName : toTitleCase(name);
    const type = inputType ? inputType : 'text';
    return (
        <Definition Control={InputEle} Field={FormControl} name={name} displayName={label} type={type} validators={validators} toSummary={toSummary} onBlur={onBlur as any}>
            {children}
        </Definition>
    );
}
export function CheckboxDef({
    children,
    displayName,
    name,
    validators,
    toSummary,
    onBlur,
    ...remain
}: {
    children: TypeDefinitionFunction<{}>;
    displayName?: string;
    name: string;
    required?: boolean;
    validators?: ValidationFunction[];
    onBlur?: (ev: React.FocusEvent<HTMLInputElement>) => void;
    toSummary?: (x: any) => any;
}) {
    const label = displayName ? displayName : toTitleCase(name);
    return (
        <Definition Control={InputEle} Field={FormControl} name={name} displayName={label} type='checkbox' validators={validators} toSummary={toSummary} onBlur={onBlur as any}>
            {children}
        </Definition>
    );
}
