import { useCallback, useState, HTMLAttributes, ChangeEventHandler, useMemo } from 'react';
import { BSON, SortDescriptor } from 'realm';
import { identity, toTitleCase } from '../../common';
import { $cn } from '../../util/$cn';
import { useLog } from '../../hooks/useLog';
import { Input } from '../forms/elements/Input';
import { Select } from '../forms/elements/Select';
import { isNotNil } from '../../common/isNotNull';
import { countries } from '../../data/enums';
import { Btn } from '../providers/Btn';
import useLocalRealm from '../../hooks/useLocalRealm';
import { Indicator, IndicatorGroup } from '../Indicator';
import { Textarea } from '../forms/elements/Textarea';

export function CondField(
    Component: React.FunctionComponent<{ id: string; className: string; value: any; onChange: ChangeEventHandler<DataElement> }>,
    itemTypeIn: string[] = [],
    populatedProps: string[] = [],
    unpopulatedProps: string[] = [],
    initialProps: any,
    ...predicates: Array<(x: any) => boolean>
) {
    return function _Field(
        props: {
            type?: React.HTMLInputTypeAttribute;
            displayName?: string;
            name: string;
            isFeedbacking: boolean;
            feedback?: string;
            conversionTo?: (x: any) => any;
            conversionFrom?: (x: any) => any;
            filter?: [string, any];
            sorted?: SortDescriptor[];
            setter: (name: string, conversion: (x: any) => any) => (ev: React.ChangeEvent<DataElement>) => void;
            getter: (name: string, conversion: (x: any) => any) => any;
        } & HTMLAttributes<DataElement>
    ): JSX.Element {
        const { itemType, conversionTo, conversionFrom, displayName, getter, setter, isFeedbacking, feedback, name, ...remain } = props;
        const satisfy1 = isNotNil(getter('item-type', identity) ?? null) ? itemTypeIn.includes(getter('item-type', identity)) : true;
        const satisfy2 = (populatedProps ?? []).every((x) => isNotNil(getter(x, identity)));
        const satisfy3 = (unpopulatedProps ?? []).every((x) => isNotNil(getter(x, identity)));
        const satisfy4 = (predicates ?? []).every((f) => f(props));
        const spread = $cn(
            { ...remain, ...initialProps },
            {
                hidden: !satisfy1 || !satisfy2 || !satisfy3 || !satisfy4,
                flex: satisfy1 && satisfy2 && satisfy3 && satisfy4
            },
            'peer'
        );
        const compId = `${name}-cond-field`;
        const labelId = `${compId}-label`;
        // TODO inidicators

        const value = useMemo(() => getter(name, conversionFrom ?? identity)(), [conversionFrom, getter, name]);
        const onChange = useMemo(() => setter(name, conversionTo ?? identity), [conversionTo, name, setter]);
        return (
            <div className='relative flex flex-col items-center justify-start w-full'>
                <label id={labelId} htmlFor={compId} className='flex text-lg font-bold leading-loose tracking-wide text-center font-fira-sans indent-3 text-cyan-light font-small-caps'>
                    {displayName ?? toTitleCase(name)}
                </label>
                <Component value={value} id={compId} aria-labelledby={labelId} onChange={onChange} {...spread}></Component>
                {isFeedbacking && (
                    <small id='' className='flex text-base font-bold text-center text-red font-fira-sans underline-offset-2 decoration-red'>
                        {feedback}
                    </small>
                )}
                {/* <IndicatorGroup tag='' id={compId} /> */}
            </div>
        );
    };
}
export function ProductInsert() {
    const realm = useLocalRealm();
    const log = useLog();
    const [formData, setFormData] = useState<IProduct>({
        _id: new BSON.ObjectId(),
        brand: undefined,
        productLine: undefined,
        origin: undefined,
        description: undefined,
        dims: {},
        barcodes: {}
    });

    const setField = useCallback(
        (name: string, conversion: (x: any) => any) => {
            return function (ev: React.ChangeEvent<DataElement>) {
                const value = ev.target.value;
                setFormData((prev) => {
                    try {
                        const convertedValue = conversion(value);
                        return { ...prev, [name]: convertedValue };
                    } catch (error) {
                        log((error as any).name);
                        log((error as any).message);
                    }
                    return { ...prev, [name]: value };
                });
            };
        },
        [log]
    );
    const getField = useCallback(
        (name: string, conversion: (x: any) => any) => () => {
            try {
                return conversion(formData[name as keyof IProduct]);
            } catch (error) {
                log((error as any).name);
                log((error as any).message);
                return formData[name as keyof IProduct];
            }
        },
        [formData, log]
    );
    const onSubmit = useCallback((ev: React.FormEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);
    const onReset = useCallback((ev: React.FormEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);

    const OIDComponent = CondField(Input, [], [], [], { type: 'text', required: true, readOnly: true });
    const ShortDescriptionComponent = CondField(Input, [], [], [], { type: 'text', maxLength: 150, required: true });
    const TitleComponent = CondField(Input, [], [], [], { type: 'text', maxLength: 100, required: true });
    const BrandComponent = CondField(Select, [], [], [], { objectType: 'brand', optionMap: { label: 'name', value: '_id' }, required: true });
    const ProductLineComponent = CondField(Select, [], ['brand'], [], {
        objectType: 'product-line',
        optionMap: { label: 'name', value: '_id' },
        filter: ['brand._id == $0', () => getField('brand', identity)()?._id ?? new BSON.ObjectId()]
    });
    const OriginComponent = CondField(Select, [], [], [], {
        enumMap: countries
    });
    const ModelComponent = CondField(Input, [], [], [], { type: 'text' });
    const NotesComponent = CondField(Textarea, [], [], [], { rows: 3 });
    return (
        <form className='grid grid-cols-4 auto-cols-auto gap-x-2.5' id='product-insert-form' onSubmit={onSubmit} onReset={onReset}>
            <OIDComponent name='_id' conversionTo={(x: string) => new BSON.ObjectId(x)} conversionFrom={(x: BSON.ObjectId) => x.toHexString()} isFeedbacking={false} getter={getField} setter={setField} />
            <TitleComponent name='title' conversionTo={identity} conversionFrom={identity} isFeedbacking={false} getter={getField} setter={setField} />
            <ShortDescriptionComponent name='shortDescription' conversionTo={identity} conversionFrom={identity} isFeedbacking={false} getter={getField} setter={setField} />
            <BrandComponent
                name='brand'
                conversionTo={(x: string) => (isNotNil(x) ? realm.objectForPrimaryKey('brand', new BSON.ObjectId(x)) : undefined)}
                conversionFrom={(x: IBrand) => x?._id?.toHexString()}
                isFeedbacking={false}
                getter={getField}
                setter={setField}
            />
            <ProductLineComponent
                name='productLine'
                conversionTo={(x: string) => (isNotNil(x) ? realm.objectForPrimaryKey('product-line', new BSON.ObjectId(x)) : undefined)}
                conversionFrom={(x: any) => x?._id?.toHexString()}
                isFeedbacking={false}
                getter={getField}
                setter={setField}
            />
            <ModelComponent name='model' conversionTo={identity} conversionFrom={identity} isFeedbacking={false} getter={getField} setter={setField} />
            <NotesComponent name='notes' conversionTo={identity} conversionFrom={identity} isFeedbacking={false} getter={getField} setter={setField} />
            <OriginComponent name='origin' conversionTo={identity} conversionFrom={identity} isFeedbacking={false} getter={getField} setter={setField} />
            <footer className='flex justify-between w-full col-span-4'>
                <Btn type='submit'>Submit</Btn>
                <Btn type='reset'>Reset</Btn>
            </footer>
        </form>
    );
}
