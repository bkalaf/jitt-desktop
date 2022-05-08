import Realm from 'realm';
import { ObjectId } from 'bson';
import { Country } from './data/enums/country';
import { Provinces } from './data/enums/province';
import { LengthUOM } from './data/enums/lengthUOM';
import { CapacityUOM } from './data/enums/capacityUOM';

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

    export type RealmClass<T> = Realm.ObjectClass & { new (): T & Realm.Object };
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
        uom: LengthUOM;
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
        uom: CapacityUOM;
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
}
export const i = 1;
