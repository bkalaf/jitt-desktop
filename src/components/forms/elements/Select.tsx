import React, { SelectHTMLAttributes } from 'react';
import { useQuery } from 'react-query';
import { isNotNil } from '../../../common/isNotNull';
import useLocalRealm from '../../../hooks/useLocalRealm';
import { useWhyDidYou } from '../../../hooks/useWhyDidYou';
import { OptionElementFields } from '../../../types';

export function Select(
    props: SelectHTMLAttributes<HTMLSelectElement> & {
        enumMap?: Record<string, string>;
        objectType?: string;
        optionMap?: OptionElementFields;
        filter?: [string, (x: any) => any];
    }
) {
    useWhyDidYou(Select.name, props);
    const { enumMap, ...remain } = props;
    return enumMap != null ? <EnumSelect {...remain} enumMap={enumMap} /> : <LookupSelect {...remain} />;
}

export function EnumSelect(
    props: SelectHTMLAttributes<HTMLSelectElement> & {
        enumMap?: Record<string, string>;
        objectType?: string;
        optionMap?: OptionElementFields;
    }
) {
    const { enumMap, ...remain } = props;
    if (enumMap == null) throw new Error('null enumMap');

    return (
        <select {...remain}>
            <option key='default' value={undefined} label='Please choose...' />
            {Object.entries(enumMap)
                .sort((a, b) => {
                    return a[1] < b[1] ? -1 : a[1] === b[1] ? 0 : 1;
                })
                .map(([k, v]) => (
                    <option key={k} value={k} label={v} />
                ))}
        </select>
    );
}

export function LookupSelect(
    props: SelectHTMLAttributes<HTMLSelectElement> & {
        enumMap?: Record<string, string>;
        objectType?: string;
        optionMap?: OptionElementFields;
        filter?: [string, (x: any) => any];
    }
) {
    const { filter, objectType, optionMap, ...remain } = props;
    const realm = useLocalRealm();
    console.log(`objectType, filter, optionMap`, objectType, filter, optionMap);
    const { data } = useQuery(
        ['dropdown', objectType],
        () =>
            Object.fromEntries(
                (isNotNil(filter) ? realm.objects(objectType ?? '').filtered(filter[0], filter[1](null)) : realm.objects(objectType ?? '')).map((x: Realm.Object) => {
                    console.log(`realm.object-x`, x);
                    return [(x as any)._id.toHexString(), (x as any)[optionMap?.label ?? '']] as [string, string];
                })
            ),
        {
            suspense: true
        }
    );

    // useRealmQuery(
    //     'dropdown',
    //     objectType,
    //     [],
    //     () => true,
    //     (data) => {
    //         if (data == null) return undefined;
    //         const d = data as any as Realm.Results<{ _id: Realm.BSON.ObjectId } & Realm.Object>;
    //         return Object.fromEntries(d.map((x) => [(x as any)[optionMap?.value ?? ''], (x as any)[optionMap?.label ?? '']] as [string, string]));
    //     },
    //     filter
    // );

    console.log(`data`, data);
    return (
        <React.Suspense fallback={<EnumSelect {...remain} enumMap={{}} />}>
            <EnumSelect {...remain} enumMap={data} />;
        </React.Suspense>
    );
}
