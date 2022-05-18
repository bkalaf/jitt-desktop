import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { IAppCommand, ICommand } from '../../types/ui/ICommand';
import { ViewKind } from '../../types/metadata/ViewKind';
import { ignore } from '../../common';
import { isNotNull } from '../../common/isNotNull';

export interface ICommander {
    clearFilter?: ICommand<never[], 'grid'>;
    clearSelected?: ICommand<never[], 'grid'>;
    clearSort?: ICommand<never[], 'grid'>;
    delete?: ICommand<never[], 'grid'>;
    filter?: ICommand<never[], 'grid'>;
    insertLinkedRecord?: ICommand<[string], 'insert' | 'edit'>;
    insertRecord?: ICommand<never[], 'grid' | 'edit'>;
    openListing?: ICommand<never[], 'grid' | 'edit'>;
    nextPage?: ICommand<never[], 'grid'>;
    prevPage?: ICommand<never[], 'grid'>;
    printBinLabel?: ICommand<never[], 'grid' | 'edit'>;
    printSkuLabel?: ICommand<never[], 'grid' | 'edit'>;
    selectAll?: ICommand<never[], 'grid'>;
    startAPICrawl?: ICommand<never[]>;
    startScanning?: ICommand<never[]>;
    stopScanning?: ICommand<never[]>;
    toggleSort?: ICommand<[string], 'grid'>;
}

export const CommanderContext = createContext<Record<string, IAppCommand<any[]>>>({});

export function useProvideCommander() {
    const commands = useRef<Map<string, ICommand<any, any>>>(new Map());
    const addCommand = useCallback(function <T extends any[]>(
        key: string,
        execute: (...args: T) => void,
        canExecute: () => boolean,
        isGrid = true,
        isInsert = true,
        isEdit = true
    ) {
        const validFor = [isGrid ? 'grid' : null, isInsert ? 'insert' : null, isEdit ? 'edit' : null].filter(isNotNull) as ViewKind[];
        commands.current.set(key, { canExecute, disabled: false, execute, validFor });
    },
    []);
    const removeCommand = useCallback((key: string) => {
        commands.current.set(key, { canExecute: () => false, disabled: true, execute: ignore, validFor: ['grid', 'insert', 'edit'] });
    }, []);
    return {
        commands,
        addCommand,
        removeCommand
    };
}
export function Commander(props: { children: Children; commands: [string, IAppCommand<any>][] }) {
    const current = useContext(CommanderContext);
    const nextContext: Record<string, IAppCommand<any>> = useMemo(() => ({}), []);
    Object.getOwnPropertyNames(current).map((x) => (nextContext[x] = current[x]));
    useEffect(() => {
        props.commands.map(([k, v]) => (nextContext[k] = v));
    }, [nextContext, props.commands]);
    return <CommanderContext.Provider value={nextContext}>{props.children}</CommanderContext.Provider>;
}
