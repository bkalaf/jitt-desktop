import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

export interface IField {
    name: string | string[];
    datatype: string;
    readOnly: boolean;
    required: boolean;
    displayName: string;
    minLength?: number;
    maxLength?: number;
    Control?: React.FunctionComponent;
    Cell?: React.FunctionComponent;
    min?: number;
    max?: number;
    pattern?: string;
    step?: number;
    defaultValue?: string | number;
    placeholder?: string;

    enumMap?: Record<string, string>;
    lookupMap?: { value: string; label: string; };

    type?: React.HTMLInputTypeAttribute;
    multiple: boolean;
    size?: number | SizeProp;
    icon?: IconDefinition;

    getLength: boolean;
    callToText: boolean;
    excludeInsert: boolean;
    excludeEdit: boolean;
    excludeGrid: boolean;
    excludeTabular: boolean;
    descriptor?: PropertyDescriptor;
}
