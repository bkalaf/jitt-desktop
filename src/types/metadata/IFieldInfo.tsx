import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { HTMLInputTypeAttribute } from 'react';
import { FormElement } from '../../components/forms/elements/Input';
import { OptionElementFields } from './OptionElementFields';

export interface IFieldInfo {
    el: FormElement;
    name: string;
    readOnly?: boolean;
    required?: boolean;
    step?: number;
    type?: HTMLInputTypeAttribute;
    placeholder?: string;
    icon?: IconDefinition;
    isList?: boolean;
    label?: string;
    minLength?: number;
    enumMap?: Record<string, string>;
    defaultValue?: string;
    pattern?: string;
    concat?: boolean;
    to?: string;
    optionMap?: OptionElementFields;
    hideOnInsert?: boolean;
    isBarcode?: boolean;
    min?: number;
    max?: number;
    getLength?: boolean;
    asDisplay?: boolean;
    iconTrue?: IconDefinition;
    iconFalse?: IconDefinition;
}
