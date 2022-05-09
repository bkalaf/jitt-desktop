import { createContext, useCallback, useRef } from 'react';
import { ICommand } from '../../types/ui/ICommand';
import { ViewKind } from '../../types/metadata/ViewKind';

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

export const CommanderContext = createContext<ICommander | undefined>(undefined);

export function isNotNull<T>(x: T | null | undefined): x is NonNullable<T> {
    return x != null;
}
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
    
}
export function CommanderProvider(props: { children: Children }) {
    const value = useProvideCommander();
    return <CommanderContext.Provider value={undefined}>{props.children}</CommanderContext.Provider>;
}
