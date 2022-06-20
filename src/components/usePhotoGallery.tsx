import * as fs from 'graceful-fs';
import { photoRoot } from '../msgqueue/photoRoot';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { useLog } from '../hooks/useLog';
import { useToast } from '../hooks/useToast';


export function usePhotoGallery(): [data: string[] | undefined, mutation: UseMutationResult<any, unknown, string, unknown>] {
    const log = useLog();
    const queryClient = useQueryClient();
    const errorToast = useToast('error');
    const successToast = useToast('success');
    const { data } = useQuery(
        ['photo', undefined],
        () => {
            return fs.readdirSync(photoRoot).map((x) => [photoRoot, x].join('/'));
        },
        {
            suspense: true,
            onError: (err: any) => {
                log(err);
                errorToast(err.message, 'ERROR!', err.name);
            }
        }
    );
    const mutation = useMutation(
        (fn: string) => {
            return fs.promises.unlink(fn);
        },
        {
            onSuccess: (data: any, variables) => {
                queryClient.invalidateQueries(['photo']);
                queryClient.refetchQueries(['photo']);
                successToast(`File was successfully deleted.`, variables, 'DELETE SUCCESS!');
            }
        }
    );
    return [data, mutation];
}
