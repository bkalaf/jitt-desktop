"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facility = exports.Address = exports.SelfStorage = void 0;
const realm_1 = require("realm");
class SelfStorage {
    constructor() {
        this._id = new realm_1.BSON.ObjectId();
        this.name = '';
    }
}
exports.SelfStorage = SelfStorage;
SelfStorage.schema = {
    name: 'SelfStorage',
    primaryKey: '_id',
    properties: {
        _id: 'objectId',
        name: 'string',
        website: 'string?'
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
    name: 'Address',
    embedded: true,
    properties: {
        street: 'string?',
        suite: 'string?',
        city: 'string',
        state: 'string',
        country: 'string',
        postalCode: 'string'
    }
};
class Facility {
    constructor() {
        this._id = new realm_1.BSON.ObjectId();
        this.address = new Address();
    }
}
exports.Facility = Facility;
Facility.schema = {
    name: 'Facility',
    primaryKey: '_id',
    properties: {
        _id: 'objectId',
        selfStorage: 'SelfStorage',
        address: 'Address',
        facilityNumber: 'string?',
        email: 'string?',
        phone: 'string?'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9kYXRhL2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBMkM7QUFHM0MsTUFBYSxXQUFXO0lBQXhCO1FBVUksUUFBRyxHQUFrQixJQUFJLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN6QyxTQUFJLEdBQUcsRUFBRSxDQUFDO0lBRWQsQ0FBQzs7QUFiRCxrQ0FhQztBQVpVLGtCQUFNLEdBQWlCO0lBQzFCLElBQUksRUFBRSxhQUFhO0lBQ25CLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFVBQVUsRUFBRTtRQUNSLEdBQUcsRUFBRSxVQUFVO1FBQ2YsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUUsU0FBUztLQUNyQjtDQUNKLENBQUM7QUFLTixNQUFhLE9BQU87SUFBcEI7UUFlSSxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsVUFBSyxHQUFHLElBQUksQ0FBQztRQUNiLFlBQU8sR0FBRyxJQUFJLENBQUM7SUFFbkIsQ0FBQzs7QUFuQkQsMEJBbUJDO0FBbEJVLGNBQU0sR0FBaUI7SUFDMUIsSUFBSSxFQUFFLFNBQVM7SUFDZixRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRTtRQUNSLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLElBQUksRUFBRSxRQUFRO1FBQ2QsS0FBSyxFQUFFLFFBQVE7UUFDZixPQUFPLEVBQUUsUUFBUTtRQUNqQixVQUFVLEVBQUUsUUFBUTtLQUN2QjtDQUNKLENBQUE7QUFRTCxNQUFhLFFBQVE7SUFBckI7UUFhSSxRQUFHLEdBQWtCLElBQUksWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pDLFlBQU8sR0FBWSxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBS3JDLENBQUM7O0FBbkJELDRCQW1CQztBQWxCVSxlQUFNLEdBQWlCO0lBQzFCLElBQUksRUFBRSxVQUFVO0lBQ2hCLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFVBQVUsRUFBRTtRQUNSLEdBQUcsRUFBRSxVQUFVO1FBQ2YsV0FBVyxFQUFFLGFBQWE7UUFDMUIsT0FBTyxFQUFFLFNBQVM7UUFDbEIsY0FBYyxFQUFFLFNBQVM7UUFDekIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsS0FBSyxFQUFFLFNBQVM7S0FDbkI7Q0FDSixDQUFBIn0=