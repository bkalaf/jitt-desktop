import Realm from 'realm';
import { ObjectId } from 'bson';
import { Country } from './data/enums/country';
import { Provinces } from './data/enums/province';
import { LengthUOMS } from './data/enums/lengthUOM';
import { CapacityUOMS } from './data/enums/capacityUOM';
import { Age, BarcodeType, BookType, Conditions, Gender, MediaType } from './data/enums';
import { MovieRatings, VideoGameRatings } from './data/enums/movieRatings';
import { ConsoleType } from './data/enums/consoleTypes';

declare global {
    export type IEventPublisher = {
        addEventListener: <TEvent extends Event>(name: string, listener: (ev: TEvent) => void) => void;
        removeEventListener: <TEvent extends Event>(name: string, listener: (ev: TEvent) => void) => void;
    };
    export type DataElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    export type HeteroEqComparator<T, U> = (a: T) => (b: U) => boolean;
    export type EqComparator<T> = HeteroEqComparator<T, T> | HeteroEqComparator<T, any>;

    export type StateUpdaterFunc<T> = (prev: T) => T;
    export type StateSetterFunc<T> = (setOrUpdate: T | StateUpdaterFunc<T>) => void;

    export type RealmClass<T> = Realm.ObjectClass & { new(): T & Realm.Object; };
    export type Result<T> = (T & Realm.Object);
    export type Children = React.ReactNode | React.ReactNode[];

    export interface IAction {
        (): void;
    }

    export interface ISelfStorage {
        _id: ObjectId;
        name: string;
        website?: string;
        facilities: IFacility[];
    }
    export interface IAddress {
        street?: string;
        suite?: string;
        city: string;
        state: Provinces;
        country: Country;
        postalCode?: string;
    }
    export interface IFacility {
        _id: ObjectId;
        selfStorage?: ISelfStorage;
        address?: IAddress;
        email?: string;
        phone?: string;
        facilityNumber?: string;
        units: IRentalUnit[];
        readonly name: string;
    }
    export interface ILength {
        value: number;
        uom: LengthUOMS;
        readonly displayAs: string;
    }
    export interface ISquareFootage {
        length: ILength;
        width: ILength;
        readonly displayAs: string;
    }
    export interface IRentalUnit {
        _id: ObjectId;
        facility?: IFacility;
        unit: string;
        size: ISquareFootage;
    }
    export interface ICapacity {
        value: number;
        uom: CapacityUOMS;
    }
    export interface IFileEntry {
        _id: ObjectId;
        name: string;
        parent?: IFileEntry;
        materializedPath: string;
        owner: string;
        blob?: IBlob;
        contents: IFileEntry[];
        readonly size: ICapacity;
        readonly isFolder: boolean;
        readonly isFile: boolean;
        readonly parentPath: string;
        readonly mimetype: string | undefined;
    }
    export interface IFileKind {
        invoiceId: any;
        receiptId: any;
        photoId: any;
        docId: any;
        readonly discriminator?: string;
    }
    export interface IBlob {
        _id: ObjectId;
        owner: string;
        data?: ArrayBuffer;
        hash?: string;
        originalName: string;
        fileKind?: IFileKind;
        mimetype?: string;
        fileEntry?: IFileEntry;
        size: ICapacity;
        readonly extension: string;
    }
    export interface IPurchase {
        _id: ObjectId;

    }

    export interface IItem {
        _id: ObjectId;
        product: IProduct;
        photos: IPhoto[];
        sku: IBarcode;
        condition: Conditions;
        defects?: string[];
        features?: string[];
        tested?: Date;
        draft?: any;
        acquiredOn?: Date;
        auction?: IPurchase;
    }
    export interface IPhoto {
        _id: ObjectId;
        name: string;
        original: string;
        materializedPath: string;
        item: IItem;
        originalData: ArrayBuffer;
        finalData: ArrayBuffer;
        useFinal: boolean;
        useOriginal: boolean;
        caption?: string;
        needsReview: boolean;
    }
    export interface IProductLine {
        _id: ObjectId;
        brand: IBrand;
        name: string;
        products: IProduct[];
    }
    export interface ILocation {
        _id: ObjectId;
        name: string;
        notes?: string;
        fixtures?: IFixture[];
        address?: IAddress;
        barcode: IBarcode;
    }
    export interface ICustomItem {
        _id: ObjectId;
        name: string;
        idPrefix?: string;
    }
    export interface ICustomItemEntry {
        _id: ObjectId;
        customItem: ICustomItem;
        label?: string;
        key?: string;
        ordinal?: number;
        id?: string;
    }
    export interface IProduct {
        _id: ObjectId;
        brand?: IBrand;
        productLine?: IProductLine;
        description?: string;
        header?: string;
        model?: string;
        notes?: string;
        origin?: Country;
        itemType?: IItemType;
        color?: string;

        dims: Partial<Record<string, IDimension<string>>>;
        barcodes: Partial<Record<BarcodeType & 'UPC', IBarcode>>;

        birthYear?: number;
        details?: IDetails;
        links?: string[];
        keywords?: Set<string>;

    }
    export interface IItemType {
        _id: ObjectId;
        taxonomy: ITaxonomy[];
        classification: ITaxonomy;
        name: string;
        details: string[];
        superType: IItemType;
    }
    export interface IEffectivePointer {
        location?: IBarcode;
        fixture?: IBarcode;
        bin?: IBarcode;
        item?: IBarcode;
    }
    export interface IScan {
        _id: ObjectId;
        current: string;
        effective: IEffectivePointer;
        timestamp: Date;
        user?: string;
        completed: boolean;
    }
    // export interface ICategory {

    // }
    export interface IMeasurement {
        of: string;
        dim: IDimension<string>;
    }
    export interface IFlags {
        isCollectorsEdition: boolean;
        isDirectorsCut: boolean;
        hasManual: boolean;
        hasClothingTags: boolean;
        hasOriginalPackaging: boolean;
        isLimitedEdition: boolean;
        isVintage: boolean;
        isRare: boolean;
        isAutographed: boolean;
        isSpecialEdition: boolean;
        isDiscontinued: boolean;

    }
    export interface IDetails {
        title?: string;
        subtitle?: string;
        authors?: string[];
        starring?: string[];
        rating?: MovieRatings | VideoGameRatings;
        awards?: string[];
        copyright?: number;
        studio?: string;
        measurements: Record<string, IMeasurement>;
        size?: string;
        gender?: Gender;
        flags: IFlags;
        age?: Age;
        ageRange?: string;
        playerCountMin?: number;
        playerCountMax?: number;
        consoleType?: ConsoleType;
        bookType?: BookType;
        mediaType?: MediaType;
        discCount?: number;
        pageCount?: number;
        publisher?: string;
        pattern?: string;
    }
    export interface ITexttileRn {
        _id: ObjectId;
        company: ICompany;
        rn: number;
        country: string;
    }
    export interface ICompany {
        _id: ObjectId;
        parent: ICompany;
        name: string;
        descendants: ICompany[];
        aliases: string[];
        rn: ITexttileRn;

    }
    export interface IVerifiedBrand {
        _id: ObjectId;
        name: string;
    }
    export interface ICategory {
        _id: ObjectId;
        id: string;
        label: string;
        node: 0 | 1 | 2;
    }
    export interface ITaxonomy {
        _id: ObjectId;
        category: ICategory;
        subCategory: ICategory;
        subSubCategory: ICategory;
        materializedPath: string;
        selectors: [string, string, string];
        itemType: IItemType;
        activity: any;
    }
    export interface IBrand {
        _id: ObjectId;
        name: string;
        alias: string[];
        company: ICompany;
        verifiedBrand: IVerifiedBrand;

    }
    export interface IBarcode {
        _id: ObjectId;
        barcode: string;
        valid: boolean;
        type: BarcodeType;
        description?: string;
        bin?: IBin[];
        location?: ILocation[];
        fixture?: IFixture[];
        product?: IProduct;
        item?: IItem[];
    }
    export interface IFixture {
        _id: ObjectId;
        name: string;
        barcode: IBarcode;
        notes?: string;
        location: ILocation;
        bins: IBin[];
    }
    export interface IBin {
        _id: ObjectId;
        name: string;
        barcode: IBarcode;
        notes?: string;
        fixture?: IFixture;
        items: IItem[];
    }
    export interface IDimension<TUOM> {
        value: number;
        uom: TUOM;
        remaining?: IDimension<TUOM>;
    }
}
export const i = 1;
