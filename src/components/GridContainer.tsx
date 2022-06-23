import { useEffect, useMemo } from 'react';
import { useMutation } from 'react-query';
import { ignore } from '../common';
import useLocalRealm from '../hooks/useLocalRealm';
import { useNavigateAndDrill } from '../hooks/useNavigateAndDrill';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useSelectable } from '../hooks/useSelectable';
import { useViewContext } from '../hooks/useViewContext';
import { deleteById, deleteSelected } from '../queries/deleteById';
import { IAppCommand } from '../types/ui/ICommand';
import { $insertCommand } from './App';
import { Boundary } from './grid/Boundary';
import { IGridViewContext, ViewProvider } from './providers/ViewProvider';
import { useMetaDataContext } from './Toaster';
import { useGrid } from './useGrid';

export const $insert = '$insert';
export const $delete = '$delete';

export const deadCommand = (key: string) => [
    key,
    {
        canExecute() {
            return false;
        },
        execute: ignore
    }
];
export function GridContainer() {
    const Grid = useGrid();
    const realm = useLocalRealm();
    const [collection] = useRoutedCollection(true);
    const Payload = useMetaDataContext().getFormPayload(collection);
    const drill = useNavigateAndDrill();
    const [selected] = useSelectable();
    const deleteRows = useMutation(deleteSelected(realm, collection));
    const insertC = useMemo(
        () => ({
            canExecute() {
                return true;
            },
            execute() {
                return drill('new');
            }
        }),
        [drill]
    );
    useEffect(() => {
        $insertCommand(insertC);
        return () => {
            $insertCommand({ canExecute: () => false, execute: ignore });
        };
    }, [insertC]);
    const insertCommand = [$insert, insertC] as [string, IAppCommand<any>];
    const deleteCommand = [
        $delete,
        {
            canExecute() {
                return selected.length > 0;
            },
            execute() {
                return deleteRows.mutate(selected);
            }
        }
    ] as [string, IAppCommand<any>];
    return (
        <Boundary>
            <ViewProvider viewKind={'grid'} ObjClass={Payload} commands={[insertCommand, deleteCommand]}>
                <Grid />
            </ViewProvider>
        </Boundary>
    );
}
