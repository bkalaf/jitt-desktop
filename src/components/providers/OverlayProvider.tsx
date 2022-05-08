import { makeVar } from '@apollo/client';
import { createContext, HTMLAttributes, useContext, useEffect } from 'react';
import { useProvideOverlay } from '../../hooks/useProvideOverlay';

export type IOverlayContext = {
    contents: JSX.Element[];
    appendOverlay: (item: JSX.Element) => void;
    popOverlay: () => void;
    props: HTMLAttributes<HTMLElement>;
};

export const OverlayContext = createContext<IOverlayContext | undefined>(undefined);

export function useProvidedContext<T>(name: string, Context: React.Context<T>) {
    const context = useContext<T>(Context);
    if (context == null) throw new Error(`${name}: bad null context`);
    return context!;
}
export function useOverlay() {
    return useProvidedContext('OverlayContext', OverlayContext);
}
export function OverlayProvider({ children }: { children: Children }) {
    const overlay = useProvideOverlay();
    return <OverlayContext.Provider value={overlay}>{children}</OverlayContext.Provider>;
}
