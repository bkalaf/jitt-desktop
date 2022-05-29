import { HTMLInputTypeAttribute } from 'react';
import { faKey, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { Select } from '../components/forms/elements/Select';
import { Input } from '../components/forms/elements/Input';
import { toTitleCase } from '../common';
import { Fieldset } from '../components/forms/elements/Fieldset';
import { ObjectClass } from 'realm';
import { Output } from '../components/forms/elements/Output';
import { IField } from './IField';
import { objectClasses } from './typeInfo';


export class Field implements IField {
    prev: Field | null = null;
    next: Field | null = null;

    first(): Field {
        if (this.prev == null)
            return this;
        return this.prev.first();
    }
    getNext() {
        return this.next;
    }
    name: string | string[];
    displayName: string;
    datatype: string;
    readOnly = false;
    required = false;
    minLength?: number | undefined;
    maxLength?: number | undefined;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    pattern?: string | undefined;
    enumMap?: Record<string, string> | undefined;
    lookupMap?: { value: string; label: string; } | undefined;
    type?: HTMLInputTypeAttribute;
    multiple = false;
    size?: number | SizeProp | undefined;
    icon?: IconDefinition | undefined;
    listType?: 'list' | 'set' | 'dictionary' | 'linkingObjects';
    getLength = false;
    callToText = false;
    excludeInsert = false;
    excludeEdit = false;
    excludeGrid = false;
    excludeTabular = false;
    descriptor?: PropertyDescriptor | undefined;
    placeholder?: string;
    defaultValue?: string | number;
    Control?: React.FunctionComponent;
    Cell?: React.FunctionComponent;
    constructor(name: string, collection = []) {
        this.name = name;
        this.datatype = 'mixed';
        this.displayName = toTitleCase(name);
    }
    setControl(ctr: React.FunctionComponent, cell: React.FunctionComponent) {
        this.Control = ctr;
        this.Cell = cell;
    }
    static $new(name: string, collection = []) {
        const item = new Field(name, collection);
        return item;
    }
    asObjectId() {
        this.datatype = 'objectId';
        return this;
    }
    static ID() {
        const f = new Field('_id');
        f.asReq();
        f.immutable();
        f.asObjectId();
        f.addIcon(faKey, 'lg');
        f.excludeOn('insert');
        f.displayName = 'ID';
        return f;
    }
    withBounds(min?: number, max?: number) {
        if (this.datatype === 'string') {
            this.minLength = min;
            this.maxLength = max;
            return this;
        }
        this.min = min;
        this.max = max;
        return this;
    }

    ph(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }
    ofLookup(label: string, value = '_id', toText = false) {
        this.callToText = toText;
        this.lookupMap = { label, value };
        this.Control = Select;
        return this;
    }
    nonDeterministic(size = 1) {
        this.multiple = true;
        this.size = size;
        this.listType = 'list';
        return this;
    }
    ofDictionary() {
        this.listType = 'dictionary';
        return this;
    }
    ofSet() {
        this.listType = 'set';
        return this;
    }
    ofBacklink(objectType: string, getLength = false) {
        this.listType = 'linkingObjects';
        this.getLength = getLength;
        this.datatype = objectType;
        return this;
    }
    setDefault(d: any) {
        this.defaultValue = d;
        return this;
    }
    ofString(isRequired = false, pattern?: RegExp) {
        this.datatype = 'string';
        this.pattern = pattern?.toString();
        this.required = isRequired;
        this.type = 'text';
        this.Control = Input;

        return this;
    }
    ofInteger() {
        this.datatype = 'int';
        this.type = 'number';
        this.step = 1;
        this.Control = Input;

        return this;
    }
    ofDouble() {
        this.datatype = 'double';
        this.type = 'number';
        this.step = 0.01;
        this.Control = Input;

        return this;
    }
    ofComplex(datatype: string) {
        this.datatype = datatype;
        this.Control = Fieldset;
        return this;
    }
    asEmail() {
        this.ofString(false);
        this.type = 'email';
        this.Control = Input;
        return this;
    }
    asTel() {
        this.ofString();
        this.type = 'tel';
        this.Control = Input;
        return this;
    }
    ofFloat() {
        this.datatype = 'float';
        this.type = 'number';
        this.Control = Input;

        this.step = 0.001;
        return this;
    }
    ofBool() {
        this.datatype = 'bool';
        this.type = 'checkbox';
        this.Control = Input;
        return this;
    }
    asReq(): this {
        this.required = true;
        return this;
    }
    immutable(): this {
        this.readOnly = true;
        return this;
    }
    setDescriptor(descriptor: PropertyDescriptor) {
        this.descriptor = descriptor;
        return this;
    }
    asCalculated(typeName: string, propName: string) {
        const OC = objectClasses.find((x) => x.schema.name === typeName);
        if (OC == null)
            throw new Error('ObjectClass failed');
        const oc = new OC();
        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(oc), propName);
        if (descriptor == null)
            throw new Error('Descriptor failed');
        this.setDescriptor(descriptor);
        this.Control = Output;
        return this;
    }
    withCallToText(oc: ObjectClass) {
        // const proto = Object.getPrototypeOf(oc);
        // const descs = Object.getOwnPropertyDescriptor(proto, '');
        // this.setDescriptor(descriptor)
        // this.callToText = true;
        // return this;
    }
    asURL() {
        this.ofString(false);
        this.type = 'url';
        return this;
    }
    addIcon(icon: IconDefinition, size?: SizeProp) {
        this.icon = icon;
        this.size = size;

        return this;
    }
    setEnum(enumMap: Record<string, string>) {
        this.ofString();
        this.enumMap = enumMap;
        this.Control = Select;
        return this;
    }
    excludeOn(...views: Array<'grid' | 'tabular' | 'insert' | 'edit'>) {
        const testView = (v: 'grid' | 'tabular' | 'insert' | 'edit') => views.includes(v);
        this.excludeEdit = testView('edit');
        this.excludeInsert = testView('insert');
        this.excludeGrid = testView('grid');
        this.excludeTabular = testView('tabular');
        return this;
    }
    $(name: string) {
        const n = Field.$new(name);
        this.next = n;
        n.prev = this;
        return n;
    }
    $$() {
        function inner(el1: Field): Field[] {
            console.log(`el1`, el1);
            const e = el1.getNext();
            if (e == null)
                return [el1];
            return [el1, ...inner(e)];
        }
        return inner(this.first());
    }
}
