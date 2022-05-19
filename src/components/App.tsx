import Realm from 'realm';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, makeVar, useReactiveVar } from '@apollo/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { UI } from './UI';
import { MainWindow } from './MainWindow';
import { ignore } from '../common/ignore';
import { app } from '@electron/remote';
import { schema } from '../data';
import { $currentUser, $realm } from './globals';
import { IAppCommand, ICommand } from '../types/ui/ICommand';
import { buildLibrary, useLog } from './providers/buildLibrary';
import { MetaDataContextProvider } from './providers/MetaDataProvider';
import { getAccessToken } from '../util/getAccessToken';
import { Boundary } from './grid/Boundary';
import { useAsyncResource } from 'use-async-resource';

export const $insertCommand = makeVar<IAppCommand<never[]>>({
    execute: ignore,
    canExecute: () => false
});
export const $deleteCommand = makeVar<ICommand<any[]>>({
    disabled: true,
    execute: ignore,
    canExecute: () => true,
    validFor: ['grid', 'insert', 'edit']
});
export const $selectAllCommand = makeVar<ICommand<any[]>>({
    disabled: true,
    execute: ignore,
    canExecute: () => true,
    validFor: ['grid', 'insert', 'edit']
});
export const $clearSelectedCommand = makeVar<ICommand<any[]>>({
    disabled: true,
    execute: ignore,
    canExecute: () => true,
    validFor: ['grid', 'insert', 'edit']
});
export const $clearSortCommand = makeVar<ICommand<any[]>>({
    disabled: true,
    execute: ignore,
    canExecute: () => true,
    validFor: ['grid', 'insert', 'edit']
});
export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://realm.mongodb.com/api/client/v2.0/app/jitt-mntcv/graphql',
        fetch: async (uri: any, options: any) => {
            const accessToken = await getAccessToken();
            options.headers.Authorization = `Bearer ${accessToken}`;
            return fetch(uri, options);
        }
    }),
    cache: new InMemoryCache()
});
export const queryClient = new QueryClient();
async function openRealm(cu: Realm.User | null | undefined) {
    if (!cu) return;
    const x = await Realm.open({
        schema: schema,
        path: [app.getPath('appData'), 'jitt-desktop', 'db.realm'].join('/'),
        sync: {
            user: cu,
            partitionValue: 'bobby.kalaf@junk-in-the-trunk.com'
        }
    });
    $realm(x);
    buildLibrary(x);
    return x;
}
export function App() {
    const log = useLog();
    const currentUser = useReactiveVar($currentUser);
    log(currentUser);
    const [realmReader, updateReader] = useAsyncResource(() => openRealm(currentUser), []);
    return (
        <React.StrictMode>
            <Boundary>
                <HashRouter>
                    <QueryClientProvider client={queryClient}>
                        <ApolloProvider client={apolloClient}>
                            <MetaDataContextProvider reader={realmReader}>
                                <UI>
                                    <React.Suspense fallback='loading'>
                                        <MainWindow realmReader={realmReader} />
                                    </React.Suspense>
                                </UI>
                            </MetaDataContextProvider>
                        </ApolloProvider>
                    </QueryClientProvider>
                </HashRouter>
            </Boundary>
        </React.StrictMode>
    );
}
