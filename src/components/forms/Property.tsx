/* eslint-disable react/no-children-prop */
import React from 'react';
import { IPropertyInfo } from '../providers/SchemaProvider';
import { Control } from './Control';
import { Output } from './elements/Output';
import { Select } from './elements/Select';
import { Input } from './elements/Input';
import { Reference } from '../Reference';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';

export function Property(props: IPropertyInfo) {
    useWhyDidYou('Property', props);
    const { name, label, local, pattern, inputType, enumMap, option, propertyType, ...remain } = props;
    if (propertyType === 'reference') {
        return <Reference {...props} />;
    }
    if (enumMap) {
        return (
            <Control
                name={name}
                tag='SELECT'
                El={Select}
                label={label}
                children={Object.entries(enumMap).map(([k, v], ix) => (
                    <option key={k} value={k} label={v} />
                ))}
            />
        );
    } else if (inputType) {
        return <Control name={name} tag='INPUT' El={Input} pattern={pattern?.toString()} label={label} {...remain} type={inputType} />;
    } else if (props.local) {
        return <Control name={name} tag='OUTPUT' El={Output} label={label} {...remain} />;
    }
    return <Control name={name} tag='INPUT' El={Input} pattern={pattern?.toString()} label={label} {...remain} type={inputType} />;
}
