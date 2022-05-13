import Realm from 'realm';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, makeVar, useReactiveVar } from '@apollo/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import React, { useEffect } from 'react';
import { UI } from './UI';
import { MainWindow } from './MainWindow';
import { ignore } from '../common/ignore';
import { app } from '@electron/remote';
import { schema } from '../data';
import { SchemaProvider } from './providers/SchemaProvider';
import { MetaDataProvider } from './providers/DataTypeInfo';
import { $currentUser, $realm } from './globals';
import { IAppCommand, ICommand } from '../types/ui/ICommand';
import { buildLibrary } from './providers/buildLibrary';
import { MetaDataContextProvider } from './providers/MetaDataProvider';
import { getAccessToken } from '../util/getAccessToken';
import { Spinner } from './Spinner';
import { Boundary } from './grid/Boundary';

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
export function App() {
    const cu = useReactiveVar($currentUser);
    useEffect(() => {
        if (cu) {
            Realm.open({
                schema: schema,
                path: [app.getPath('appData'), 'jitt-desktop', 'db.realm'].join('/'),
                sync: {
                    user: cu,
                    partitionValue: cu.profile?.email ?? ''
                }
            })
                .then((x) => {
                    $realm(x);
                    return x;
                })
                .then(buildLibrary);
        }
    }, [cu]);
    return (
        <React.StrictMode>
            <Boundary>
                <HashRouter>
                    <QueryClientProvider client={queryClient}>
                        <ApolloProvider client={apolloClient}>
                            <MetaDataContextProvider>
                                <SchemaProvider>
                                    <UI>
                                        <React.Suspense fallback='loading'>
                                            <MainWindow />
                                        </React.Suspense>
                                    </UI>
                                </SchemaProvider>
                            </MetaDataContextProvider>
                        </ApolloProvider>
                    </QueryClientProvider>
                </HashRouter>
            </Boundary>
        </React.StrictMode>
    );
}
