import React, { FieldsetHTMLAttributes } from 'react';

export function Fieldset(props: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
    return <fieldset {...props}></fieldset>;
}
