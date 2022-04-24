import Realm from 'realm';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { UI } from './UI';
import { MainWindow } from './MainWindow';

export const realmApp = new Realm.App('jitt-mntcv');
export const $currentUser = makeVar(realmApp.currentUser);
export async function getAccessToken() {
    const user = $currentUser();
    if (user) {
        return user.accessToken ?? '';
    }
    return '';
}
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
    return (
        <React.StrictMode>
            <HashRouter>
                <QueryClientProvider client={queryClient}>
                    <ApolloProvider client={apolloClient}>
                        <UI>
                            <MainWindow />
                        </UI>
                    </ApolloProvider>
                </QueryClientProvider>
            </HashRouter>
        </React.StrictMode>
    );
}
