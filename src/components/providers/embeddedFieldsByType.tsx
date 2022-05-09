import { ObjectSchemaProperty } from 'realm';
import { objectMap } from '../../common/obj/objectMap';

// export function lookupDAL(typename: string, fieldname: string): Partial<IFieldInfo> {
//     const info = DAL[typename].fields.find((x) => x.name === fieldname);
//     if (info == null) return { name: fieldname };
//     return info;
// }
export function embeddedFieldsByType(schema: Realm.ObjectSchema[]) {
    const embeddedTypes = schema
        .map((x) => ({ name: x.name, embedded: x.embedded }))
        .filter((x) => x.embedded)
        .map((x) => x.name);
    const byType = schema.map(
        (x) => [x.name, Object.entries(x.properties).filter(([name, osp]) => embeddedTypes.includes((osp as ObjectSchemaProperty).objectType ?? ''))] as [
            string,
            [string, ObjectSchemaProperty][]
        ]
    );
    return objectMap((x: [string, ObjectSchemaProperty][]) => Object.fromEntries(x))(Object.fromEntries(byType));
}
