import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import { Fieldset, ManyOf } from '../components/forms/elements/Fieldset';
import { Input } from '../components/forms/elements/Input';
import { Select } from '../components/forms/elements/Select';
import { fromKebabToCamelCase } from '../common/text/fromKebabToCamelCase';
import { Output } from '../components/forms/elements/Output';

export const $mk = {
    ID: (attr?: any) => ({ el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true }),
    checkbox: (attr?: any) => (name: string) => ({ el: Input, name, type: 'checkbox', ...attr }),
    datetime: (attr?: any) => (name: string) => ({ el: Input, name, type: 'datetime', ...attr }),
    dd: (attr?: any) => (name: string, enumMap: Record<string, string>) => ({ el: Select, name, enumMap, ...attr }),
    text: (attr?: any) => (name: string) => ({ el: Input, type: 'text', name, ...attr }),
    tel: (attr?: any) => (name: string) => ({ el: Input, type: 'tel', name, ...attr }),
    url: (attr?: any) => (name: string) => ({ el: Input, type: 'url', name, ...attr }),
    email: (attr?: any) => (name: string) => ({ el: Input, type: 'email', name, label: 'E-mail', ...attr }),
    fieldset: (attr?: any) => (name: string) => ({ el: Fieldset, name, ...attr }),
    lookup: (attr?: any) => (kebabName: string, optionMapLabel: string) => ({
        el: Select,
        to: kebabName,
        name: fromKebabToCamelCase(kebabName),
        optionMap: { value: '_id', label: optionMapLabel },
        ...attr
    }),
    output: (attr?: any) => (name: string) => ({ el: Output, name, ...attr }),
    positiveFloat: (attr?: any) => (name: string) => ({ el: Input, type: 'number', step: 0.1, ...attr }),
    countOf: (attr?: any) => (name: string) => ({ el: Input, type: 'number', getLength: true, ...attr }),
    listOf: (attr?: any) => (name: string, el: any) => ({ el: ManyOf(el), name, ...attr }),
    embedded: (attr?: any) => (name: string) => ({ el: Fieldset, name, ...attr }),
    barcode: (attr?: any) => (name: string) => ({ el: Select, optionMap: { value: '_id', label: 'barcode' }, isBarcode: true, to: 'barcode', name, ...attr })
};
