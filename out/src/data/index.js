"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.RentalUnit = exports.SquareFootage = exports.Length = exports.Facility = exports.Address = exports.SelfStorage = exports.mongo = exports.dt = exports.primitives = void 0;
const bson_1 = require("bson");
const objectMap_1 = require("./objectMap");
exports.primitives = {
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
exports.dt = Object.assign(Object.assign({}, exports.primitives), { optional: Object.assign({}, (0, objectMap_1.objectMap)(x => `${x}?`)(exports.primitives)), linkingObjects: 'linkingObjects', object: 'object', list: 'list', dictionary: 'dictionary', set: 'set' });
exports.mongo = {
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
class SelfStorage {
    constructor() {
        this.name = '';
        this._id = new bson_1.ObjectId();
        this.facilities = [];
    }
}
exports.SelfStorage = SelfStorage;
SelfStorage.schema = {
    name: exports.mongo.selfStorage,
    primaryKey: '_id',
    properties: {
        _id: exports.dt.objectId,
        name: exports.dt.string,
        website: exports.dt.optional.string,
        facilities: {
            type: exports.dt.linkingObjects,
            objectType: exports.mongo.facility,
            property: 'selfStorage'
        }
    }
};
class Address {
    constructor() {
        this.city = '';
        this.state = 'CA';
        this.country = 'US';
    }
}
exports.Address = Address;
Address.schema = {
    name: 'address',
    embedded: true,
    properties: {
        street: exports.dt.optional.string,
        suite: exports.dt.optional.string,
        city: { type: exports.dt.string, default: '' },
        state: { type: exports.dt.string, default: 'CA' },
        country: { type: exports.dt.string, default: 'US' },
        postalCode: exports.dt.optional.string
    }
};
class Facility {
    constructor() {
        this._id = new bson_1.ObjectId();
        this.address = new Address();
        this.units = [];
    }
    get name() {
        var _a, _b, _c;
        return [(_b = (_a = this.selfStorage) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '', [this.address.city, this.address.state].join(', '), (_c = this.address.street) === null || _c === void 0 ? void 0 : _c.split(' ').slice(1)].join(' - ');
    }
}
exports.Facility = Facility;
Facility.schema = {
    name: 'facility',
    primaryKey: '_id',
    properties: {
        _id: exports.dt.objectId,
        selfStorage: SelfStorage.schema.name,
        address: Address.schema.name,
        facilityNumber: exports.dt.optional.string,
        email: exports.dt.optional.string,
        phone: exports.dt.optional.string,
        units: {
            type: exports.dt.linkingObjects,
            objectType: exports.mongo.rentalUnit,
            property: exports.mongo.facility
        }
    }
};
class Length {
    constructor() {
        this.value = 0;
        this.uom = 'in';
    }
    get displayAs() {
        const v = Number.isInteger(this.value) ? this.value.toFixed(0) : this.value.toFixed(1);
        return `${v} ${this.uom}`;
    }
}
exports.Length = Length;
Length.schema = {
    name: exports.mongo.length,
    embedded: true,
    properties: {
        value: { type: exports.dt.double, default: 0 },
        uom: { type: exports.dt.string, default: 'in' }
    }
};
class SquareFootage {
    constructor() {
        this.length = new Length();
        this.width = new Length();
    }
    get displayAs() {
        return `${this.length.displayAs} x ${this.width.displayAs}`;
    }
}
exports.SquareFootage = SquareFootage;
SquareFootage.schema = {
    name: exports.mongo.squareFootage,
    embedded: true,
    properties: {
        length: exports.mongo.length,
        width: exports.mongo.length
    }
};
class RentalUnit {
    constructor() {
        this._id = new bson_1.ObjectId();
        this.size = new SquareFootage();
        this.unit = '';
    }
}
exports.RentalUnit = RentalUnit;
RentalUnit.schema = {
    name: exports.mongo.rentalUnit,
    primaryKey: '_id',
    properties: {
        _id: exports.dt.objectId,
        facility: Facility.schema.name,
        unit: exports.dt.string,
        size: SquareFootage.schema.name
    }
};
exports.schema = [
    SelfStorage,
    Facility,
    Address,
    RentalUnit,
    Length,
    SquareFootage
];
console.log(Object.getOwnPropertyDescriptor(new Facility(), 'name'));
console.log(Object.getOwnPropertyNames(new Facility()));
console.log(Object.getOwnPropertyNames(Facility));
console.log(Object.getOwnPropertyDescriptor(Facility, 'name'));
console.log(new Facility().name);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGF0YS9pbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsK0JBQWdDO0FBQ2hDLDJDQUF3QztBQUszQixRQUFBLFVBQVUsR0FBRztJQUN0QixRQUFRLEVBQUUsVUFBVTtJQUNwQixNQUFNLEVBQUUsUUFBUTtJQUNoQixHQUFHLEVBQUUsS0FBSztJQUNWLEtBQUssRUFBRSxPQUFPO0lBQ2QsTUFBTSxFQUFFLFFBQVE7SUFDaEIsVUFBVSxFQUFFLFlBQVk7SUFDeEIsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07Q0FDZixDQUFBO0FBQ1ksUUFBQSxFQUFFLG1DQUNSLGtCQUFVLEtBQ2IsUUFBUSxvQkFDRCxJQUFBLHFCQUFTLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsa0JBQVUsQ0FBQyxHQUUxQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQ2hDLE1BQU0sRUFBRSxRQUFRLEVBQ2hCLElBQUksRUFBRSxNQUFNLEVBQ1osVUFBVSxFQUFFLFlBQVksRUFDeEIsR0FBRyxFQUFFLEtBQUssSUFDWjtBQUNXLFFBQUEsS0FBSyxHQUFHO0lBQ2pCLFdBQVcsRUFBRSxjQUFjO0lBQzNCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLFVBQVUsRUFBRSxhQUFhO0lBQ3pCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxnQkFBZ0I7SUFDL0IsSUFBSSxFQUFFLE1BQU07SUFDWixjQUFjLEVBQUUsaUJBQWlCO0lBQ2pDLElBQUksRUFBRSxNQUFNO0lBQ1osUUFBUSxFQUFFLFdBQVc7Q0FFeEIsQ0FBQTtBQUNELE1BQWEsV0FBVztJQW1CcEI7UUFDSSxJQUFJLENB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