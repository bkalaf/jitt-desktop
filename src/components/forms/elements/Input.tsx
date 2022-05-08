import React, { InputHTMLAttributes } from 'react';
import { Fieldset } from './Fieldset';
import { Output } from './Output';
import { Select } from './Select';
import { Textarea } from './Textarea';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} />;
}

export type FormElement = typeof Input | typeof Select | typeof Fieldset | typeof Output | typeof Textarea;

export type FormEl = React.FunctionComponent<React.HTMLAttributes<HTMLElement>>;
