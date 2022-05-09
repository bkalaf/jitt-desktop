import { useReactiveVar } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { ObjectClass, ObjectSchemaProperty } from 'realm';
import { toTitleCase } from '../common/text/toTitleCase';
import { schema } from '../data';
import { indexSort } from '../common/obj/indexSort';
import { ISchemaContext, ITypeInfo, toTypeInfo, IPropertyInfo, createProps } from '../components/providers/SchemaProvider';
import { useRealm } from './useRealm';

/**
 * @deprecated
 */
export function useProvideSchemaContext(): ISchemaContext {
    const realm = useRealm();
    const getObjectClass = useCallback(function <T>(name: string) {
        return schema.find((x) => x.schema.name === name) as any as ObjectClass & { new (): T };
    }, []);
    const types: Record<string, ITypeInfo> | null = useMemo(() => {
        if (realm == null) return null;
        return Object.fromEntries(
            realm.schema.map((x) => [x.name, toTypeInfo(x.name, Object.entries(x.properties) as [string, ObjectSchemaProperty][], x.embedded ?? false)])
        );
    }, [realm]);
    const getType = useCallback(
        (name: string) => {
            if (types == null) return null;
            return types[name];
        },
        [types]
    );
    const getProperty = useCallback(
        (typename: string, name: string) => {
            if (types == null) return null;

            return types[typename].properties[name];
        },
        [types]
    );
    const getControls = useCallback(
        (name: string): [string, IPropertyInfo | null][] => {
            if (types == null) return [];
            const result = Object.entries(getType(name)?.properties ?? {})
                .sort(indexSort)
                .map(([name, info]) =>
                    info?.propertyType !== 'embedded'
                        ? ([[name, info]] as [string, IPropertyInfo | null][])
                        : (getControls(info.objectType ?? '').map(([k, v]) => [
                              [name, k].join('.'),
                              { ...v, parentTypes: [...(info.parentTypes ?? []), info.objectType] }
                          ]) as [string, IPropertyInfo | null][])
                )
                .reduce((pv, cv) => [...pv, ...cv], [])
                .map(([k, v], ix) => [
                    k,
                    {
                        ...v,
                        index: ix,
                        label: v?.label ?? toTitleCase(v?.name ?? ''),
                        props: createProps(k, v) as React.HTMLAttributes<DataElement>
                    }
                ]);
            return result as any;
        },
        [getType, types]
    );
    const getColumns = useCallback(
        (name: string): [string, IPropertyInfo | null][] => {
            if (types == null) return [];
            const result = Object.entries(getType(name)?.properties ?? {})
                .sort(indexSort)
                .map(([name, info]) =>
                    !info?.embedded || (info.embedded && info?.displayAs === true)
                        ? ([[name, info]] as [string, IPropertyInfo | null][])
                        : (getColumns(info.objectType ?? '').map(([k, v]) => [
                              [name, k].join('.'),
                              { ...v, parentTypes: [...(info.parentTypes ?? []), info.objectType] }
                          ]) as [string, IPropertyInfo | null][])
                )
                .reduce((pv, cv) => [...pv, ...cv], [])
                .map(([k, v], ix) => [
                    k,
                    {
                        ...v,
                        index: ix,
                        label: v?.label ?? toTitleCase(v?.name ?? ''),
                        props: createProps(k, v) as React.HTMLAttributes<DataElement>
                    }
                ]);
            return result as any;
        },
        [getType, types]
    );
    return {
        types,
        getObjectClass,
        getColumns,
        getControls,
        getType,
        getProperty
    };
}
