import { useCallback, useTransition } from 'react';
import { APP_CONFIG } from '../config';
import { useMutation, useQueryClient } from 'react-query';
import { updateFile } from '../queries/insertMutation';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { FileAlloc, mongo } from '../data';
import { useSelected } from '../hooks/useSelected';
import { isNotNil } from '../common/isNotNull';
import { moveFile } from "./moveFile";


export function useChangeFileParent(): [boolean, (parent: string, id?: string) => void] {
    const realm = useLocalRealm();
    const selected = useSelected();
    const queryClient = useQueryClient();
    const mutation = useMutation(updateFile(realm, mongo.fsAlloc), {
        onSuccess: ([src, dest]: [string, string]) => {
            queryClient.invalidateQueries(['selectAll', mongo.fsAlloc]);
            queryClient.invalidateQueries(['dropdown', mongo.fsAlloc]);
            queryClient.refetchQueries(['selectAll', mongo.fsAlloc]);
            queryClient.refetchQueries(['dropdown', mongo.fsAlloc]);
            moveFile([APP_CONFIG.fs.path, src].join(''), [APP_CONFIG.fs.path, dest].join(''));
        }
    });
    const [isLoading, startTransition] = useTransition();
    const onClick = useCallback(
        (matPath: string, id?: string) => {
            const parent = realm.objects<FileAlloc>(mongo.fsAlloc).filtered(`materializedPath == '${matPath}'`)[0];
            const current = realm.objectForPrimaryKey<FileAlloc>(mongo.fsAlloc, new Realm.BSON.ObjectId(selected[0]));
            startTransition(() => mutation.mutate({
                id: isNotNil(selected[0]) ? selected[0] : id!,
                data: { parent, materializedPath: [parent.materializedPath, current?.name].join('/') }
            })
            );
        },
        [mutation, realm, selected]
    );
    return [isLoading, onClick];
}
