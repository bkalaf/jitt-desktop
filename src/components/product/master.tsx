import { useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectId } from 'bson';
import { isNil, isNotNil } from '../../common/isNotNull';
import useLocalRealm from '../../hooks/useLocalRealm';
import { MediaType, mediaTypes } from '../../data/enums/mediaTypes';
import { UsedBarcode } from '../../data/collections/BarcodeDefinition';
import { useUncontrolledForm } from '../../hooks/useForm';
import { identity, setProperty } from '../../common';
import { FormProvider } from '../providers/FormProvider';
import { Control } from '../forms/Control';
import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import { BSON, SortDescriptor } from 'realm';
import { InputEle } from '../../data/definitions/InputEle';
import { LookupEle } from '../../data/definitions/LookupEle';
import { Boundary } from '../grid/Boundary';
import { countries } from '../../data/enums/country';
import { colorsSelect } from '../../data/enums/colors';
import { Grouping } from './Grouping';
import { weightUOMS, weightUOMSSelect } from '../../data/enums/weightUOMS';

export const tryFD = (formData: FormData, propName: string) => {
    const result = formData.get(propName);
    const kind = typeof result;
    return isNil(result) ? undefined : kind === 'string' ? (result as string) : result.toString();
};
export const tryLookupPK = function <TEntity extends { _id: ObjectId }>(realm: Realm, collection: string, id?: string, filterFunc?: string, ...filterVars: any[]) {
    if (isNil(id)) return undefined;
    return realm.objectForPrimaryKey<TEntity>(collection, new ObjectId(id));
};

export const tryLookup = (realm: Realm, collection: string, sortDescriptor: SortDescriptor[], filterFunc: string, ...filterVars: any[]) =>
    realm
        .objects(collection)
        .filtered(filterFunc, ...filterVars)
        .sorted(sortDescriptor);

export const getInt = (formData: FormData, propName: string) => parseInt(formData.get(propName)?.toString() ?? '0', 10);
export const getText = (formData: FormData, propName: string) => formData.get(propName)?.toString();
export function convertMaster(realm: Realm, fd: FormData) {
    return {
        _id: isNil(fd.get('_id')) ? new ObjectId() : new ObjectId(fd.get('_id')?.toString()),
        brand: tryLookupPK<IBrand>(realm, 'brand', tryFD(fd, 'brand')),
        productLine: tryLookupPK<IProductLine>(realm, 'product-line', tryFD(fd, 'productLine')),
        itemType: tryLookupPK<IItemType>(realm, 'item-type', tryFD(fd, 'itemType')),
        header: getText(fd, 'header'),
        description: getText(fd, 'description'),
        notes: getText(fd, 'notes'),
        barcodes: {
            upc: tryLookupPK<IBarcode>(realm, 'barcode', tryFD(fd, 'barcodes.upc')),
            isbn: tryLookupPK<IBarcode>(realm, 'barcode', tryFD(fd, 'barcodes.isbn')),
            asin: tryLookupPK<IBarcode>(realm, 'barcode', tryFD(fd, 'barcodes.asin'))
        },
        dims: {
            weight: {
                value: getInt(fd, 'dims.weight.value'),
                uom: getText(fd, 'dims.weight.uom'),
                remaining: {
                    value: getInt(fd, 'dims.weight.remaining.value'),
                    uom: getText(fd, 'dims.weight.remaining.uom')
                }
            },
            length: {
                value: getInt(fd, 'dims.length.value'),
                uom: getText(fd, 'dims.length.uom'),
                remaining: {
                    value: getInt(fd, 'dims.length.remaining.value'),
                    uom: getText(fd, 'dims.length.remaining.uom')
                }
            },
            width: {
                value: getInt(fd, 'dims.width.value'),
                uom: getText(fd, 'dims.width.uom'),
                remaining: {
                    value: getInt(fd, 'dims.width.remaining.value'),
                    uom: getText(fd, 'dims.width.remaining.uom')
                }
            },
            height: {
                value: getInt(fd, 'dims.height.value'),
                uom: getText(fd, 'dims.height.uom'),
                remaining: {
                    value: getInt(fd, 'dims.height.remaining.value'),
                    uom: getText(fd, 'dims.height.remaining.uom')
                }
            }
        }
    };
}

export function _MasterView() {
    console.group('MasterView');
    const realm = useLocalRealm();

    const [_id, setId] = useState<ObjectId>(new ObjectId());
    console.log('_id', _id);

    // Base Product Attributes
    const [header, setHeader] = useState('');
    const [description, setDescription] = useState('');
    const [origin, setOrigin] = useState('');
    const [color, setColor] = useState('');

    // Foreign Keys
    const [brandId, setBrandId] = useState('');
    const [productLineId, setProductLineId] = useState('');
    const [itemTypeId, setItemTypeId] = useState('');
    const [upcId, setUpcId] = useState('');
    const [asinId, setAsinId] = useState('');
    const [isbnId, setIsbnId] = useState('');

    // Foreign Key Lookups
    const [itemTypeName, setItemTypeName] = useState('');
    const [upcBarcode, setUpcBarcode] = useState('');
    const [asinBarcode, setAsinBarcode] = useState('');
    const [isbnBarcode, setIsbnBarcode] = useState('');

    console.log('brandId', brandId, 'productLineId', productLineId, 'itemTypeId', itemTypeId, 'itemTypeName', itemTypeName);
    console.log('upcId', upcId, 'isbnId', isbnId, 'asinId', asinId);
    console.log('upc', upcBarcode, 'isbn', isbnBarcode, 'asin', asinBarcode);

    // Details
    const [mediaType, setMediaType] = useState<keyof typeof mediaTypes | undefined>(undefined);
    const [bookType, setBookType] = useState('');
    const [gameType, setGameType] = useState('');
    console.log('mediaType', mediaType);

    const [weight, setWeight] = useState<Partial<IDimension<string>>>({});
    const [length, setLength] = useState<Partial<IDimension<string>>>({});
    const [width, setWidth] = useState<Partial<IDimension<string>>>({});
    const [height, setHeight] = useState<Partial<IDimension<string>>>({});

    const onDimValueChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setWeight((prev) => {
            const el = ev.target as HTMLInputElement;
            const result = setProperty(el.name)(ev.target.valueAsNumber)(prev);
            return result;
        });
    }, []);
    const onDimUOMChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        setWeight((prev) => {
            const el = ev.target as HTMLSelectElement;
            const result = setProperty(el.name)(ev.target.value)(prev);
            return result;
        });
    }, []);
    const onUpcChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        setUpcId(ev.target.value);
    }, []);
    const onAsinChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        setAsinId(ev.target.value);
    }, []);
    const onIsbnChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        setIsbnId(ev.target.value);
    }, []);
    useEffect(() => {
        if (isNil(asinId)) return;
        const barcode = realm.objectForPrimaryKey<IBarcode>('barcode', new ObjectId(asinId));
        setAsinBarcode(barcode?.barcode ?? '');
    }, [asinId, realm]);
    useEffect(() => {
        if (isNil(upcId)) return;
        const barcode = realm.objectForPrimaryKey<IBarcode>('barcode', new ObjectId(upcId));
        setUpcBarcode(barcode?.barcode ?? '');
    }, [realm, upcId]);
    useEffect(() => {
        if (isNil(isbnId)) return;
        const barcode = realm.objectForPrimaryKey<IBarcode>('barcode', new ObjectId(isbnId));
        setIsbnBarcode(barcode?.barcode ?? '');
    }, [realm, isbnId]);

    const options = useMemo(
        () => ({
            upc: Array.from(
                realm
                    .objects<IBarcode>('barcode')
                    .filtered('type == $0 OR type == $1 OR type == $2', 'EAN13', 'UPCE', 'UCPA')
                    .sorted([['barcode', false]])
                    .map((x) => ({ value: x._id.toHexString(), label: (x as any).barcode }))
            ),
            isbn: Array.from(
                realm
                    .objects<IBarcode>('barcode')
                    .filtered('type == $0 OR type == $1', 'ISBN10', 'ISBN13')
                    .sorted([['barcode', false]])
                    .map((x) => ({ value: x._id.toHexString(), label: (x as any).barcode }))
            ),
            asin: Array.from(
                realm
                    .objects<IBarcode>('barcode')
                    .filtered('type == $0', 'ASIN')
                    .sorted([['barcode', false]])
                    .map((x) => ({ value: x._id.toHexString(), label: (x as any).barcode }))
            ),
            brand: Array.from(realm.objects<{ _id: ObjectId }>('brand')).map((x) => ({ value: x._id.toHexString(), label: 'name' })),
            productLine: isNotNil(brandId)
                ? Array.from(
                      isNotNil(brandId)
                          ? realm
                                .objects<{ _id: ObjectId }>('product-line')
                                .filtered('brand._id == $0', new ObjectId(brandId))
                                .map((x: any) => ({ value: x._id.toHexString(), label: 'name' }))
                          : []
                  )
                : []
        }),
        [brandId, realm]
    );

    const onBrandChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        setProductLineId('');
        setBrandId(ev.target.value);
    }, []);
    const checkMediaType = useCallback((newvalue: MediaType | undefined) => {
        setMediaType((prev) => {
            if ((prev != null && prev !== newvalue) || (prev == null && newvalue != null)) return newvalue;
            return prev;
        });
    }, []);
    const checkItemType = useCallback((newvalue: string) => {
        setItemTypeId((prev) => {
            if (isNotNil(newvalue)) return newvalue;
            if (isNil(newvalue) && isNil(prev)) return prev;
            return newvalue;
        });
    }, []);
    const onFormChange = useCallback(
        (name: string) => {
            switch (name) {
                case 'itemType': {
                    if (itemTypeName?.startsWith('Media - Book')) checkMediaType('book');
                    if (itemTypeName?.startsWith('Media - Video')) checkMediaType('vhs');
                    if (itemTypeName?.startsWith('Media - Game')) checkMediaType('game');
                    if (itemTypeName?.startsWith('Media - Music')) checkMediaType('cd');
                    break;
                }
                case 'mediaType': {
                    const music = realm.objects<{ _id: ObjectId }>('item-type').filtered('name BEGINSWITH[c] $0', 'Media - Music')[0];
                    const video = realm.objects<{ _id: ObjectId }>('item-type').filtered('name BEGINSWITH[c] $0', 'Media - Video')[0];
                    const book = realm.objects<{ _id: ObjectId }>('item-type').filtered('name BEGINSWITH[c] $0', 'Media - Book')[0];
                    const game = realm.objects<{ _id: ObjectId }>('item-type').filtered('name BEGINSWITH[c] $0', 'Media - Game')[0];
                    switch (mediaType) {
                        case 'cd': {
                            checkItemType(music._id.toHexString());
                            break;
                        }
                        case 'vhs':
                        case 'dvd':
                        case 'blu':
                        case 'ld': {
                            checkItemType(video._id.toHexString());
                            break;
                        }
                        case 'book': {
                            checkItemType(book._id.toHexString());
                            break;
                        }
                        case 'game': {
                            checkItemType(game._id.toHexString());
                            break;
                        }

                        default:
                            break;
                    }
                    break;
                }
                case 'bookType':
                    break;
                case 'videoType':
                    break;
                case 'gameType':
                    break;

                default:
                    break;
            }
        },
        [checkItemType, checkMediaType, itemTypeName, mediaType, realm]
    );
    const onItemTypeChange = useCallback(
        (ev: React.ChangeEvent<HTMLSelectElement>) => {
            setItemTypeId(ev.target.value);
            setItemTypeName(realm.objectForPrimaryKey<IItemType>('item-type', new ObjectId(ev.target.value))?.name ?? '');
        },
        [realm]
    );

    const isEnabled = useMemo(
        () => ({
            productLine: isNotNil(brandId),
            mediaType: itemTypeName?.startsWith('Media'),
            bookType: itemTypeName?.startsWith('Media - Book'),
            videoType: itemTypeName?.startsWith('Media - Video'),
            gameType: itemTypeName?.startsWith('Media - Game'),
            weightUOM: isNotNil(weight?.value),
            addWeightRemainder: isNotNil(weight?.uom) && weight?.uom !== 'g' && weight?.uom !== 'oz',
            weightRemainder: isNotNil(weight?.remaining),
            lengthUOM: isNotNil(length?.value),
            addLengthRemainder: isNotNil(length?.uom) && length?.uom !== 'cm' && length?.uom !== 'in',
            lengthRemainder: isNotNil(length?.remaining),
            widthUOM: isNotNil(width?.value),
            addWidthRemainder: isNotNil(width?.uom) && width?.uom !== 'cm' && length?.uom !== 'in',
            widthRemainder: isNotNil(width?.remaining),
            heightUOM: isNotNil(height?.value),
            addHeightRemainder: isNotNil(height?.uom) && height?.uom !== 'cm' && length?.uom !== 'in',
            heightRemainder: isNotNil(height?.remaining)
        }),
        [brandId, height?.remaining, height?.uom, height?.value, itemTypeName, length?.remaining, length?.uom, length?.value, weight?.remaining, weight?.uom, weight?.value, width?.remaining, width?.uom, width?.value]
    );
    const [handleSubmit, register, onInput, isFeedbacking, getFeedback] = useUncontrolledForm(fromFormData, { _id: new ObjectId() });

    useEffect(() => {
        const mediaItemType = realm.objects<IItemType>('item-type').filtered('name ==[c] $0', 'Media')[0];
        if (isNotNil(isbnBarcode) && !itemTypeId.startsWith('Media')) {
            setItemTypeId(mediaItemType._id.toHexString());
        }
    }, [isbnBarcode, itemTypeId, realm]);

    console.groupEnd();

    return (
        <FormProvider register={register} isFeedbacking={isFeedbacking} getFeedback={getFeedback}>
            <form className='grid w-full grid-cols-5 border-2 rounded-lg shadow-lg border-cyan shadow-white'>
                <Grouping clusterName='Core'>
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
                    <Control El={LookupEle} enumMap={countries} name='origin' label='Country of Origin' />
                    <Control El={LookupEle} enumMap={colorsSelect} name='color' label='Color' />
                </Grouping>
                <Grouping clusterName='Product Branding'>
                    <Control name='brand' El={LookupEle} lookupTable='brand' optionLabel='name' label='Brand' optionValue='_id' onChange={onBrandChange} />
                    {isEnabled.productLine && (
                        <Control name='productLine' El={LookupEle} label='Line' lookupTable='product-line' optionLabel='name' optionValue='_id' filter={['brand._id == $0', new ObjectId(brandId) as any]} />
                    )}
                    <Control El={InputEle} type='text' label='Model #' name='model' />
                </Grouping>
                <Grouping clusterName='Identifiers'>
                    {isNil(upcBarcode) && (
                        <Control
                            name='barcodes.upc'
                            El={LookupEle}
                            lookupTable='barcode'
                            filter={['type == $0 OR type == $1', 'UPCE', 'EAN13']}
                            sort={[['barcode', false]]}
                            optionLabel='barcode'
                            optionValue='_id'
                            onChange={onUpcChange}
                            label='UPC'
                        />
                    )}
                    {isNotNil(upcBarcode) && <UsedBarcode barcode={upcBarcode} />}
                    {isNil(isbnBarcode) && (
                        <Control
                            name='barcodes.isbn'
                            El={LookupEle}
                            lookupTable='barcode'
                            filter={['type == $0 OR type == $1', 'ISBN10', 'IBSN13']}
                            sort={[['barcode', false]]}
                            optionLabel='barcode'
                            optionValue='_id'
                            onChange={onIsbnChange}
                            label='ISBN'
                        />
                    )}
                    {isNotNil(isbnBarcode) && <UsedBarcode barcode={isbnBarcode} />}
                    {isNil(asinBarcode) && (
                        <Control
                            name='barcodes.asin'
                            El={LookupEle}
                            lookupTable='barcode'
                            filter={['type == $0', 'ASIN']}
                            sort={[['barcode', false]]}
                            optionLabel='barcode'
                            optionValue='_id'
                            onChange={onAsinChange}
                            label='ASIN'
                        />
                    )}
                    {isNotNil(asinBarcode) && <UsedBarcode barcode={asinBarcode} />}
                </Grouping>
                <Grouping clusterName='Product Specs'>
                    <fieldset className='flex flex-row p-1 bg-transparent border-black border-dashed rounded-lg indent-2 space-y-0.5'>
                        <legend className='p-1 mx-2 text-xl font-extrabold leading-loose tracking-wider text-white border border-double rounded-lg indent-2 font-fira-sans bg-teal-dark border-lime'>Weight</legend>
                        <Control El={InputEle} type='number' step={0.1} min={0} name='dims.weight.value' noLabel onChange={onDimValueChange} />
                        {isEnabled.weightUOM && <Control El={LookupEle} name='dims.weight.uom' enumMap={weightUOMSSelect} onChange={onDimUOMChange} />}
                        {weight.uom === 'kg' ||
                            (weight.uom === 'lb' && (
                                <>
                                    <Control El={InputEle} type='number' step={0.1} min={0} name='dims.weight.remaining.value' noLabel onChange={onDimValueChange} />
                                    <Control El={LookupEle} name='dims.weight.remaining.uom' enumMap={weightUOMSSelect} onChange={onDimUOMChange} />
                                </>
                            ))}
                    </fieldset>
                </Grouping>

                <Grouping clusterName='Media'>
                    <div>Group</div>
                </Grouping>
            </form>
        </FormProvider>
    );
}

export function fromFormData(fd: FormData) {
    try {
        const entries = Array.from(fd?.entries()) ?? Object.entries(fd);
        let result: Record<string, any> = {};
        entries
            .filter(([k, v]) => isNotNil(v))
            .forEach(([k, v]) => {
                result = setProperty(k)(v)(result);
            });
        console.log(`fromFormData`, fd, result);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export function MasterView() {
    return (
        <Boundary>
            <_MasterView />
        </Boundary>
    );
}
