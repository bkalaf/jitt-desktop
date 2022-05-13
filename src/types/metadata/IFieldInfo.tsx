import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { HTMLInputTypeAttribute } from 'react';
import { FormElement } from '../../components/forms/elements/Input';
import { OptionElementFields } from './OptionElementFields';

export interface IFieldInfo {
    el: FormElement;
    name: string;
    readOnly?: boolean;
    required?: boolean;
    type?: HTMLInputTypeAttribute;
    icon?: IconDefinition;
    label?: string;
    minLength?: number;
    enumMap?: Record<string, string>;
    defaultValue?: string;
    pattern?: string;
    to?: string;
    optionMap?: OptionElementFields;
    hideOnInsert?: boolean;
    min?: number;
    max?: number;

    asDisplay?: boolean;
}
