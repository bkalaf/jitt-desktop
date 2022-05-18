import React, { SelectHTMLAttributes } from 'react';
import { useQuery } from 'react-query';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { useRoutedCollection } from '../../../hooks/useRoutedCollection';
import { useWhyDidYou } from '../../../hooks/useWhyDidYou';
import { dropdown } from '../../../queries/dropdown';
import { useRealmQuery } from '../../../queries/useRealmQuery';
import { OptionElementFields } from '../../../types';

export function Select(
    props: SelectHTMLAttributes<HTMLSelectElement> & {
        enumMap?: Record<string, string>;
        objectType?: string;
        optionMap?: OptionElementFields;
    }
) {
    useWhyDidYou(Select.name, props);
    return props.enumMap != null ? <EnumSelect {...props} /> : <LookupSelect {...props} />;
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
        <select {...props}>
            <option key='default' value={undefined} label='Please choose...' />
            {Object.entries(enumMap).sort((a, b) => {
                return a[1] < b[1] ? -1 : a[1] === b[1] ? 0 : 1;
            }).map(([k, v]) => (
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
    }
) {
    const { objectType, optionMap, ...remain } = props;
    // const realm = useLocalRealm();
    // const { data } = useQuery(['dropdown', objectType], dropdown(realm, objectType ?? '', [optionMap?.value ?? '', optionMap?.label ?? '']), {
    //     suspense: true
    // });
    const [status, update, data] = useRealmQuery(
        'dropdown',
        objectType,
        [],
        () => true,
        (data) => {
            if (data == null) return undefined;
            const d = data as any as Realm.Results<{ _id: Realm.BSON.ObjectId } & Realm.Object>;
            return Object.fromEntries(d.map((x) => [(x as any)[optionMap?.value ?? ''], (x as any)[optionMap?.label ?? '']] as [string, string]));
        }
    );

    return (
        <React.Suspense fallback={<EnumSelect {...remain} enumMap={{}} />}>
            <EnumSelect {...remain} enumMap={data} />;
        </React.Suspense>
    );
}
