import { useCallback, useTransition } from 'react';
import { APP_CONFIG } from '../config';
import { useMutation, useQueryClient } from 'react-query';
import { updateFile } from '../queries/insertMutation';
import useLocalRealm from '../hooks/useLocalRealm';
import { Files } from '../data';
import { useSelected } from '../hooks/useSelected';
import { isNotNil } from '../common/isNotNull';
import { moveFile } from "./moveFile";
import { $ } from '../data/$';

export function useChangeFileParent(): [boolean, (parent: string, id?: string) => void] {
    const realm = useLocalRealm();
    const selected = useSelected();
    const queryClient = useQueryClient();
    const mutation = useMutation(updateFile(realm, $.fsAlloc), {
        onSuccess: ([src, dest]: [string, string]) => {
            queryClient.invalidateQueries(['selectAll', $.fsAlloc]);
            queryClient.invalidateQueries(['dropdown', $.fsAlloc]);
            queryClient.refetchQueries(['selectAll', $.fsAlloc]);
            queryClient.refetchQueries(['dropdown', $.fsAlloc]);
            moveFile([APP_CONFIG.fs.path, src].join(''), [APP_CONFIG.fs.path, dest].join(''));
        }
    });
    const [isLoading, startTransition] = useTransition();
    const onClick = useCallback(
        (matPath: string, id?: string) => {
            const parent: any = realm.objects<Files.FileAlloc>($.fsAlloc).filtered(`materializedPath == '${matPath}'`)[0];
            const current: any = realm.objectForPrimaryKey<Files.FileAlloc>($.fsAlloc, new Realm.BSON.ObjectId(selected[0]));
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
