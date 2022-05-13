// import { RealmTypes } from './MainRouter';

// export function getConversion(type: RealmTypes, objectType: undefined): (s?: string) => any | null;
// export function getConversion(type: RealmTypes, objectType?: string | undefined): (s?: string[]) => any[];
// export function getConversion(type: RealmTypes, objectType?: string | undefined): ((s?: string) => any | null) | ((s?: string[]) => any[]) {
//     switch (type) {
//         case 'bool':
//             return (s?: string) => (s == null ? null : s === 'true' ? true : false);
//         case 'decimal128':
//         case 'double':
//         case 'float':
//             return (s?: string) => (s == null ? null : parseFloat(s));
//         case 'int':
//             return (s?: string) => (s == null ? null : parseInt(s, 10));
//         case 'dictionary':
//         case 'list':
//         case 'set':
//             return (s?: string[]) => (s == null ? [] : s.map((x) => getConversion((objectType ?? 'string') as RealmTypes)(x as any)));
//         case 'object':
//         case 'objectId':
//             return (s?: string) => (s == null ? null : new Realm.BSON.ObjectId(s));
//         case 'string':
//             return (s?: string) => (s == null ? null : s);
//         case 'uuid':
//             return (s?: string) => (s == null ? null : new Realm.BSON.UUID(s));
//         default:
//             throw new Error('not found: ' + type);
//     }
// }
