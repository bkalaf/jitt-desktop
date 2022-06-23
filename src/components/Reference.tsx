/* eslint-disable react/no-children-prop */
import React from 'react';
import { IPropertyInfo } from './providers/SchemaProvider';
import { useQuery } from 'react-query';
import useRealm from '../hooks/useRealm';
import { Control } from './forms/Control';
import { Select } from './forms/elements/Select';
import { dropdown } from '../queries/dropdown';
import { useWhyDidYou } from '../hooks/useWhyDidYou';

export function Reference(props: IPropertyInfo) {
    useWhyDidYou('Reference', props);
    const realm = useRealm();
    const { option, objectType, label, name } = props;
    const { data } = useQuery(['dropdown', objectType], dropdown(realm!, objectType ?? '', option as any), { suspense: true });
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Control
                name={name}
                tag='SELECT'
                El={Select}
                label={label}
                children={Object.entries(data ?? {}).map(([k, v], ix) => (
                    <option key={k} value={k} label={v} />
                ))}
            />
        </React.Suspense>
    );
}
