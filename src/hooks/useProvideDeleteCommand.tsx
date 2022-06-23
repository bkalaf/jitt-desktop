import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { $deleteCommand } from '../components/App';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from './useToast';
import { toTitleCase } from '../common/text/toTitleCase';
import { deleteSelected } from '../queries/deleteById';
import { useRoutedCollection } from './useRoutedCollection';
import { useProvideCommand } from './useProvideCommand';
import useLocalRealm from './useLocalRealm';

export function useProvideDeleteCommand() {
    const [rVar, command, setCommand, unsetCommand] = useProvideCommand($deleteCommand);
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const realm = useLocalRealm();
    const [collection, id] = useRoutedCollection();
    const selected = useMemo(() => searchParams.get('selected')?.split('&') ?? [], [searchParams]);
    const disabled = realm == null || selected.length === 0;
    const mutation = useMutation(deleteSelected(realm, collection), {
        onSuccess: (ids: string[], params) => {
            successToast(`You have successfully deleted ${ids.length} records.`, 'SUCCESS', `${toTitleCase(collection)} Delete`);
            queryClient.invalidateQueries(['selectAll', collection]);
            queryClient.invalidateQueries(['dropdown', collection]);
            queryClient.refetchQueries(['selectAll', collection]);
            queryClient.refetchQueries(['dropdown', collection]);
        },
        onError: (error: any) => {
            failureToast(error.message, 'FAILED', error.name);
        }
    });
    const execute = useCallback(() => {
        if (realm == null || disabled) return;
        mutation.mutate(selected);
    }, [disabled, mutation, realm, selected]);
    useEffect(() => {
        console.log('useProvideDeleteCommand:useEffect');
        setCommand(execute, disabled);
        return () => unsetCommand();
    }, [disabled, execute, setCommand, unsetCommand]);
}
