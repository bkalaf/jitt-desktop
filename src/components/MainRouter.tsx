/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-empty-pattern */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/boolean-prop-naming */
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { $showFileTools } from './MainWindow';
import { InsertForm } from './InsertForm';
import { GridContainer } from './GridContainer';
import { LoginForm } from './forms/LoginForm';
import { ModalContainer } from './ModalContainer';
import { useLog } from '../hooks/useLog';
import { DataOrModifiedFn, useAsyncResource } from 'use-async-resource';
import { getProperty, ignore } from '../common';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useMutation } from 'react-query';
import { uploadFile } from '../queries/insertMutation';
import { AdminMenu } from './AdminMenu';
import * as Webdriver from 'webdriverio';
import { ModernGrid } from '../data/ModernGrid';
import { Headers } from '../data/Headers';
import { Inventory, Storages } from '../data';
import { DefinedType } from '../data/definitions';
import { SelfStorageDefinition } from '../data/collections/SelfStorageDefinition';
import { FacilityDefinition } from '../data/collections/FacilityDefinition';
import { RentalUnitDefinition } from '../data/collections/RentalUnitDefinition';
import { BrandDefinition } from '../data/collections/BrandDefinition';
import { ImmutableRow } from '../data/ImmutableRow';
import { ObjectId } from 'bson';
import { SortDescriptor } from 'realm';
import { isNotNil } from '../common/isNotNull';
import { checkDigit } from '../data/definitions/checkDigit';
import { classifyBarcode } from '../data/definitions/classifyBarcode';
import { FixtureDefinition } from '../data/collections/FixtureDefinition';
import { BinDefinition } from '../data/collections/BinDefinition';
import { BarcodeDefinition } from '../data/collections/BarcodeDefinition';
import { CompanyDefinition } from '../data/collections/CompanyDefinition';
import { FileAllocDefinition } from '../data/collections/FileAllocDefinition';
import { ItemTypeDefinition } from '../data/collections/ItemTypeDefinition';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { usePreventDefault } from '../hooks/usePreventDefault';
import { useElementRef } from '../hooks/useForm';
import { Btn, Button } from './Button';
import { useSorted } from './useSorted';
import { ipcRenderer } from 'electron';

export type RealmTypes =
    | 'objectId'
    | 'uuid'
    | 'string'
    | 'bool'
    | 'int'
    | 'double'
    | 'float'
    | 'decimal128'
    | 'object'
    | 'list'
    | 'dictionary'
    | 'set'
    | 'date'
    | 'data'
    | 'linkingObjects';

export function FilePreview({ resource, file }: { resource: () => Promise<ArrayBuffer>; file: File }) {
    const [reader, updateReader] = useAsyncResource(resource, []);
    return (
        <React.Suspense fallback='Loading Image'>
            <ImageLoader reader={reader} file={file} />
        </React.Suspense>
    );
}
export function ImageLoader({ reader, file }: { reader: DataOrModifiedFn<ArrayBuffer>; file: File }) {
    const log = useLog();
    const data = reader();
    log(data);
    const [objectURL, setObjectURL] = useState<string | undefined>(undefined);
    log(objectURL);

    useEffect(() => {
        if (objectURL == null) {
            const r = new FileReader();
            r.addEventListener('loadend', (ev) => {
                console.log(ev);
                setObjectURL(r.result as string);
            });
            r.readAsDataURL(file);
        }
        return () => (objectURL == null ? ignore() : URL.revokeObjectURL(objectURL));
    }, [file, objectURL]);
    return file.type === 'application/pdf' ? <iframe src={objectURL} className='block w-full' /> : <img src={objectURL} className='block w-full'></img>;
}
export function UploadFile({ Controls, initialData, convert }: { Controls: DefinedType; initialData: Record<string, any>; convert: any }) {
    const log = useLog();
    const realm = useLocalRealm();
    const [previews, setPreviews] = useState<File[]>([]);
    const onChange = useCallback(
        async (ev: React.ChangeEvent<HTMLInputElement>) => {
            const files = ev.target.files;
            if (files == null) throw new Error();
            const p: File[] = [];
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                log(file);
                const { name, type, size, lastModified, path } = file;
                p.push(file);
            }
            setPreviews(p);
        },
        [log]
    );
    const mutation = useMutation(uploadFile(realm), { onSuccess: () => setPreviews([]) });

    const [isLoading, startTransition] = useTransition();
    const onClick = useCallback(() => startTransition(() => mutation.mutate(previews)), [mutation, previews]);
    return (
        <section className='flex flex-col w-full'>
            <input
                type='file'
                name='incoming'
                className='flex file:font-semibold file:font-fira-sans file:text-lg file:border file:text-slate-dark file:border-blue file:rounded hover:file:shadow-inner hover:file:shadow-cyan'
                multiple
                onChange={onChange}
            />
            <div className='grid grid-cols-4'>
                {previews.map((x, ix) => (
                    <FilePreview resource={() => x.arrayBuffer()} file={x} key={ix} />
                ))}
            </div>
            <div className='flex items-center justify-center'>
                <button className='inline-flex px-3 py-1 text-lg font-bold text-white border-black rounded-lg font-fira-sans bg-blue' onClick={onClick}>
                    Submit
                </button>
            </div>
            {isLoading && <div className='flex'>Saving...</div>}
        </section>
    );
}

export function FileTools({ children }: { children: Children }) {
    useEffect(() => {
        $showFileTools(true);
        return () => {
            $showFileTools(false);
        };
    }, []);
    return <>{children}</>;
}

export function SelfStorageRow({ row, columnList }: { row: any; columnList: string[] }) {
    return (
        <tr className='text-white even:bg-blue odd:bg-slate'>
            <td className='text-lg font-normal text-white border border-white font-fira-sans'>SELECT</td>
            <td className='text-lg font-normal text-white border border-white font-fira-sans'>EDIT</td>
            <td className='text-lg font-normal text-white border border-white font-fira-sans'>{row._id.toHexString()}</td>
            <td className='text-lg font-normal text-white border border-white font-fira-sans'>{row.name}</td>
            <td className='text-lg font-normal text-white border border-white font-fira-sans'>{row.website}</td>
            <td className='text-lg font-normal text-white border border-white font-fira-sans'>{row.facilities.length}</td>
            <td className='text-lg font-normal text-white border border-white font-fira-sans'>DELETE</td>
        </tr>
    );
}

function lookupFK(name: string, lookupFrom: string, realm: Realm) {
    return (x: any) => (isNotNil(x[name]) ? realm.objectForPrimaryKey(lookupFrom, new ObjectId(x[name])) : undefined);
}
export function addSingleBarcodeToQueue(bc: IBarcode) {
    console.log('barcode', bc);
    console.log('fixtures', bc.fixture);
    console.log('bins', bc.bin);
    const type = (bc.fixture?.length ?? 0) > 0 ? 'fixture' : (bc.bin?.length ?? 0) > 0 ? 'bin' : undefined;
    const name = type === 'fixture' ? (bc.fixture ?? [])[0]!.name : (bc.bin ?? [])[0]!.name;
    const notes = type === 'fixture' ? (bc.fixture ?? [])[0]!.notes : (bc.bin ?? [])[0]!.notes;
    const barcode = bc.barcode;
    const description = bc.description;
    console.log(`sending: add-to-tag-queue`, barcode);
    ipcRenderer.send('add-to-tag-queue', name, barcode, description, type, notes);
}
export function MainRouter({ reader, realm }: { reader: DataOrModifiedFn<Webdriver.Browser<'async'>>; realm: Realm }) {
    // const {} = realm.objects('type-info')

    return (
        <Routes>
            <Route path='/'>
                <Route
                    path='login'
                    element={
                        <ModalContainer>
                            <LoginForm />
                        </ModalContainer>
                    }
                />

                <Route path='fs'>
                    <Route path='v1'>
                        {CollectionFor({
                            realm: realm,
                            name: 'fs-alloc',
                            colList: ['_id', 'type', 'name', 'originalName', 'parent', 'materializedPath', 'fsItem'],
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                name: x.name,
                                originalName: x.originalName,
                                parent: lookupFK('parent', 'fs-alloc', realm)(x),
                                materializedPath: [(lookupFK('parent', 'fs-alloc', realm)(x) as any)?.materializedPath ?? '', x.name]
                                    .join('/')
                                    .replace('//', '/'),
                                fsItem: lookupFK('fsItem', 'fs-item', realm)(x)
                            }),
                            sorted: [['materializedPath', false]],
                            Defs: FileAllocDefinition,
                            InsertComponent: UploadFile
                        })}
                        {/* <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <ModalContainer>
                                            <UploadFile />
                                        </ModalContainer>
                                    }
                                />
                            </Route>
                            <Route
                                index
                                element={
                                    <FileTools>
                                        <GridContainer />
                                    </FileTools>
                                }
                            />
                        </Route> */}
                    </Route>
                    <Route index element={<Navigate to='v1' />} />
                </Route>
                <Route path='admin'>
                    <Route path='v1'>
                        <Route index element={<AdminMenu reader={reader} />} />
                    </Route>
                    <Route index element={<Navigate to='v1' />} />
                </Route>
                <Route path='data'>
                    <Route path='v1'>
                        {CollectionFor({
                            realm: realm,
                            name: 'bin',
                            colList: ['_id', 'name', 'notes', 'barcode', 'fixture'],
                            Defs: BinDefinition,
                            sorted: [['name', false]],
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                name: x.name,
                                notes: x.notes,
                                barcode: lookupFK('barcode', 'barcode', realm)(x.barcode),
                                fixture: lookupFK('fixture', 'fixture', realm)(x.fixture)
                            }),
                            ExtendedID: AssignBarcode,
                            postInsert: addSingleBarcodeToQueue as any
                        })}
                        {CollectionFor({
                            realm: realm,
                            name: 'fixture',
                            colList: ['_id', 'name', 'notes', 'barcode'],
                            Defs: FixtureDefinition,
                            sorted: [['name', false]],
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                name: x.name,
                                notes: x.notes,
                                barcode: lookupFK('barcode', 'barcode', realm)(x.barcode)
                            }),
                            ExtendedID: AssignBarcode,
                            postInsert: addSingleBarcodeToQueue as any
                        })}
                        {CollectionFor({
                            realm: realm,
                            name: 'barcode',
                            colList: ['_id', 'description', 'barcode', 'type'],
                            sorted: [['barcode', false]],
                            Defs: BarcodeDefinition,
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                barcode: x.barcode,
                                type: classifyBarcode(x.barcode),
                                valid: checkDigit(x.barcode)[0],
                                description: x.description,
                                owner: x.owner
                            })
                        })}
                        {CollectionFor({
                            realm: realm,
                            name: 'item-type',
                            colList: ['_id', 'name', 'supertype', 'details', 'taxonomy'],
                            sorted: [['name', false]],
                            Defs: ItemTypeDefinition,
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                name: x.name,
                                details: x.details,
                                supertype: lookupFK('supertype', 'item-type', realm)(x),
                                classification: lookupFK('classification', 'taxonomy', realm)(x)
                            })
                        })}
                        {CollectionFor({
                            realm: realm,
                            name: 'company',
                            colList: ['_id', 'name', 'parent'],
                            sorted: [['name', false]],
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                name: x.name,
                                parent: lookupFK('parent', 'company', realm)(x),
                                aliases: [],
                                rns: [],
                                country: []
                            }),
                            Defs: CompanyDefinition
                        })}
                        {CollectionFor({
                            realm: realm,
                            name: 'brand',
                            colList: ['_id', 'name', 'company', 'verifiedBrand'],
                            sorted: [['name', false]],
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                name: x.name,
                                company: isNotNil(x.company) ? realm.objectForPrimaryKey('company', new ObjectId(x.company)) : undefined,
                                verifiedBrand: isNotNil(x.verifiedBrand)
                                    ? realm.objectForPrimaryKey('verified-brand', new ObjectId(x.verifiedBrand))
                                    : undefined,
                                alias: []
                            }),
                            Defs: BrandDefinition
                        })}
                        {CollectionFor({
                            realm: realm,
                            name: 'rental-unit',
                            colList: ['_id', 'facility', 'unit', 'size.length.value', 'size.length.uom', 'size.width.value', 'size.width.uom'],
                            sorted: [
                                ['facility.address.state', false],
                                ['facility.address.city', false],
                                ['unit', false]
                            ],
                            Defs: RentalUnitDefinition,
                            convert: (x: any) => ({
                                _id: new ObjectId(x._id),
                                facility: realm.objectForPrimaryKey('facility', new ObjectId(x.facility)),
                                unit: x.unit,
                                size: {
                                    length: {
                                        value: x['size.length.value'],
                                        uom: x['size.length.uom']
                                    },
                                    width: {
                                        value: x['size.width.value'],
                                        uom: x['size.width.uom']
                                    }
                                }
                            })
                        })}
                        <Route path='facility'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <ModalContainer>
                                            <InsertForm
                                                Controls={FacilityDefinition}
                                                initialData={{}}
                                                convert={(x: any) => ({
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
                                                    selfStorage: realm.objectForPrimaryKey('self-storage', new ObjectId(x.selfStorage))
                                                })}
                                            />
                                        </ModalContainer>
                                    }
                                />
                            </Route>
                            <Route
                                index
                                element={GridFor({
                                    realm: realm,
                                    name: 'facility',
                                    sorted: [
                                        ['address.state', false],
                                        ['address.city', false]
                                    ],
                                    colList: [
                                        '_id',
                                        'selfStorage',
                                        'facilityNumber',
                                        'email',
                                        'phone',
                                        'address.street',
                                        'address.suite',
                                        'address.city',
                                        'address.state',
                                        'address.country',
                                        'address.postalCode',
                                        'name'
                                    ],
                                    Defs: FacilityDefinition
                                })}
                            />
                        </Route>
                        <Route path='self-storage'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <ModalContainer>
                                            <InsertForm
                                                Controls={SelfStorageDefinition}
                                                initialData={{}}
                                                convert={(x: any) => ({ _id: new ObjectId(x._id), name: x.name, website: x.website })}
                                            />
                                        </ModalContainer>
                                    }
                                />
                            </Route>
                            <Route
                                index
                                element={GridFor({
                                    realm: realm,
                                    name: 'self-storage',
                                    colList: ['_id', 'name', 'website', 'facilities'],
                                    Defs: SelfStorageDefinition,
                                    sorted: [['name', false]]
                                })}
                            />
                        </Route>
                        {/* <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <ModalContainer>
                                            <InsertForm />
                                        </ModalContainer>
                                    }
                                />
                            </Route>
                            <Route path=':id'>
                                <Route index element={<></>} />
                            </Route>
                            <Route index element={<GridContainer />} />
                        </Route> */}

                        {/* <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <React.Suspense fallback={<Spinner />}>
                                            <Modal>
                                                <InsertForm collectionName='' />
                                            </Modal>
                                        </React.Suspense>
                                    }
                                />
                            </Route>
                            <Route path=':id'>
                                <Route index element={<></>} />
                            </Route>
                            <Route
                                index
                                element={
                                    <React.Suspense fallback={<Spinner />}>
                                        <Grid />
                                    </React.Suspense>
                                }
                            />
                        </Route> */}
                    </Route>
                    <Route index element={<Navigate to='v1' />} />
                </Route>
            </Route>
        </Routes>
    );
}

/*
return (
        <ModernGrid
            HeaderComponent={Headers}
            ImmutableRowComponent={ImmutableRow}
            MutableRowComponent={() => <></>}
            InsertControlsComponent={() => <></>}
            EditControlsComponent={() => <></>}
            data={realm.objects('self-storage').sorted([['name', false]]) as any}
            Definitions={SelfStorageDefinition}
            columnList={['_id', 'name', 'website', 'facilities']}
        />
    );
*/

export function AssignBarcodeModal() {
    const realm = useLocalRealm();
    const navigate = useNavigate();
    const location = useLocation();
    const prevent = usePreventDefault();
    const [collection, id] = useRoutedCollection();
    const obj = useMemo(() => realm.objectForPrimaryKey<any>(collection, new ObjectId(id)), [collection, id, realm]);
    if (obj == null) throw new Error(`bad route`);
    const label = `Assigning Barcode to [${collection.toUpperCase()}]: ${obj?.name ?? 'unknown'}`;
    const options = realm
        .objects<{ _id: ObjectId; description: string; barcode: string }>('barcode')
        .filtered('valid == true AND @links.@count == 0')
        .sorted([['barcode', false]])
        .snapshot();
    // const onChange = useCallback(
    //     (ev: React.ChangeEvent<HTMLSelectElement>) => {
    //         const oid = ev.target.selectedOptions[0].dataset.oid;
    //         if (oid == null) throw new Error(`bad oid: selected option ${ev.target}`);
    //         const bc = realm.objectForPrimaryKey('barcode', oid);
    //         realm.write(() => {
    //             obj.barcode = bc;
    //         });
    //         const regex = /^(\/data\/v1\/\w*)(\/.*)?$/;
    //         const destination = (regex.exec(location.pathname) ?? [])[1];
    //         navigate(destination);
    //     },
    //     [location.pathname, navigate, obj, realm]
    // );
    const [barcode, setBarcode] = useState('');
    const bc = useMemo(() => realm.objects('barcode').filtered('barcode == $0', barcode)[0], [barcode, realm]);
    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setBarcode(ev.target.value);
    }, []);
    const onKeyPress = useCallback((ev: React.KeyboardEvent) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            ev.stopPropagation();

            return;
        }
    }, []);
    const onClick = useCallback(() => {
        if (bc == null) throw new Error('bad bc');
        realm.write(() => {
            obj.barcode = bc;
        });
        const regex = /^(\/data\/v1\/\w*)(\/.*)?$/;
        const destination = (regex.exec(location.pathname) ?? [])[1];
        navigate(destination);
    }, [bc, location.pathname, navigate, obj, realm]);
    const inputRef = useElementRef<HTMLInputElement>();
    const init = useRef<boolean>(false);
    useEffect(() => {
        if (inputRef.current && !init.current) {
            inputRef.current.focus();
            inputRef.current.click();
            init.current = true;
        }
    });
    return (
        <form className='flex flex-col w-2/3' onSubmit={prevent} onReset={prevent}>
            <label>{label}</label>
            <input
                type='text'
                id='assign-barcode-input'
                value={barcode}
                className='flex text-lg border border-black rounded-lg font-fira-sans bg-cyan'
                onChange={onChange}
                onKeyDown={onKeyPress}
                ref={inputRef}
            />
            <Btn type='button' className='flex px-2 py-0.5' flags={{}} disabled={bc == null} onClick={onClick}>
                Submit
            </Btn>
        </form>
    );
}
export function AssignBarcode() {
    return (
        <Route path='assign'>
            <Route
                index
                element={
                    <ModalContainer>
                        <AssignBarcodeModal />
                    </ModalContainer>
                }
            />
        </Route>
    );
}
export function CollectionFor({
    realm,
    name,
    Defs,
    convert,
    colList,
    sorted,
    InsertComponent,
    ExtendedID,
    postInsert
}: {
    realm: Realm;
    name: string;
    Defs: DefinedType;
    convert: (x: any) => any;
    sorted: SortDescriptor[];
    colList: string[];
    InsertComponent?: React.FunctionComponent<{ Controls: DefinedType; initialData: Record<string, any>; convert: any; postInsert: <T>(input: T) => void }>;
    ExtendedID?: React.FunctionComponent;
    postInsert?: <T>(input: T) => void;
}) {
    const Insert = InsertComponent ?? InsertForm;
    return (
        <Route path={name}>
            <Route path=':id'>
                {ExtendedID && ExtendedID({})}
                <Route index element={<>Not yet done</>} />
            </Route>
            <Route path='new'>
                <Route
                    index
                    element={
                        <ModalContainer>
                            <Insert Controls={Defs} initialData={{}} convert={convert} postInsert={postInsert} />
                        </ModalContainer>
                    }
                />
            </Route>
            <Route
                index
                element={GridFor({
                    realm: realm,
                    name: name,
                    sorted: sorted,
                    colList: colList,
                    Defs: Defs
                })}
            />
        </Route>
    );
}
export function GridFor({
    realm,
    name,
    sorted,
    Defs,
    colList
}: {
    realm: Realm;
    name: string;
    sorted: SortDescriptor[];
    Defs: DefinedType;
    colList: string[];
}) {
    const [getDescriptors] = useSorted(sorted);
    const $sorted = getDescriptors();
    return (
        <ModernGrid
            HeaderComponent={Headers}
            ImmutableRowComponent={ImmutableRow}
            MutableRowComponent={() => <></>}
            InsertControlsComponent={() => <></>}
            EditControlsComponent={() => <></>}
            data={() => realm.objects(name).sorted($sorted) as any}
            Definitions={Defs}
            columnList={colList}
        />
    );
}

export const filterOps = {
    eq: '==',
    dne: '!=',
    gt: '>',
    lt: '<',
    lte: '<=',
    gte: '>=',
    incl: 'CONTAINS[c]',
    like: 'LIKE',
    '&&': 'AND',
    '||': 'OR',
    some: 'ANY',
    every: 'ALL',
    none: 'NONE',
    cnt: '@count',
    avg: '@avg',
    min: '@min',
    max: '@max',
    sum: '@sum',
    nolink: '@link.@count == 0'
};

export function unzip<T, U>(arr: [T, U][]): [T[], U[]] {
    if (arr.length === 0) return [[], []];
    const [head, ...tail] = arr;
    const [left, right] = head;
    const [leftRemain, rightRemain] = unzip(tail);
    return [
        [left, ...leftRemain],
        [right, ...rightRemain]
    ];
}

export type OpSymbol = keyof typeof filterOps;
export type FilterTuple = [string, OpSymbol, string] | [string, OpSymbol, OpSymbol, string];
export const readSort = (sp: URLSearchParams) =>
    sp
        .get('sort')
        ?.split('&')
        .map((x) => x.split(':') as [string, 'ASC' | 'DESC']) ?? [];
export const getSortedDescriptors = (sp: URLSearchParams) => readSort(sp).map(([k, v]) => [k, v === 'ASC'] as SortDescriptor);

export const readSelected = (sp: URLSearchParams) => sp.get('selected')?.split('&') ?? [];

export function ifNilDelete(prop: string) {
    return function (obj: Record<string, any>) {
        if (isNotNil(getProperty(prop)(obj))) {
            return obj;
        }
        delete obj[prop];
        return obj;
    };
}
