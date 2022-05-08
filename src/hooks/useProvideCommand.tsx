import { ReactiveVar, useReactiveVar } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ignore } from '../common/ignore';
import { useForceUpdate } from './useProvideInsertCommand';
import { ICommand } from './ICommand';

export function useProvideCommand<TArgs extends any[]>(
    rVar: ReactiveVar<ICommand<TArgs>>
): [
    rVar: ReactiveVar<ICommand<TArgs>>,
    command: ICommand<TArgs>,
    setCommand: (func: (...args: TArgs) => void, isDisabled: boolean) => void,
    unsetCommand: () => void
] {
    const forceUpdate = useForceUpdate();
    const [isDisabled, setEnabled] = useState(true);
    const execute = useRef<(...args: TArgs) => void>(ignore);
    const command = useMemo(() => ({ execute: execute.current, disabled: isDisabled }), [isDisabled]);

    const setCommand = useCallback(
        (func: (...args: TArgs) => void, isDisabled = false) => {
            setEnabled(isDisabled);
            execute.current = func;
            forceUpdate();
        },
        [forceUpdate]
    );
    const unsetCommand = useCallback(() => {
        setEnabled(true);
        execute.current = ignore;
        forceUpdate();
    }, [forceUpdate]);

    useEffect(() => {
        rVar(command);
    }, [command, rVar]);

    const cmd = useReactiveVar(rVar);
    return [rVar, cmd, setCommand, unsetCommand];
}
