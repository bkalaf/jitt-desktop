import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { DataOrModifiedFn } from 'use-async-resource';
import { toTitleCase } from '../common';
import { useLog } from './providers/buildLibrary';
import { useActivity } from './useActivity';
import * as Webdriver from 'webdriverio';
import { useProvidedContext } from './providers/OverlayProvider';

export const ActivityContainerContext = createContext<
    [React.FunctionComponent[], React.FunctionComponent[], (fc: React.FunctionComponent) => void, (fc: React.FunctionComponent) => void] | undefined
>(undefined);
export function ActivityContainerProvider({ children }: { children: Children }) {
    const [lastRunList, setLastRunList] = useState<React.FunctionComponent[]>([]);
    const [runButtonList, setRunButtonList] = useState<React.FunctionComponent[]>([]);
    const appendLastRun = useCallback((lr: React.FunctionComponent) => setLastRunList((prev) => [...prev, lr]), []);
    const appendButtonList = useCallback((btn: React.FunctionComponent) => setRunButtonList((prev) => [...prev, btn]), []);
    const value = useMemo(
        () =>
            [lastRunList, runButtonList, appendLastRun, appendButtonList] as [
                React.FunctionComponent[],
                React.FunctionComponent[],
                (fc: React.FunctionComponent) => void,
                (fc: React.FunctionComponent) => void
            ],
        [appendButtonList, appendLastRun, lastRunList, runButtonList]
    );
    return <ActivityContainerContext.Provider value={value}>{children}</ActivityContainerContext.Provider>;
}
export function useActivityContainer() {
    return useProvidedContext('ActivityContainerContext', ActivityContainerContext);
}
