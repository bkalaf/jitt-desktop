import { ObjectSchema } from 'realm';
import { ObjectId } from 'bson';
import { objectMap } from '../common/obj/objectMap';
import { Provinces } from './enums/province';
import { Country } from './enums/country';
import { lengths, pluralize } from './enums/lengthUOM';

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
    filesystemItem: 'filesystem-item',
    file: 'file',
    fileKind: 'file-kind'
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
        return [this.selfStorage?.name ?? '', [this.address.city, this.address.state].join(', '), this.address.street?.split(' ').slice(1)].join(' - ');
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
            size: SquareFootage.schema.name
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
}

export const schema = [SelfStorage, Facility, Address, RentalUnit, Length, SquareFootage];
