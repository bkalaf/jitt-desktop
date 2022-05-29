/* eslint-disable react/no-children-prop */
/* eslint-disable react/boolean-prop-naming */
/* eslint-disable @typescript-eslint/ban-types */
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faFile, faFolder, faKey, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import React, { HTMLInputTypeAttribute, useCallback } from 'react';
import { useMemo } from 'react';
import { getProperty, toTitleCase } from '../../common';
import { DuotoneIcon } from '../../components/icons/DuotoneIcon';
import { ObjectId } from 'bson';
import { RegisterFunction } from '../../hooks/useRegister';
import { Definition } from './Definition';
import { Definitions } from './Definitions';
import { $cn } from '../../util/$cn';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { SortDescriptor } from 'realm';
import { provinces } from '../enums/province';
import { countries } from '../enums/country';
import { isNotNil } from '../../common/isNotNull';
import { barcodeTypes, lengthUOMS } from '../enums';
import { LookupEle } from './LookupEle';
import { DatalistEle } from './LookupEle';
import { ListEle } from './LookupEle';
import { FormControl } from './FormControl';
import { Inventory } from '..';
import { Barcode } from 'react-barcode';

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
    filter?: string;
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
    return (x: any, realm: Realm) =>
        realm.objects(collection).filtered(`${propertyName} == $0`, x).length === 0 ? true : `${toTitleCase(propertyName)} must be unique. Received: ${x}.`;
}

export function NullElement(props: any) {
    return null;
}
export function OutputEle(props: { register: RegisterFunction } & IDefinitionProps) {
    const { name, register, ...remain } = props;
    return <output {...register(name, remain)} />;
}
export function InputEle(props: { register: RegisterFunction } & IDefinitionProps) {
    const { name, register, defaultValue, init, ...remain } = props;
    const $defaultValue = defaultValue ?? (init == null ? null : init());
    const spread = $cn(remain, {}, 'peer');
    return <input defaultValue={$defaultValue} {...register(name, spread)} />;
}
export function getProps(obj: Record<string, any>) {
    return Object.getOwnPropertyNames(obj);
}

export function ListInputDef({
    children,
    displayName,
    name,
    span
}: {
    children: TypeDefinitionFunction<{}>;
    span?: number;
    displayName?: string;
    name: string;
}) {
    const label = displayName ? displayName : toTitleCase(name);

    return (
        <Definition Control={ListEle} Field={FormControl} name={name} displayName={label} span={span} toSummary={(x) => x.join(';')}>
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
        <Definition
            Control={InputEle}
            Field={FormControl}
            name={name}
            displayName={label}
            type={type}
            validators={validators}
            toSummary={toSummary}
            onBlur={onBlur as any}>
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
        <Definition
            Control={LookupEle}
            Field={FormControl}
            name={name}
            displayName={displayName}
            lookupTable={lookupTable}
            optionLabel={label}
            optionValue='_id'
            filter={filter}
            sort={sort ?? []}>
            {children}
        </Definition>
    );
}
export function OutputDef({
    children,
    name,
    displayName: $displayName,
    toSummary
}: {
    children: TypeDefinitionFunction;
    displayName?: string;
    name: string;
    toSummary: (x: any) => any;
}) {
    const displayName = $displayName ? $displayName : toTitleCase(name);

    return <Definition children={children} Control={OutputEle} Field={FormControl} displayName={displayName} name={name} toSummary={toSummary} />;
}
export function LinkingObjDef({
    toSummary,
    name,
    displayName: $displayName,
    children
}: {
    toSummary: (x: any) => any;
    name: string;
    displayName?: string;
    children: TypeDefinitionFunction<{}>;
}) {
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
        <Definition
            Control={DatalistEle}
            Field={FormControl}
            name={name}
            displayName={displayName}
            lookupTable={lookupTable}
            optionLabel={label}
            optionValue='_id'
            sort={sort ?? []}
            list={list}>
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
export function EnumDef({
    children,
    enumMap,
    defaultValue,
    displayName: $displayName,
    name
}: {
    children: TypeDefinitionFunction<{}>;
    displayName?: string;
    name: string;
    defaultValue?: any;
    enumMap: Record<string, string>;
}) {
    const displayName = $displayName ? $displayName : toTitleCase(name);

    return (
        <Definition name={name} displayName={displayName} Control={LookupEle} enumMap={enumMap} Field={FormControl} defaultValue={defaultValue}>
            {children}
        </Definition>
    );
}
export function BarcodeDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
    const realm = useLocalRealm();
    const onBlur = useCallback((ev: React.FocusEvent<HTMLInputElement>) => {
        const target = ev.target;
        const form = target.form;
        console.log(`target`, target);
        console.log(`form`, form);
        const value = ev.target.value;
        const barcode: any = new Inventory.Barcode();
        barcode.setBarcode(value);
        (form?.elements.namedItem('type') as HTMLInputElement).value = barcode.type;
        (form?.elements.namedItem('valid') as HTMLInputElement).value = barcode.valid;
    }, []);
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
            <TextInputDef name='barcode' children={children} onBlur={onBlur} toSummary={(x) => <Barcode width={1} height={75} value={x} />} />
            <EnumDef name='type' children={children} enumMap={barcodeTypes} />
            <TextInputDef name='description' children={children} />
        </Definitions>
    );
}
export function FileAllocDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <OutputDef
                name='type'
                children={children}
                toSummary={(x) =>
                    x.fsItem == null ? (
                        <DuotoneIcon icon={faFolder} primary='orange' secondary='navy' size='lg' />
                    ) : (
                        <DuotoneIcon icon={faFile} primary='violet' secondary='red' size='lg' />
                    )
                }
            />
            <TextInputDef name='name' children={children} />
            <TextInputDef name='originalName' children={children} />
            <ReferenceDef name='parent' lookupTable='fs-alloc' label='materializedPath' children={children} />
            <TextInputDef name='materializedPath' displayName='path' children={children} />
            <ReferenceDef name='fsItem' displayName='file' lookupTable='fs-item' filter='fsAlloc.@count === 0' children={children} label='name' />
        </Definitions>
    );
}
export function ItemTypeDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <TextInputDef name='name' required validators={[uniqueValidator('item-type', 'name')]}>
                {children}
            </TextInputDef>
            <ReferenceDef name='supertype' displayName='Inherit From' lookupTable='item-type' label='name'>
                {children}
            </ReferenceDef>
            <ListInputDef name='details' span={2}>
                {children}
            </ListInputDef>
            <DatalistDef name='classification' displayName='Classification' lookupTable='taxonomy' list='taxonomy-list' label='materializedPath'>
                {children}
            </DatalistDef>
            {/* <ReferenceDef name='taxonomy' displayName='Categorization' lookupTable='taxonomy' label='materializedPath'>
                {children}
            </ReferenceDef> */}
            {/* <LinkingObjDef name='taxonomy' displayName='Category Path' toSummary={(x) => x?.materializedPath}>
                {children}
            </LinkingObjDef> */}
        </Definitions>
    );
}
export function CompanyDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <TextInputDef name='name' type='text' required validators={[uniqueValidator('company', 'name')]}>
                {children}
            </TextInputDef>
            <ReferenceDef name='parent' lookupTable='company' label='name' sort={[['name', false]]}>
                {children}
            </ReferenceDef>
        </Definitions>
    );
}
export function BrandDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <TextInputDef name='name' type='text' required validators={[uniqueValidator('brand', 'name')]}>
                {children}
            </TextInputDef>
            <ReferenceDef name='company' lookupTable='company' label='name' sort={[['name']]}>
                {children}
            </ReferenceDef>
            <DatalistDef name='verifiedBrand' list='verified-brand-list' lookupTable='verified-brand' label='name' sort={[['name', false]]}>
                {children}
            </DatalistDef>
        </Definitions>
    );
}
export function RentalUnitDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <Definition
                name='facility'
                displayName='Facility'
                Control={LookupEle}
                Field={FormControl}
                lookupTable='facility'
                optionLabel='name'
                optionValue='_id'>
                {children}
            </Definition>
            <Definition name='unit' displayName='Unit #' Control={InputEle} Field={FormControl} type='text' required>
                {children}
            </Definition>
            <Definition name='size.length.value' displayName='Length' Control={InputEle} Field={FormControl} type='number' step={1}>
                {children}
            </Definition>
            <Definition name='size.length.uom' displayName='Length UOM' Control={LookupEle} Field={FormControl} enumMap={lengthUOMS}>
                {children}
            </Definition>
            <Definition name='size.width.value' displayName='Width' Control={InputEle} Field={FormControl} type='number' step={1}>
                {children}
            </Definition>
            <Definition name='size.width.uom' displayName='Width UOM' Control={LookupEle} Field={FormControl} enumMap={lengthUOMS}>
                {children}
            </Definition>
            <Definition
                name='name'
                displayName='Name'
                Control={OutputEle}
                Field={FormControl}
                toOutput={(x: any) => {
                    const toFd = (y: any) => ({
                        facility: realm.objectForPrimaryKey<{ address: { street: string; city: string; state: string }; selfStorage: { name: string } }>(
                            'facility',
                            new ObjectId(y.facility)
                        ),
                        unit: y.unit
                    });
                    const fd = toFd(x);
                    return [
                        fd.facility?.selfStorage.name,
                        [fd.facility?.address.city, fd.facility?.address.state].join(','),
                        fd.facility?.address.street.split(' ').slice(1).join(' '),
                        fd.unit
                    ].join('-');
                }}>
                {children}
            </Definition>
        </Definitions>
    );
}

export function FacilityDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <Definition
                name='selfStorage'
                displayName='Storage Name'
                optionLabel='name'
                optionValue='_id'
                lookupTable='self-storage'
                Control={LookupEle}
                Field={FormControl}>
                {children}
            </Definition>
            <Definition name='facilityNumber' displayName='Facility Number' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='email' displayName='E-mail' type='email' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='phone' displayName='Phone Number' type='tel' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.street' displayName='Street' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.suite' displayName='Suite' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.city' displayName='City' type='text' required Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition
                name='address.state'
                displayName='State / Province'
                type='text'
                required
                Control={LookupEle}
                enumMap={provinces}
                Field={FormControl}
                defaultValue='CA'>
                {children}
            </Definition>
            <Definition
                name='address.country'
                displayName='Country'
                type='text'
                required
                Control={LookupEle}
                enumMap={countries}
                Field={FormControl}
                defaultValue='US'>
                {children}
            </Definition>
            <Definition name='address.postalCode' displayName='City' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition
                name='name'
                displayName='Name'
                Control={OutputEle}
                Field={FormControl}
                toOutput={(x: any) => {
                    const fd = (x: any) => ({
                        _id: new ObjectId(x._id),
                        address: {
                            street: x['address.street'],
                            suite: x['address.suite'],
                            city: x['address.city'],
                            state: x['address.state'],
                            country: x['address.country'],
                            postalCode: x['address.postalCode']
                        },
                        facilityNumber: x.facilityNumber,
                        email: x.email,
                        phone: x.phone,
                        selfStorage: realm.objectForPrimaryKey<any>('self-storage', new ObjectId(x.selfStorage))
                    });
                    const formdata = fd(x);
                    return [
                        formdata.selfStorage?.name,
                        [formdata.address.city, formdata.address.state].join(', '),
                        formdata.address.street?.split(' ').slice(1).join(' ')
                    ]
                        .filter(isNotNil)
                        .join('-');
                }}>
                {children}
            </Definition>
        </Definitions>
    );
}
export function SelfStorageDefinition({ children }: { children: (props: Omit<IDefinitionProps, 'children'>) => JSX.Element | null }) {
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
            <Definition
                name='name'
                displayName='Name'
                required
                validators={[uniqueValidator('self-storage', 'name')]}
                type='text'
                Control={InputEle}
                Field={FormControl}>
                {children}
            </Definition>
            <Definition name='website' displayName='Website' type='url' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='facilities' displayName='Facility Count' toSummary={(x) => (x ? x.length : 0)} Control={NullElement} Field={FormControl}>
                {children}
            </Definition>
        </Definitions>
    );
}

export function TableCell(props: Omit<IDefinitionProps, 'children'>) {
    const { icon, enumMap, optionLabel, optionValue, iconSize, toSummary, tooltipFunction, name, row, isList } = props;
    console.log('props', props);
    const value = useMemo(() => (row ? getProperty(name)(row) : undefined), [row, name]);
    const tooltip = tooltipFunction ? eval(tooltipFunction)(value) : undefined;
    const output = useMemo(() => (toSummary ? toSummary(value) : value), [toSummary, value]);
    console.log('value/tooltip/output', value, tooltip, output);
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

export function InsertFormControls({
    Definition,
    isFeedbacking,
    getFeedback
}: {
    Definition: DefinedType;
    isFeedbacking: boolean;
    getFeedback: (name: string) => () => string;
}) {
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
