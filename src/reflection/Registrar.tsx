import { countries, lengthUOMS, provinces } from '../data/enums';
import { IField } from './IField';
import { Field } from './Field';
import { Types, infoCtor, infoCtor2, infoCtor3, ListKind, TypeKind } from './typeInfo';

export class Registrar {
    realm: Realm;
    static Instance: Registrar | undefined;
    static Get(realm: Realm) {
        if (Registrar.Instance == null) Registrar.Instance = new Registrar(realm);
        return Registrar.Instance;
    }
    private types: Map<string, Types>;
    private fields: Map<string, Map<string, IField>>;

    constructor(realm: Realm) {
        this.realm = realm;
        this.types = new Map();
        this.fields = new Map();
        this.addType('uuid');
        this.addType('bool');
        this.addType('string');
        this.addType('int');
        this.addType('double');
        this.addType('float');
        this.addType('decimal128');
        this.addType('data');
        this.addType('date');
        // this.addType(
        //     'object',
        //     'address',
        //     true,
        //     ...Field.$new('suite')
        //         .ofString()
        //         .$('street')
        //         .ofString()
        //         .$('city')
        //         .ofString()
        //         .asReq()
        //         .$('state')
        //         .setEnum(provinces)
        //         .asReq()
        //         .setDefault('CA')
        //         .$('country')
        //         .setEnum(countries)
        //         .asReq()
        //         .setDefault('US')
        //         .$('postalCode')
        //         .ofString(false, /^[0-9]{5}([-]?[0-9]{4})?$|^[A-Za-z][0-9][A-Za-z][-]?[0-9][A-Za-z][0-9]$/)
        //         .$$()
        // );
        // this.addType(
        //     'object',
        //     'self-storage',
        //     false,
        //     ...Field.ID().$('name').ofString(true).withBounds(5, 150).asReq().$('website').asURL().$('facilities').ofBacklink('facility', true).$$()
        // );
        // this.addType(
        //     'object',
        //     'facility',
        //     false,
        //     ...Field.ID()
        //         .$('selfStorage')
        //         .ofLookup('name')
        //         .asReq()
        //         .$('address')
        //         .ofComplex('address')
        //         .$('email')
        //         .asEmail()
        //         .$('phone')
        //         .asTel()
        //         .$('facilityNumber')
        //         .ofString()
        //         .$('units')
        //         .ofBacklink('rental-unit', true)
        //         .$$()
        // );
        // this.addType(
        //     'complex-type',
        //     'length',
        //     true,
        //     ...Field.$new('value').ofDouble().asReq().withBounds(0).$('uom').ofString(true).setEnum(lengthUOMS).asReq().$$()
        // );
        // this.insertType(
        //     'complex-type',
        //     'square-footage',
        //     true,
        //     undefined,
        //     Field.$new('length').ofComplex('length').asCalculated('square-footage', 'displayAs').$('width').ofComplex('length').$$()
        // );
        // this.insertType(
        //     'complex-type',
        //     'rental-unit',
        //     false,
        //     undefined,
        //     Field.ID().$('facility').ofLookup('name').$('unit').ofString().$('size').ofComplex('square-footage').$('purchase').ofLookup('closeDate').$$()
        // );
    }
    addType(arg0: string) {
        return ;
    }
    insertType(kind: TypeKind, name: string, embedded: boolean, listType?: ListKind, fields?: Record<string, IField>) {
        const records = this.realm.objects('type-data').filtered('kind == $0 AND name == $1', kind, name);
        if (records.length === 0) {
            console.log(`adding: ${name}`);
            this.types.set(name, { name, kind: kind as any, embedded, listType, fields: fields ?? {} });
            this.realm.write(() => {
                this.realm.create('type-data', { name, kind, embedded, listType, fields: fields ?? {} });
            });
        }
    }

    // addType(type: string, objectType?: string, embedded = false, ...fields: IField[]) {
    //     if (objectType == null) {
    //         return this.types.set(type, infoCtor('value-type', type));
    //     }
    //     if (fields.length >= 0) {
    //         this.types.set(type, infoCtor2('complex-type', objectType, embedded as boolean, ...fields));
    //         return this.fields.set(type, new Map(fields.map((x) => [Array.isArray(x.name) ? x.name.join('.') : x.name, x])));
    //     }
    //     return this.types.set(type, infoCtor3('list-type', objectType, type as 'list' | 'dictionary' | 'set' | 'linkingObjects'));
    // }
    // addField(type: string, field: IField) {
    //     this.fields.set(type, Object.fromEntries);
    // }
}
