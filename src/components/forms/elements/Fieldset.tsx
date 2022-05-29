import React, { FieldsetHTMLAttributes } from 'react';
import { FormEl, Input } from './Input';
import { Select } from './Select';

export function Fieldset(props: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
    return <fieldset {...props}></fieldset>;
}

export function ManyOf2(props: { El: typeof Input | typeof Select; value: any[] }) {
    const { El, value } = props;
    return (
        <>
            {value.map((x, ix) => (
                <El value={x} key={ix} />
            ))}
        </>
    );
}

export function ManyOf(El: typeof Input | typeof Select) {
    return (props: { value: any[] }) => ManyOf2({ El, value: props.value });
}
