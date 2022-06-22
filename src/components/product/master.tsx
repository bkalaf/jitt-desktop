import { useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectId } from 'bson';
import { isNil, isNotNil } from '../../common/isNotNull';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { MediaType, mediaTypes } from '../../data/enums/mediaTypes';
import { UsedBarcode } from '../../data/collections/BarcodeDefinition';
import { useUncontrolledForm } from '../../hooks/useForm';
import { identity, setProperty } from '../../common';
import { FormProvider } from '../providers/FormProvider';
import { Control } from '../forms/Control';
import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import { BSON } from 'realm';
import { InputEle } from '../../data/definitions/InputEle';
import { LookupEle } from '../../data/definitions/LookupEle';
import { Boundary } from '../grid/Boundary';
import { countries } from '../../data/enums/country';
import { colorsSelect } from '../../data/enums/colors';
import { Grouping } from './Grouping';

export function convertMaster(fd: FormData) {
    return {
        _id: isNil(fd.get('_id')) ? new ObjectId() : new ObjectId(fd.get('_id')?.toString()),
        header: fd.get('header'),
        description: fd.get('description'),
        notes: fd.get('notes')
    };
}

export function _MasterView() {
    const realm = useLocalRealm();

    const [_id, setId] = useState(new ObjectId().toHexString());
    const [header, setHeader] = useState('');
    const [description, setDescription] = useState('');
    const [itemTypeId, setItemTypeId] = useState('');
    const [itemTypeName, setItemTypeName] = useState('');
    const [origin, setOrigin] = useState('');
    const [color, setColor] = useState('');
    const [brandId, setBrandId] = useState('');
    const [productLineId, setProductLineId] = useState('');

    const [mediaType, setMediaType] = useState<keyof typeof mediaTypes | undefined>(undefined);
    const [bookType, setBookType] = useState('');
    const [gameType, setGameType] = useState('');

    const [weight, setWeight] = useState<Partial<IDimension<string>>>({});
    const [length, setLength] = useState<Partial<IDimension<string>>>({});
    const [width, setWidth] = useState<Partial<IDimension<string>>>({});
    const [height, setHeight] = useState<Partial<IDimension<string>>>({});

    const [upcId, setUpcId] = useState('');
    const [upcBarcode, setUpcBarcode] = useState('');
    const [asinId, setAsinId] = useState('');
    const [asinBarcode, setAsinBarcode] = useState('');
    const [isbnId, setIsbnId] = useState('');
    const [isbnBarcode, setIsbnBarcode] = useState('');
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
        const barcode = realm.objectForPrimaryKey<IBarcode>('barcode', new ObjectId(asinId));
        setAsinBarcode(barcode?.barcode ?? '');
    }, [asinId, realm]);
    useEffect(() => {
        const barcode = realm.objectForPrimaryKey<IBarcode>('barcode', new ObjectId(upcId));
        setUpcBarcode(barcode?.barcode ?? '');
    }, [realm, upcId]);
    useEffect(() => {
        const barcode = realm.objectForPrimaryKey<IBarcode>('barcode', new ObjectId(isbnId));
        setUpcBarcode(barcode?.barcode ?? '');
    }, [realm, isbnId]);
    function UPC() {
        return <UsedBarcode barcode={upcBarcode} />;
    }
    function ASIN() {
        return <UsedBarcode barcode={asinBarcode} />;
    }
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

    const onBrandChange = useCallback(() => {
        setProductLineId('');
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
                            setItemTypeId(music._id.toHexString());
                            break;
                        }
                        case 'vhs':
                        case 'dvd':
                        case 'blu':
                        case 'ld': {
                            setItemTypeId(video._id.toHexString());
                            break;
                        }
                        case 'book': {
                            setItemTypeId(book._id.toHexString());
                            break;
                        }
                        case 'game': {
                            setItemTypeId(game._id.toHexString());
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
        [checkMediaType, itemTypeName, mediaType, realm]
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

    return (
        <FormProvider register={register} isFeedbacking={isFeedbacking} getFeedback={getFeedback}>
            <form className='grid w-full grid-cols-5 border-2 rounded-lg shadow-lg border-cyan shadow-white'>
                <div className='flex flex-col'>
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
                </div>
                <fieldset className='flex flex-col p-1 bg-transparent border-black border-dashed rounded-lg indent-2 space-y-0.5'>
                    <legend className='p-1 mx-2 text-lg font-bold indent-2 font-fira-sans'>Branding</legend>
                    <Control name='brand' El={LookupEle} lookupTable='brand' optionLabel='name' label='Brand' optionValue='_id' />
                    {isEnabled.productLine && (
                        <Control name='productLine' El={LookupEle} label='Line' lookupTable='product-line' optionLabel='name' optionValue='_id' filter={['brand._id == $0', new ObjectId(brandId) as any]} />
                    )}
                    <Control El={InputEle} type='text' label='Model #' name='model' />
                </fieldset>
                <fieldset className='flex flex-col p-1 bg-transparent border-black border-dashed rounded-lg indent-2 space-y-0.5'>
                    <legend className='p-1 mx-2 text-lg font-bold text-white border border-double rounded-lg indent-2 font-fira-sans bg-rose-dark border-pink'>Identifiers</legend>
                    {isNotNil(upcBarcode) && (
                        <Control
                            name='barcodes.upc'
                            El={LookupEle}
                            lookupTable='barcode'
                            filter={['type == $0 OR type == $1', 'UPCE', 'EAN']}
                            sort={[['barcode', false]]}
                            optionLabel='barcode'
                            optionValue='_id'
                            onChange={onUpcChange}
                            label='UPC'
                        />
                    )}
                    {isNotNil(upcBarcode) && <UsedBarcode barcode={upcBarcode} />}
                    {isNotNil(isbnBarcode) && (
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
                    {isNotNil(asinBarcode) && (
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
                </fieldset>
                <fieldset className='flex flex-col p-1 bg-transparent border-black border-dashed rounded-lg indent-2 space-y-0.5'>
                    <legend className='p-1 mx-2 text-lg font-bold text-white border border-double rounded-lg indent-2 font-fira-sans bg-rose-dark border-pink'>Dimensions</legend>
                    <div>Group</div>
                </fieldset>
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
