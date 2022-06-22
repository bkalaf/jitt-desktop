import React from 'react';
import { RegisterFunction } from '../../hooks/useRegister';
import { IDefinitionProps } from './index';

export function OutputEle(props: { register: RegisterFunction; } & IDefinitionProps) {
    const { name, register, ...remain } = props;
    return <output {...register(name, remain)} />;
}
