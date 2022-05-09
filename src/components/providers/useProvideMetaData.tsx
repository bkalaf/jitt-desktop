import { ObjectSchemaProperty } from 'realm';
import { ORM } from './SchemaProvider';
import { useRealm } from '../../hooks/useRealm';
import { Output } from '../forms/elements/Output';
import { Select } from '../forms/elements/Select';
import { Input } from '../forms/elements/Input';
import { FieldSet, ListElement, IconCell, TableCell, PropertyInfo } from './DataTypeInfo';

export function useProvideMetaData() {
    const realm = useRealm();
    const findRealmSchema = (x: string, t: string) => realm?.schema.find((y) => y.name === x)?.properties[t] as ObjectSchemaProperty;
    const ormTypes = Object.fromEntries(
        Object.entries(ORM).map(([typeName, { columns, descendants, sort, displayAs }]) => [
            typeName,
            {
                sort,
                descendants,
                displayAs,
                properties: Object.fromEntries(
                    columns.map(
                        ({
                            name, autoGen, displayAs: fieldDisplayAs, embedded, enum: enumMap, icon, inputType, label, local, min, option, pattern, readOnly, to
                        }) => {
                            const { optional, indexed, property, objectType, type } = findRealmSchema(typeName, name) ?? {};
                            return [
                                name,
                                {
                                    name,
                                    dataType: {
                                        type: type,
                                        objectType: objectType,
                                        indexed: indexed ?? false,
                                        optional: optional ?? false,
                                        property: property
                                    },
                                    props: {
                                        autoGen,
                                        inputType,
                                        label,
                                        local,
                                        min,
                                        option,
                                        pattern,
                                        readOnly,
                                        to,
                                        enumMap,
                                        embedded,
                                        displayAs: fieldDisplayAs ?? displayAs
                                    },
                                    Control: property != null
                                        ? Select
                                        : objectType != null && type === 'object' && fieldDisplayAs == null
                                            ? FieldSet
                                            : objectType != null && type === 'object'
                                                ? Input
                                                : objectType != null
                                                    ? ListElement
                                                    : type == null
                                                        ? Output
                                                        : Input,
                                    Cell: icon ? (IconCell as any) : TableCell
                                }
                            ];
                        }
                    ) as [string, PropertyInfo][]
                )
            }
        ])
    );
    return {
        types: ormTypes,
        getType: (x: string) => ormTypes[x],
        getProperty: (x: string, t: string) => ormTypes[x].properties[t],
        getObjectClass: (x: string) => realm?.schema.find((y) => y.name === x),
        getSort: (x: string) => ormTypes[x].sort
    };
}
