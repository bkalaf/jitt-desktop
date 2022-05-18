import { QueryClient } from 'react-query';
import { fromKebabToCamelCase, identity } from '../common';
import { useMetaDataContext } from '../components/Toaster';
import { deleteById, deleteSelected } from './deleteById';
import { dropdown } from './dropdown';
import { insertMutation, uploadFile } from './insertMutation';
import { selectFromCollection } from './selectFromCollection';

export const Queries = {
    deleteById,
    dropdown,
    insert: insertMutation,
    fetchAll: selectFromCollection,
    uploadFile
};
export const $queryKey = {
    selectAll: (collection: string): [string, string] => ['selectAll', collection],
    dropdown: (collection: string): [string, string] => ['dropdown', collection]
};
export const Query = {
    fetchAll: selectFromCollection,
    dropdown: dropdown
};
export const Mutation = {
    deleteById: deleteById,
    deleteSelected: deleteSelected,
    insert: insertMutation,
    upload: uploadFile
};

export function invalidateRefetch(queryClient: QueryClient) {
    return function (key: string, collection: string) {
        queryClient.invalidateQueries([key, collection]);
        queryClient.refetchQueries([key, collection]);
    };
}

export type MutationState = 'paused' | 'success' | 'error' | 'idle' | 'loading';
export type QueryStatus = 'loading' | 'idle' | 'error' | 'success';

