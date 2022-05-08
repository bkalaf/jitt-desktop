import { ViewKind } from '../components/providers/ViewKind';

export type ICommand<TArgs extends any[], TView extends ViewKind = 'grid' | 'insert' | 'edit'> = {
    execute: (...args: TArgs) => void;
    disabled: boolean;
    canExecute: () => boolean;
    validFor: ViewKind[];
};
