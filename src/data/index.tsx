import { ObjectSchema } from 'realm';
import { ObjectId } from 'bson';
import { objectMap } from '../common/obj/objectMap';
import { Provinces } from './enums/province';
import { Country } from './enums/country';
import { lengths, pluralize } from './enums/lengthUOM';
import { AuctionSites } from './enums/auctionSite';
import { MimeTypes } from './enums/mimeTypes';

export const primitives = {
    objectId: 'objectId',
    string: 'string',
    int: 'int',
    float: 'float',
    double: 'double',
    decimal128: 'decimal128',
    date: 'date',
    data: 'data',
    uuid: 'uuid',
    bool: 'bool'
};
export const dt = {
    ...primitives,
    optional: {
        ...objectMap((x) => `${x}?`)(primitives)
    },
    linkingObjects: 'linkingObjects',
    object: 'object',
    list: 'list',
    dictionary: 'dictionary',
    set: 'set'
};
export const mongo = {
    selfStorage: 'self-storage',
    address: 'address',
    facility: 'facility',
    rentalUnit: 'rental-unit',
    purchase: 'purchase',
    length: 'length',
    squareFootage: 'square-footage',
    cost: 'cost',
    fsAlloc: 'fs-alloc',
    fsItem: 'fs-item',
    fileKind: 'file-kind',
    company: 'company',
    brand: 'brand'
};

export class SelfStorage {
    static schema: ObjectSchema = {
        name: mongo.selfStorage,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            name: dt.string,
            website: dt.optional.string,
            facilities: {
                type: dt.linkingObjects,
                objectType: mongo.facility,
                property: 'selfStorage'
            }
        }
    };
    _id: ObjectId;
    name: string;
    website?: string;
    facilities: Facility[];
    constructor() {
        this.name = '';
        this._id = new ObjectId();
        this.facilities = [];
    }
}
export class Address {
    static schema: ObjectSchema = {
        name: 'address',
        embedded: true,
        properties: {
            street: dt.optional.string,
            suite: dt.optional.string,
            city: { type: dt.string, default: '' },
            state: { type: dt.string, default: 'CA' },
            country: { type: dt.string, default: 'US' },
            postalCode: dt.optional.string
        }
    };
    street?: string;
    suite?: string;
    city: string;
    state: Provinces;
    country: Country;
    postalCode?: string;
    constructor() {
        this.city = '';
        this.state = 'CA';
        this.country = 'US';
    }
}
export class Facility {
    static schema: ObjectSchema = {
        name: 'facility',
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            selfStorage: SelfStorage.schema.name,
            address: Address.schema.name,
            facilityNumber: dt.optional.string,
            email: dt.optional.string,
            phone: dt.optional.string,
            units: {
                type: dt.linkingObjects,
                objectType: mongo.rentalUnit,
                property: mongo.facility
            }
        }
    };
    _id: ObjectId;
    address: Address;
    selfStorage?: SelfStorage;
    facilityNumber?: string;
    email?: string;
    phone?: string;
    units: RentalUnit[];
    constructor() {
        this._id = new ObjectId();
        this.address = new Address();
        this.units = [];
    }
    get name() {
        return [this.selfStorage?.name ?? '', [this.address.city, this.address.state].join(', '), this.address.street?.split(' ').slice(1).join(' ')].join(' - ');
    }
}
export class Length {
    static schema: ObjectSchema = {
        name: mongo.length,
        embedded: true,
        properties: {
            value: { type: dt.double, default: 0 },
            uom: { type: dt.string, default: 'in' }
        }
    };
    value: number;
    uom: 'in' | 'm' | 'ft' | 'cm' | 'mm' | 'yd' | 'mi' | 'km';
    constructor() {
        this.value = 0;
        this.uom = 'in';
    }
    get displayAs() {
        const v = Number.isInteger(this.value) ? this.value.toFixed(0) : this.value.toFixed(1);
        return `${v} ${this.uom}`;
    }
}
export class SquareFootage {
    static schema: ObjectSchema = {
        name: mongo.squareFootage,
        embedded: true,
        properties: {
            length: mongo.length,
            width: mongo.length
        }
    };
    length: Length;
    width: Length;
    get displayAs() {
        return `${this.length.displayAs} x ${this.width.displayAs}`;
    }
    constructor() {
        this.length = new Length();
        this.width = new Length();
    }
}
export class RentalUnit {
    static schema: ObjectSchema = {
        name: mongo.rentalUnit,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            facility: Facility.schema.name,
            unit: dt.string,
            size: SquareFootage.schema.name,
            purchase: {
                type: dt.linkingObjects,
                objectType: mongo.purchase,
                property: 'rentalUnit'
            }
        }
    };
    _id: ObjectId;
    facility?: Facility | undefined;
    unit: string;
    size: SquareFootage;
    constructor() {
        this._id = new ObjectId();
        this.size = new SquareFootage();
        this.unit = '';
    }
    get name() {
        return [this.facility?.name, this.unit].join(' - ');
    }
}

export class Company {
    static schema: ObjectSchema = {
        name: 'company',
        primaryKey: '_id',
        properties: {
            _id: dt.objectId
        }
    }
}
export class Cost {
    static schema: ObjectSchema = {
        name: mongo.cost,
        embedded: true,
        properties: {
            bid: { type: dt.double, default: 0 },
            taxPercent: { type: dt.optional.double, default: 0 },
            taxExempt: { type: dt.bool, default: false },
            premiumPercent: { type: dt.optional.double, default: 0 }
        }
    }
    bid: number;
    taxPercent: number;
    taxExempt: boolean;
    premiumPercent: number;
    constructor() {
        this.bid = 0;
        this.taxPercent = 0;
        this.premiumPercent = 0;
        this.taxExempt = false;
    }
    get taxDollar() {
        return this.taxExempt ? 0 : this.bid * (this.taxPercent / 100);
    }
    get premiumDollar() {
        return this.bid * (this.premiumPercent / 100);
    }
    get totalDollar() {
        return this.bid + this.premiumDollar + this.taxDollar;
    }
}
export class Purchase {
    static schema: ObjectSchema = {
        name: mongo.purchase,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            cost: mongo.cost,
            closeDate: dt.date,
            auctionSite: dt.string,
            auctionId: dt.optional.string,
            invoiceId: dt.optional.string,
            invoice: mongo.fsItem,
            rentalUnit: mongo.rentalUnit
        }
    }
    _id: ObjectId;
    cost: Cost;
    closeDate: Date;
    auctionSite: AuctionSites;
    auctionId?: string;
    invoiceId?: string;
    invoice?: FileItem;
    rentalUnit?: RentalUnit;
    constructor() {
        this._id = new ObjectId();
        this.cost = new Cost();
        this.closeDate = new Date(Date.now());
        this.auctionSite = 'storagetreasures.com';
    }
}

export class FileItem {
    static INVOICE_REGEX = /^\/auctions\/(\d*\/)?invoices\//;
    static PHOTO_REGEX = /^\/products\/(\d*\/)?images\//;
    static DOC_REGEX = /^\/products\/(\d*\/)?docs\//;
    static RECEIPT_REGEX = /^\/(auctions|products)\/(\d*\/)?receipts\//;

    
    static schema: ObjectSchema = {
        name: mongo.fsItem,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            fsAlloc: {
                type: dt.linkingObjects,
                objectType: mongo.fsAlloc,
                property: 'fsItem'
            },
            data: dt.optional.data,
            size: dt.int,
            mimeType: dt.optional.string,
            invoice: {
                type: dt.linkingObjects,
                objectType: mongo.purchase,
                property: 'invoice'
            }
            // TODO add doc
            // TODO add photo
            // TODO add receipt
        }
    }
    _id: ObjectId;
    fsAlloc?: FileAlloc;
    data?: ArrayBuffer;
    size: number;
    mimeType?: MimeTypes;
    invoice?: Purchase;
    constructor() {
        this._id = new ObjectId();
        this.size = 0;
        this.mimeType = '';
    }
    get name() {
        return this.fsAlloc?.name;
    }
    get isAssigned() {
        return this.invoice != null;
    }
    get isInvoice() {
        return FileItem.INVOICE_REGEX.test(this.fsAlloc?.path ?? '/');
    }
    get isPhoto() {
        return FileItem.PHOTO_REGEX.test(this.fsAlloc?.path ?? '/');
    }
    get isReceipt() {
        return FileItem.RECEIPT_REGEX.test(this.fsAlloc?.path ?? '/');
    }
    get isDoc() {
        return FileItem.DOC_REGEX.test(this.fsAlloc?.path ?? '/');
    }
}
export class FileAlloc {
    
    static schema: ObjectSchema = {
        name: mongo.fsAlloc,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            name: dt.string,
            originalName: dt.string,
            parent: mongo.fsAlloc,
            content: {
                type: dt.linkingObjects,
                objectType: mongo.fsAlloc,
                property: 'parent'
            },
            materializedPath: dt.string,
            fsItem: mongo.fsItem,
            fileCreation: dt.optional.date
        }
    }
    _id: ObjectId;
    name: string;
    originalName: string;
    parent?: FileAlloc;
    content: FileItem[];
    materializedPath: string;
    fsItem?: FileItem;
    fileCreation?: Date;
    constructor() {
        this._id = new ObjectId();
        this.name = '';
        this.originalName = '';
        this.content = [];
        this.materializedPath = '';
    }
    get path(): string {
        return [this.parent?.path ?? '/', this.name].join('/');
    }
    get isFolder(): boolean {
        return this.fsItem == null;
    }
    get isFile(): boolean {
        return !this.isFolder;
    }
    get count(): number {
        return this.content.length;
    }
    get size(): number {
        return this.content.map(s => s.size).reduce((x, y) => x + y, 0);
    }
}
export const schema = [SelfStorage, Facility, Address, RentalUnit, Length, SquareFootage, FileAlloc, FileItem, Purchase, Cost];
