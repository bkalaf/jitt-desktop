import { ReactiveVar, useReactiveVar } from '@apollo/client';
import React from 'react';
import { IAppCommand, ICommand } from '../../types/ui/ICommand';
import { IconButtonProps, IconButton } from '../MainWindow';

export function CommandButton<TArgs extends any[]>(props: Omit<IconButtonProps, 'onClick' | 'disabled'> & { rVar: ReactiveVar<IAppCommand<TArgs>> }) {
    const { rVar, ...remain } = props;
    const { canExecute, execute } = useReactiveVar(rVar);
    return <IconButton {...remain} disabled={!canExecute()} onClick={execute} />;
}
