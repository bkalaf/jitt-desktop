import { ObjectSchema } from 'realm';
import { ObjectId } from 'bson';
import { objectMap } from '../common/obj/objectMap';
import { Provinces } from './enums/province';
import { Country } from './enums/country';
import { lengths, pluralize } from './enums/lengthUOM';
import { AuctionSites } from './enums/auctionSite';
import { MimeTypes } from './enums/mimeTypes';
import { not } from '../common';
import { now } from '../aggregator';

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
    brand: 'brand',
    category: 'category',
    taxonomy: 'taxonomy',
    itemtype: 'item-type',
    verifiedBrand: 'verified-brand',
    activity: 'activity'
};
export const dt = {
    ...primitives,
    optional: {
        ...objectMap((x) => `${x}?`)(primitives)
    },
    listOf: {
        ...objectMap((x) => `${x}[]`)(primitives),
        ...objectMap((x) => `${x}[]`)(mongo)
    },
    linkingObjects: 'linkingObjects',
    object: 'object',
    list: 'list',
    dictionary: 'dictionary',
    set: 'set'
};
console.log(dt);

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
        return [this.selfStorage?.name ?? '', [this.address.city, this.address.state].join(', '), this.address.street?.split(' ').slice(1).join(' ')].join(
            ' - '
        );
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
    };
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
    };
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
    };
    _id: ObjectId;
    fsAlloc: FileAlloc[];
    data?: ArrayBuffer;
    size: number;
    mimeType?: MimeTypes;
    invoice: Purchase[];
    constructor() {
        this._id = new ObjectId();
        this.size = 0;
        this.mimeType = '';
        this.fsAlloc = [];
        this.invoice = [];
    }
    get name() {
        // const arr = Object.entries(this.fsAlloc ?? {})[0][1];
        // const arr1 = this.fsAlloc[0];
        // console.log("ARR1", arr1);
        // const arr2 = Object.entries(this.fsAlloc[0]);
        // console.log('ARR2', arr2);
        // console.log('ARR', arr);
        console.log('NEW NAME', this.fsAlloc[0]);
        return this.fsAlloc[0].name;
    }
    get isAssigned() {
        return (this.invoice[0] != null).toString();
    }
    get isInvoice() {
        return FileItem.INVOICE_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
    }
    get isPhoto() {
        return FileItem.PHOTO_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
    }
    get isReceipt() {
        return FileItem.RECEIPT_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
    }
    get isDoc() {
        return FileItem.DOC_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
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
    };
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
        return [this.parent?.path ?? '', this.name].join('/');
    }
    get isFolder(): string {
        return (this.fsItem == null).toString();
    }
    get isFile(): string {
        return (!(this.fsItem == null)).toString();
    }
    get count(): number {
        return this.content.length;
    }
    get size(): number {
        return this.content.map((s) => s.size).reduce((x, y) => x + y, 0);
    }
    get type(): string {
        if (this.fsItem == null) return 'folder';
        if (this.fsItem.isInvoice === 'true') return 'invoice';
        if (this.fsItem.isPhoto === 'true') return 'photo';
        if (this.fsItem.isDoc === 'true') return 'document';
        if (this.fsItem.isReceipt === 'true') return 'receipt';
        return 'unknown';
    }
}

export class Company {
    static schema: ObjectSchema = {
        name: mongo.company,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            name: dt.string,
            parent: mongo.company,
            descendants: {
                type: dt.linkingObjects,
                objectType: mongo.company,
                property: 'parent'
            },
            aliases: {
                type: dt.list,
                objectType: dt.string
            },
            rns: {
                type: dt.list,
                objectType: dt.int
            },
            country: {
                type: dt.list,
                objectType: dt.string
            },
            brands: {
                type: dt.linkingObjects,
                objectType: mongo.brand,
                property: 'company'
            }
        }
    };
}

export class VerifiedBrand {
    static schema: ObjectSchema = {
        name: mongo.verifiedBrand,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            name: dt.string
        }
    };
    _id: ObjectId;
    name: string;
    constructor() {
        this._id = new ObjectId();
        this.name = '';
    }
}
export class Brand {
    static schema: ObjectSchema = {
        name: mongo.brand,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            name: dt.string,
            alias: dt.listOf.string,
            productLines: dt.listOf.string,
            company: mongo.company,
            verifiedBrand: mongo.verifiedBrand
        }
    };
    _id: ObjectId;
    name: string;
    alias: string[];
    productLines: string[];
    company?: Company;
    verifiedBrand?: VerifiedBrand;
    constructor() {
        this._id = new ObjectId();
        this.name = '';
        this.alias = [];
        this.productLines = [];
    }
}
export class Category {
    static schema: ObjectSchema = {
        name: mongo.category,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            id: dt.string,
            label: dt.string,
            node: dt.int
        }
    };
}
export class Taxonomy {
    static schema: ObjectSchema = {
        name: mongo.taxonomy,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            category: mongo.category,
            subCategory: mongo.category,
            subSubCategory: mongo.category,
            materializedPath: dt.string,
            selectors: dt.listOf.string,
            itemType: mongo.itemtype
        }
    };
}
export class ItemType {
    static schema: ObjectSchema = {
        name: mongo.itemtype,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            taxonomy: mongo.taxonomy,
            name: dt.string
        }
    };
}

export type ActivityAction = 'scrape' | 'import';

export type ActivityScope = 'brands' | 'categories' | 'taxonomy';

export class Activity {
    static schema : ObjectSchema = {
        name: mongo.activity,
        primaryKey: '_id',
        properties: {
            _id: dt.objectId,
            action: dt.string,
            scope: dt.string,
            when: dt.date,
            isComplete: dt.bool,
            isScheduled: dt.bool
        }
    };
    _id: ObjectId;
    action: ActivityAction;
    scope: ActivityScope;
    when: Date;
    isComplete: boolean;
    isScheduled: boolean;
    constructor() {
        this._id = new ObjectId();
        this.action = 'scrape';
        this.scope = 'brands';
        this.when = now();
        this.isComplete = false;
        this.isScheduled = true;
    }
}
export const schema = [
    SelfStorage,
    Facility,
    Address,
    RentalUnit,
    Length,
    SquareFootage,
    FileAlloc,
    FileItem,
    Purchase,
    Cost,
    Company,
    Brand,
    Category,
    Taxonomy,
    VerifiedBrand,
    ItemType,
    Activity
];

export function createFileAlloc(realm: Realm, name: string, parentName: string, child: string) {
    const parent = realm.objects<FileAlloc>(mongo.fsAlloc).filtered(`materializedPath == '/${parentName}'`)[0];
    const obj = {
        _id: new Realm.BSON.ObjectId(),
        name,
        originalName: name,
        materializedPath: [parent.materializedPath, name].join('/'),
        parent
    };
    const gpobj = {
        _id: new Realm.BSON.ObjectId(),
        name: child,
        originalName: child,
        materializedPath: [obj.materializedPath, child].join('/'),
        parent: obj
    };
    let result: FileAlloc | undefined;
    realm.write(() => {
        result = realm.create<FileAlloc>(mongo.fsAlloc, gpobj as any);
    });
    return result;
}
