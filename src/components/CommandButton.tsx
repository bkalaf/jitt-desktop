import { ReactiveVar, useReactiveVar } from '@apollo/client';
import React from 'react';
import { ICommand } from '../types/ui/ICommand';
import { IconButtonProps, IconButton } from './MainWindow';

export function CommandButton<TArgs extends any[]>(props: Omit<IconButtonProps, 'onClick' | 'disabled'> & { rVar: ReactiveVar<ICommand<TArgs>> }) {
    const { rVar, ...remain } = props;
    const { disabled, execute } = useReactiveVar(rVar);
    return <IconButton {...remain} disabled={disabled} onClick={execute} />;
}
