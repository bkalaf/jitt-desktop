import { ObjectSchemaProperty } from 'realm';
import { toTitleCase } from '../../common/text/toTitleCase';
import { DAL } from './DAL';
import { IColumnInfo } from '../../types/metadata/IColumnInfo';
import { IPropertyInfo } from '../../types/metadata/IPropertyInfo';

export function ofProperties(embeddedTypes: string[], typeName: string, pTypes: Realm.PropertiesTypes) {
    const locals = DAL[typeName].columns
        .filter((x: any) => !Object.keys(pTypes).includes(x))
        .map((x: any) => [
            x,
            {
                name: x,
                datatype: (pTypes[x] as ObjectSchemaProperty)?.type ?? 'string',
                flags: {
                    optional: false,
                    indexed: false,
                    linkingObjects: false,
                    embedded: false,
                    reference: false,
                    enumerable: false,
                    local: true,
                    primitive: false
                }
            }
        ]) as [string, IPropertyInfo][];
    const props = Object.entries(pTypes) as [string, ObjectSchemaProperty][];
    const merged = props.map(([k, v]) => [
        k,
        {
            datatype: (pTypes[k] as ObjectSchemaProperty)?.type ?? 'string',
            mappedTo: v.mapTo,
            property: v.property,
            objectType: v.objectType,
            type: v.type,
            name: k,
            typeName,
            defaultValue: v.default,
            flags: {
                optional: v.optional,
                indexed: v.indexed,
                linkingObjects: v.type === 'linkingObjects',
                embedded: v.type === 'object' && v.property == null && embeddedTypes.includes(v.objectType ?? ''),
                reference: v.type === 'object' && v.property == null && !embeddedTypes.includes(v.objectType ?? ''),
                enumerable: v.objectType != null && v.type !== 'object',
                local: false,
                primitive: v.objectType == null
            }
        }
    ]) as [string, IPropertyInfo][];
    const columns = [...merged, ...locals].map(([k, v]) => [
        k,
        { ...v, ...DAL[typeName].fields.find((x: any) => x.name === k), label: DAL[typeName].fields.find((x: any) => x.name === k)?.label ?? toTitleCase(k) }
    ]) as [string, IColumnInfo][];
    return Object.fromEntries(columns);
}
