import Realm from 'realm';
import { ObjectId } from 'bson';
import { CountryISO2 } from './data-access/enums/CountryISO2';
import { Provinces } from './data-access/enums/Provinces';
import { CapacityUOM } from './data-access/Capacity';

declare global {
    export type IEventPublisher = {
        addEventListener: <TEvent extends Event>(name: string, listener: (ev: TEvent) => void) => void;
        removeEventListener: <TEvent extends Event>(name: string, listener: (ev: TEvent) => void) => void;
    };
    export type HeteroEqComparator<T, U> = (a: T) => (b: U) => boolean;
    export type EqComparator<T> = HeteroEqComparator<T, T> | HeteroEqComparator<T, any>;

    export type StateUpdaterFunc<T> = (prev: T) => T;
    export type StateSetterFunc<T> = (setOrUpdate: T | StateUpdaterFunc<T>) => void;

    export type Children = React.ReactNode | React.ReactNode[];
    export type DataElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    export interface IAction {
        (): void;
    }

    export interface ISelfStorage {
        _id: ObjectId;
        name: string;
        website?: string;
        facilities: FacilityDTO[];
    }
    export interface IAddress {
        street?: string;
        suite?: string;
        city: string;
        state: Provinces;
        country: CountryISO2;
        postalCode?: string;
        readonly shortString: string;
    }
    export interface IFacility {
        _id: ObjectId;
        selfStorage?: ISelfStorage;
        address?: IAddress;
        email?: string;
        phone?: string;
        facilityNumber?: string;
        readonly name: string;
    }
    export interface ICapacity {
        value: number;
        uom: CapacityUOM;
        normalize();
        convertUp();
        convertDown();
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