import React from 'react';
import { RegisterFunction, useRegister } from '../../hooks/useRegister';
import { $cn } from '../../util/$cn';
import { IDefinitionProps } from './index';

export function InputEle(props: { register: RegisterFunction; } & IDefinitionProps) {
    const { name, defaultValue, init, ...remain } = props;
    const $defaultValue = defaultValue ?? (init == null ? null : init());
    const register = useRegister()[0];
    const spread = $cn(remain, {}, 'peer');
    return <input defaultValue={$defaultValue} {...register(name, spread)} />;
}
