import { useCallback, useMemo, useTransition } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toTitleCase } from '../common';
import { useLog } from "../hooks/useLog";
import useLocalRealm from '../hooks/useLocalRealm';
import { useNavigateDown } from '../hooks/useNavigateDown.1';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useToast } from '../hooks/useToast';
import { MutationState, invalidateRefetch, $queryKey } from './index';
import { useLocation } from 'react-router-dom';

export function useRealmMutation<T, TResult = void>(
    asyncFunc: (realm: Realm, collection: string) => (args: T) => Promise<TResult>,
    extraWork: (result: TResult) => void,
    overrideCollection?: string
): [state: MutationState, isLoading: boolean, execute: (arg: T) => void] {
    const realm = useLocalRealm();
    const location = useLocation();
    const mutationName = toTitleCase(asyncFunc.name);
    const [collection] = useRoutedCollection();
    const queryClient = useQueryClient();
    const refetch = invalidateRefetch(queryClient);
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const log = useLog();
    const errorToast = useToast('error');
    const navigateDescend = useNavigateDown(location.state as any);
    const usableCollection = overrideCollection ?? collection;
    const mutation = useMutation(asyncFunc(realm, usableCollection), {
        onSuccess: (data: TResult) => {
            successToast(`Mutation completed successfully. ${data}`, `SUCCESS`, mutationName);
            refetch(...$queryKey.selectAll(usableCollection));
            refetch(...$queryKey.dropdown(usableCollection));
            extraWork(data);
            console.log(`location.state`, location.state);
            navigateDescend();
        },
        onError: (error: any) => {
            log(error);
            errorToast(error.message, 'ERROR!', error.name);
        }
    });
    const status = useMemo(
        () =>
            mutation.isLoading
                ? 'loading'
                : mutation.isError
                ? 'error'
                : mutation.isIdle
                ? 'idle'
                : mutation.isPaused
                ? 'paused'
                : mutation.isSuccess
                ? 'success'
                : mutation,
        [mutation]
    );
    const [isLoading, startTransition] = useTransition();
    const execute = useCallback((arg: T) => startTransition(() => mutation.mutate(arg)), [mutation]);
    return [status, isLoading, execute];
}
