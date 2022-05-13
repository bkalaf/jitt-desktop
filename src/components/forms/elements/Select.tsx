import React, { SelectHTMLAttributes } from 'react';
import { useQuery } from 'react-query';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { useRoutedCollection } from '../../../hooks/useRoutedCollection';
import { useWhyDidYou } from '../../../hooks/useWhyDidYou';
import { dropdown } from '../../../queries/dropdown';
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
            {Object.entries(enumMap).map(([k, v]) => (
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
    const realm = useLocalRealm();
    const { data } = useQuery(['dropdown', objectType], dropdown(realm, objectType ?? '', [optionMap?.value ?? '', optionMap?.label ?? '']), {
        suspense: true
    });
    return <EnumSelect {...remain} enumMap={data} />;
}
