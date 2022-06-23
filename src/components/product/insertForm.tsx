import { BSON } from 'realm';
import { isNil, isNotNil } from '../../common/isNotNull';
import { useElementRef, useUncontrolledForm } from '../../hooks/useForm';
import useLocalRealm from '../../hooks/useLocalRealm';
import { FormProvider } from '../providers/FormProvider';
import { useCallback, useMemo, useState } from 'react';
import { ignore } from '../../common';
import { Control } from '../forms/Control';
import { faCircleEllipsis, faKey, faLayerGroupPlus, faTrashCan } from '@fortawesome/pro-duotone-svg-icons';
import { InputEle } from '../../data/definitions/InputEle';
import { LookupEle } from '../../data/definitions/LookupEle';
import { TextAreaEle } from '../../data/definitions/TextAreaEle';
import { bookTypes, countries, lengthUOMS, mediaTypes } from '../../data/enums';
import { tryUtter } from '../MainWindow';
import { colors, colorsSelect } from '../../data/enums/colors';
import { weightUOMSSelect } from '../../data/enums/weightUOMS';
import { useToggle } from '../../hooks/useToggle';
import { DuotoneIcon } from '../icons/DuotoneIcon';
import { mediaTypeToItemType } from '../../data/enums/mediaTypes';
import { UsedBarcode } from '../../data/collections/BarcodeDefinition';

export function Disclosure({ summary, details, detailCn, summaryCn }: { summary: string; details: JSX.Element; detailCn: string; summaryCn: string }) {
    return (
        <details className={detailCn}>
            <summary className={summaryCn}>{summary}</summary>
            {details}
        </details>
    );
}
export function InsertProductForm() {
    const realm = useLocalRealm();
    const convertFormData = (fd: any) => ({
        _id: new BSON.ObjectId(fd?._id),
        shortDescription: fd?.shortDescription,
        model: fd?.model,
        title: fd?.title,
        notes: fd?.notes,
        origin: fd?.origin,
        color: fd?.color,
        dims: {
            long: {
                value: fd?.['dims.long.value'],
                uom: fd?.['dims.long.uom'],
                remainder: isNotNil(fd?.['dims.long.remainder.value'])
                    ? undefined
                    : {
                          value: fd?.['dims.long.remainder.value'],
                          uom: fd?.['dims.long.remainder.uom']
                      }
            },
            width: {
                value: fd?.['dims.width.value'],
                uom: fd?.['dims.width.uom'],
                remainder: isNotNil(fd?.['dims.width.remainder.value'])
                    ? undefined
                    : {
                          value: fd?.['dims.width.remainder.value'],
                          uom: fd?.['dims.width.remainder.uom']
                      }
            },
            height: {
                value: fd?.['dims.height.value'],
                uom: fd?.['dims.height.uom'],
                remainder: isNotNil(fd?.['dims.height.remainder.value'])
                    ? undefined
                    : {
                          value: fd?.['dims.height.remainder.value'],
                          uom: fd?.['dims.height.remainder.uom']
                      }
            },
            weight: {
                value: fd?.['dims.weight.value'],
                uom: fd?.['dims.weight.uom'],
                remainder: isNotNil(fd?.['dims.weight.remainder.value'])
                    ? undefined
                    : {
                          value: fd?.['dims.weight.remainder.value'],
                          uom: fd?.['dims.weight.remainder.uom']
                      }
            }
        },
        itemType: isNotNil(fd.itemType) ? realm.objectForPrimaryKey('item-type', new BSON.ObjectID(fd.itemType)) : undefined,
        brand: isNotNil(fd.brand) ? realm.objectForPrimaryKey('brand', new BSON.ObjectId(fd?.brand)) : undefined,
        productLine: isNotNil(fd.productLine) ? realm.objectForPrimaryKey('brand', new BSON.ObjectId(fd?.productLine)) : undefined,
        barcodes: {
            upc: isNotNil(fd?.barcodes.upc.barcode) ? realm.objectForPrimaryKey('barcode', new BSON.ObjectId(fd?.barcodes.upc._id.toHexString())) : undefined
        },
        details: {
            title: fd?.details?.title,
            subtitle: fd?.details?.subtitle,
            authors: [fd?.details?.author],
            pageCount: isNotNil(fd?.details?.pageCount) ? parseInt(fd?.details?.pageCount, 10) : undefined,
            mediaType: fd?.details?.mediaType,
            bookType: fd?.details?.bookType
        }
    });
    const [handleSubmit, register, onInput, isFeedbacking, getFeedback] = useUncontrolledForm(convertFormData, { _id: new BSON.ObjectId() });

    const onSubmit = useMemo(
        () =>
            handleSubmit((fd) => {
                console.log(fd);
            }),
        [handleSubmit]
    );
    const ref = useElementRef<HTMLFormElement>();
    const notNull = useCallback(
        (name: string) => {
            if (!ref.current) return false;
            const el = ref.current.elements.namedItem(name) as HTMLElement;
            if (el.tagName === 'INPUT') {
                return isNotNil((el as HTMLInputElement).value);
            }
            if (el.tagName === 'SELECT') {
                const options = (el as HTMLSelectElement).selectedOptions;
                if (options.length > 1) return true;
                return isNotNil(options[0].value);
            }
            if (el.tagName === 'TEXTAREA') {
                return isNotNil((el as HTMLTextAreaElement).value);
            }
            return false;
        },
        [ref]
    );
    const getControlValue = useCallback(
        (name: string) => {
            if (!ref.current) return undefined;
            const el = ref.current.elements.namedItem(name) as HTMLElement;
            if (el.tagName === 'INPUT') {
                return (el as HTMLInputElement).value;
            }
            if (el.tagName === 'SELECT') {
                const options = (el as HTMLSelectElement).selectedOptions;
                if (options.length > 1) {
                    const result = [];
                    for (let index = 0; index < options.length; index++) {
                        const element = options[index];
                        result.push(element.value);
                    }
                    return result;
                }
                return options[0].value;
            }
            if (el.tagName === 'TEXTAREA') {
                return (el as HTMLTextAreaElement).value;
            }
            return undefined;
        },
        [ref]
    );
    const [brand, setBrand] = useState<string | undefined>(undefined);
    const [dims, setDims] = useState<Record<string, number>>({});
    const onDimChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = ev.target as HTMLInputElement;
        const dimName = inputEl.name.split('.').filter((x) => !['dims', 'value', 'uom', 'remainder'].includes(x))[0];
        console.log('dim change: ', dimName, inputEl, inputEl.valueAsNumber);
        setDims((prev) => {
            const v = inputEl.value;
            if (isNotNil(v)) {
                return { ...prev, [dimName]: inputEl.valueAsNumber };
            }
            if (Object.getOwnPropertyNames(prev).includes(dimName)) {
                const copy = { ...prev };
                delete copy[dimName];
                return copy;
            }
            return prev;
        });
    }, []);
    const onBrandChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        const selectEl = ev.target as HTMLSelectElement;
        setBrand(isNotNil(selectEl.selectedOptions[0].value) ? selectEl.selectedOptions[0].value : undefined);
    }, []);
    const [showWeightRemainder, toggleWeightRemainder] = useToggle(false);
    const [showLongRemainder, toggleLongRemainder] = useToggle(false);
    const [showWidthRemainder, toggleWidthRemainder] = useToggle(false);
    const [showHeightRemainder, toggleHeightRemainder] = useToggle(false);
    const [uoms, setUOMS] = useState<Record<string, string>>({});
    const onUOMChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        const name = ev.target.name.split('.').filter((x) => !['dims', 'value', 'uom', 'remainder'].includes(x))[0];
        console.log(`onUOMChange`, name, ev);
        setUOMS((prev) => {
            const result = { ...prev, [name]: ev.target.value };
            if (isNotNil(ev.target.value)) return result;
            delete result[name];
            return result;
        });
    }, []);
    const UOM = ({ n, enumMap, remaining }: { n: string; enumMap?: Record<string, string>; remaining?: boolean }) =>
        requiredDependent(n, () => dims)(Control)({
            name: ['dims', n, ...(remaining ?? false ? ['remaining', 'uom'] : ['uom'])].join('.'),
            label: 'Unit',
            El: LookupEle,
            enumMap: enumMap ?? lengthUOMS,
            horiz: true,
            onChange: onUOMChange
        })();

    type FKey = 'weightExtra' | 'longExtra' | 'widthExtra' | 'heightExtra' | 'runtimeExtra';
    const [$flags, $setFlags] = useState<Partial<Record<FKey, string>>>({});
    
    type SelectorType = Partial<{
        enableSubtitle: boolean;
        enableProductLine: boolean;
        enableWeightUOM: boolean;
        enableLongUOM: boolean;
        enableWidthUOM: boolean;
        enableHeightUOM: boolean;
        canAddWeightRemainder: boolean;
        canAddLongRemainder: boolean;
        canAddWidthRemainder: boolean;
        canAddHeightRemainder: boolean;
        enableWeightRemainder: string | boolean;
        enableLongRemainder: string | boolean;
        enableWidthRemainder: string | boolean;
        enableHeightRemainder: string | boolean;
        isBook: boolean;
        isMedia: boolean;
        isVideo: boolean;
        isGame: boolean;
        isApparel: boolean;
        isTop: boolean;
        isBottom: boolean;
        isUndergarment: boolean;
        isOuterwear: boolean;
        isFootwear: boolean;
        isGadget: boolean;
        enableRuntimeRemainder: string | boolean;
        canAddRuntimeRemainder: boolean;
        enableRuntimeUOM: boolean;
        enableBarcode: boolean;
    }>;

    const [selectors, setSelectors] = useState<
        SelectorType
    >({});
    const onMediaTypeChange = useCallback(
        (ev: React.ChangeEvent<HTMLSelectElement>) => {
            const value = (ev.target as HTMLSelectElement).value;
            const form = (ev.target as HTMLSelectElement).form!;
            const itemType = form.elements.namedItem('itemType') as HTMLSelectElement;
            itemType.value = realm.objects<IItemType>('item-type').filtered('name BEGINSWITH[c] $0', mediaTypeToItemType[value])[0]?._id.toHexString();
        },
        [realm]
    );
    const [upc, setUPC] = useState('');
    const onFormInput = useCallback(
        function (ev: React.FormEvent): {
            enableProductLine: boolean;
            enableWeightUOM: boolean;
            enableLongUOM: boolean;
            enableWidthUOM: boolean;
            enableHeightUOM: boolean;
            canAddWeightRemainder: boolean;
            canAddLongRemainder: boolean;
            canAddWidthRemainder: boolean;
            canAddHeightRemainder: boolean;
            enableWeightRemainder: string | boolean;
            enableLongRemainder: string | boolean;
            enableWidthRemainder: string | boolean;
            enableHeightRemainder: string | boolean;
            isBook: boolean;
            isMedia: boolean;
            isVideo: boolean;
            isGame: boolean;
            isApparel: boolean;
            isTop: boolean;
            isBottom: boolean;
            isUndergarment: boolean;
            isOuterwear: boolean;
            isFootwear: boolean;
            isGadget: boolean;
            enableRuntimeRemainder: string | boolean;
            canAddRuntimeRemainder: boolean;
            enableRuntimeUOM: boolean;
            enableBarcode: boolean;
        } {
            const target = (ev.target as DataElement).form as HTMLFormElement;
            const formdata = new FormData(target);
            // alert('ON FORM INPUT: ' + target.name);
            setUPC(formdata.get('barcodes.upc.barcode')?.toString() ?? '');
            const itype = isNotNil(formdata.get('itemType')) ? realm.objectForPrimaryKey<IItemType>('item-type', new BSON.ObjectId(formdata.get('itemType')?.toString())) : undefined;
            const result = {
                enableBarcode: isNotNil(formdata.get('barcodes.upc')),
                enableProductLine: isNotNil(formdata.get('brand')),
                enableWeightUOM: isNotNil(formdata.get('dims.weight.value')),
                enableLongUOM: isNotNil(formdata.get('dims.long.value')),
                enableWidthUOM: isNotNil(formdata.get('dims.width.value')),
                enableHeightUOM: isNotNil(formdata.get('dims.height.value')),
                enableSubtitle: isNotNil(formdata.get('details.title')),
                canAddWeightRemainder: isNotNil(formdata.get('dims.weight.uom')) && !['g', 'oz'].includes(formdata.get('dims.weight.uom')!.toString()),
                canAddLongRemainder: isNotNil(formdata.get('dims.long.uom')) && !['in', 'cm'].includes(formdata.get('dims.long.uom')!.toString()),
                canAddWidthRemainder: isNotNil(formdata.get('dims.width.uom')) && !['in', 'cm'].includes(formdata.get('dims.width.uom')!.toString()),
                canAddHeightRemainder: isNotNil(formdata.get('dims.height.uom')) && !['in', 'cm'].includes(formdata.get('dims.height.uom')!.toString()),
                enableWeightRemainder: $flags.weightExtra ?? false,
                enableLongRemainder: $flags.longExtra ?? false,
                enableWidthRemainder: $flags.widthExtra ?? false,
                enableHeightRemainder: $flags.heightExtra ?? false,
                isBook: itype?.name!.toString().includes('Book') ?? false,
                isMedia: itype?.name!.toString().startsWith('Media') ?? false,
                isVideo: itype?.name!.toString().startsWith('Video') ?? false,
                isGame: itype?.name!.toString().includes('Game') ?? false,
                isApparel: itype?.name!.toString().startsWith('Apparel') ?? false,
                isTop: itype?.name!.toString().startsWith('Top') ?? false,
                isBottom: itype?.name!.toString().startsWith('Bottom') ?? false,
                isUndergarment: itype?.name!.toString().includes('Undergarment') ?? false,
                isOuterwear: itype?.name!.toString().includes('Outerwear') ?? false,
                isFootwear: itype?.name!.toString().includes('Footwear') ?? false,
                isGadget: itype?.name!.toString().startsWith('Gadget') ?? false,
                enableRuntimeRemainder: $flags.runtimeExtra ?? false,
                canAddRuntimeRemainder: isNotNil(formdata.get('detail.runtime.value')) && !['min'].includes(formdata.get('detail.runtime.uom')!.toString()),
                enableRuntimeUOM: isNotNil(formdata.get('detail.runtime.value'))
            };
            setSelectors(result);
            return result;
        },
        [$flags.heightExtra, $flags.longExtra, $flags.runtimeExtra, $flags.weightExtra, $flags.widthExtra, realm]
    );
    return (
        <FormProvider register={register} isFeedbacking={isFeedbacking} getFeedback={getFeedback}>
            <form ref={ref} className='grid w-full h-full grid-cols-5' onSubmit={onSubmit} onInput={onFormInput}>
                <Control
                    name='_id'
                    label='ID'
                    icon={faKey}
                    iconSize='lg'
                    tooltipFunction='x => x.toHexString()'
                    required
                    readOnly
                    El={InputEle}
                    type='text'
                    defaultValue={new BSON.ObjectId().toHexString()}
                    convertFromFD={(x: string) => new BSON.ObjectId(x)}
                    convertToFD={(x: BSON.ObjectId) => x.toHexString()}
                />
                <Control name='title' label='Header' required El={InputEle} maxLength={80} type='text' />
                <Control name='shortDescription' El={InputEle} maxLength={80} type='text' />
                <Control name='brand' El={LookupEle} lookupTable='brand' optionLabel='name' optionValue='_id' sort={[['name', false]]} onChange={onBrandChange} />
                {selectors.enableProductLine && (
                    <Control
                        name='productLine'
                        El={LookupEle}
                        lookupTable='product-line'
                        optionLabel='name'
                        optionValue='_id'
                        sort={[['name', false]]}
                        filter={['brand._id == $0', (new BSON.ObjectId(brand) as any) ?? (new BSON.ObjectId() as any)]}
                    />
                )}
                <Control name='model' El={InputEle} type='text' />
                <Control name='notes' rows={3} El={TextAreaEle} />
                <Control name='origin' El={LookupEle} enumMap={countries} />
                <Control name='itemType' El={LookupEle} lookupTable='item-type' optionValue='_id' optionLabel='name' sort={[['name', false]]} />
                <Control name='color' type='color' El={LookupEle} enumMap={colorsSelect} />
                {selectors.isMedia && <Control name='details.mediaType' label='Media Type' El={LookupEle} enumMap={mediaTypes} onChange={onMediaTypeChange} />}
                <Control
                    name='barcodes.upc'
                    label='UPC'
                    El={LookupEle}
                    lookupTable='barcode'
                    optionLabel='barcode'
                    optionValue='_id'                    
                />
                {selectors.enableBarcode && <UsedBarcode barcode={upc}/>}
                
                {selectors.isBook && <Control name='details.bookType' label='Book Type' El={LookupEle} enumMap={bookTypes} />}
                {selectors.isMedia && <Control name='details.title' label='Title' El={InputEle} className='col-span-2' type='text' />}
                {selectors.isMedia && selectors.enableSubtitle && <Control name='details.subtitle' label='SubTitle' El={InputEle} className='col-span-2' type='text' />}
                {selectors.isBook && <Control name='details.author' label='Author' className='col-span-2' El={InputEle} type='text' />}
                {selectors.isBook && (
                    <fieldset className='flex flex-col col-span-2'>
                        <legend className='flex w-full px-2 py-1 bg-rose-dark'>Page Count</legend>
                        <Control name='details.pageCount' label='Page Count' El={InputEle} step={1} type='number' min={0} />
                    </fieldset>
                )}

                <fieldset className='flex col-span-5'>
                    <details className='w-full indent-3 accent-red group'>
                        <summary className='flex w-full mx-3 text-xl font-bold text-white border rounded-lg shadow-lg font-fira-sans bg-zinc-very-dark disclosure-square caret-orange shadow-white outline-cyan py-0.5 px-1 group-open:hidden'>
                            Dimensions
                        </summary>
                        <ol className='grid grid-cols-4'>
                            <li className='flex flex-col'>
                                <fieldset className='contents'>
                                    <legend>Weight</legend>
                                    <Control name='dims.weight.value' label='Value' noLabel horiz El={InputEle} type='text' onChange={onDimChange} />
                                    <UOM n='weight' enumMap={weightUOMSSelect} />
                                    {uoms.weight !== 'g' && uoms.weight !== 'oz' && (
                                        <button className='flex justify-center text-white bg-black btn' type='button' onClick={toggleWeightRemainder}>
                                            <DuotoneIcon icon={showWeightRemainder ? faTrashCan : faCircleEllipsis} primary='dodgerblue' secondary='yellowgreen' size='lg' />
                                        </button>
                                    )}
                                    {showWeightRemainder && (
                                        <>
                                            <Control name='dims.weight.remaining.value' label='Value' noLabel horiz El={InputEle} type='text' onChange={onDimChange} />
                                            <UOM n='weight' enumMap={weightUOMSSelect} remaining />
                                        </>
                                    )}
                                </fieldset>
                            </li>
                            <li className='flex flex-col'>
                                <fieldset className='contents'>
                                    <legend>Length</legend>
                                    <Control name='dims.long.value' label='Length' noLabel horiz El={InputEle} type='text' onChange={onDimChange} />
                                    <UOM n='long' />
                                    {uoms.long !== 'in' && uoms.long !== 'cm' && (
                                        <button className='flex justify-center text-white bg-black btn' type='button' onClick={toggleLongRemainder}>
                                            <DuotoneIcon icon={showLongRemainder ? faTrashCan : faCircleEllipsis} primary='dodgerblue' secondary='yellowgreen' size='lg' />
                                        </button>
                                    )}
                                    {showLongRemainder && (
                                        <>
                                            <Control name='dims.long.remaining.value' label='Value' noLabel horiz El={InputEle} type='text' onChange={onDimChange} />
                                            <UOM n='long' enumMap={lengthUOMS} remaining />
                                        </>
                                    )}
                                </fieldset>
                            </li>
                            <li className='flex flex-col'>
                                <fieldset className='contents'>
                                    <legend>Width</legend>
                                    <Control name='dims.width.value' label='Width' noLabel horiz El={InputEle} type='text' onChange={onDimChange} />
                                    <UOM n='width' />
                                </fieldset>
                            </li>
                            <li className='flex flex-col'>
                                <fieldset className='contents'>
                                    <legend>Height</legend>
                                    <Control name='dims.height.value' noLabel horiz label='Height' El={InputEle} type='text' onChange={onDimChange} />
                                    <UOM n='height' />
                                </fieldset>
                            </li>
                        </ol>
                    </details>
                </fieldset>
                <input type='submit' />
            </form>
        </FormProvider>
    );
}

export function requiredDependent(name: string, getter: () => any) {
    return function <T>(Component: React.FunctionComponent<T>) {
        return function (props: JSX.IntrinsicAttributes & T) {
            return function () {
                return <>{isNotNil(getter()[name]) && <Component {...(props as JSX.IntrinsicAttributes & T)} />}</>;
            };
        };
    };
}
