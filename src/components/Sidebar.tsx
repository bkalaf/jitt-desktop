import { createContext, useEffect } from 'react';
import { isIn } from '../common/array/isIn';
import { useArray } from '../hooks/useArray';
import { useVisibility } from '../hooks/useVisibility';
import { Visibility } from '../types/ui/Visibility';
import { useProvidedContext } from './providers/OverlayProvider';

export type HorizontalDirection = 'left' | 'right';

export type SidebarProps = {
    side: HorizontalDirection;
};

export function useProvideSidebar(side: HorizontalDirection): ISidebarContext {
    const [visibility, cycleVisibility] = useVisibility('hidden');
    const { arr: contents, pop: popContents, append: appendContents } = useArray<JSX.Element>();
    useEffect(() => {
        if (contents.length > 0 && isIn(['hidden'])(visibility)) {
            cycleVisibility();
        }
        if (contents.length === 0 && visibility === 'shown') {
            cycleVisibility();
        }
    }, [contents, cycleVisibility, visibility]);
    return {
        side,
        visibility,
        cycleVisibility,
        contents,
        popContents,
        appendContents
    };
}

export type ISidebarContext = {
    side: HorizontalDirection;
    contents: JSX.Element[];
    visibility: Visibility;
    popContents: () => void;
    appendContents: (item: JSX.Element) => void;
    cycleVisibility: () => void;
};

export const LeftSidebarContext = createContext<ISidebarContext | undefined>(undefined);
export const RightSidebarContext = createContext<ISidebarContext | undefined>(undefined);

export function LeftSidebarProvider({ children }: { children: Children }) {
    const value = useProvideSidebar('left');
    return <LeftSidebarContext.Provider value={value}>{children}</LeftSidebarContext.Provider>;
}

export function RightSidebarProvider({ children }: { children: Children }) {
    const value = useProvideSidebar('right');
    return <RightSidebarContext.Provider value={value}>{children}</RightSidebarContext.Provider>;
}

export function useLeftSidebar() {
    return useProvidedContext('LeftSidebar', LeftSidebarContext);
}
export function useRightSidebar() {
    return useProvidedContext('RightSidebar', RightSidebarContext);
}
