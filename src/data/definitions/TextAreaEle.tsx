import React from 'react';
import { RegisterFunction } from '../../hooks/useRegister';
import { $cn } from '../../util/$cn';
import { IDefinitionProps } from './index';

export function TextAreaEle(props: { register: RegisterFunction; } & IDefinitionProps) {
    const { name, register, defaultValue, rows, init, ...remain } = props;
    const $defaultValue = defaultValue ?? (init == null ? null : init());
    const spread = $cn(remain, {}, 'peer');
    return <textarea rows={rows} defaultValue={$defaultValue} {...register(name, spread)} />;
}
