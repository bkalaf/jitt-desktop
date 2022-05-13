import { useMemo } from 'react';
import { FormProvider } from './providers/FormProvider';
import { useForm } from '../hooks/useForm';
import { useMutation, useQueryClient } from 'react-query';
import { useToast } from '../hooks/useToast';
import { setReferenceField } from '../util/convertFormData';
import { insertMutation } from '../queries/insertMutation';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useMetaDataContext } from './Toaster';
import { convertFromFormData } from './convertFromFormData';
import { determineGridSize } from './determineGridSize';

export function InsertForm<T extends Record<string, any>>() {
    console.group('InsertForm');
    const [collection] = useRoutedCollection();
    const realm = useLocalRealm();
    const { getFormPayload, getInputControls, getInfoFor, getType } = useMetaDataContext();
    const Controls = useMemo(() => getInputControls(collection), [collection, getInputControls]);
    const Payload = useMemo(() => getFormPayload(collection), [collection, getFormPayload]);
    const convert = useMemo(() => convertFromFormData(Payload as any, getInfoFor, collection, realm), [Payload, collection, getInfoFor, realm]);
    const [handleSubmit, register, formRef, onInput] = useForm<T, undefined>(convert, Payload as any);
    const insertQuery = useMemo(() => insertMutation<T>(realm!, collection), [collection, realm]);
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const queryClient = useQueryClient();
    const mutation = useMutation(insertQuery, {
        onSuccess: (record: T & Realm.Object) => {
            successToast('You have successfully inserted a record.', 'SUCCESS', (record as any)._id.toHexString());
            queryClient.invalidateQueries(['selectAll', collection]);
            queryClient.invalidateQueries(['dropdown', collection]);
            queryClient.refetchQueries(['selectAll', collection]);
            queryClient.refetchQueries(['dropdown', collection]);
        },
        onError: (error: any) => {
            failureToast(error.message, 'FAILURE', error.name);
        }
    });
    const onSubmit = useMemo(
        () =>
            handleSubmit((x) => {
                console.log('handleSubmit', 'x', x);
                setReferenceField('_id')(x)(new Realm.BSON.ObjectId());
                mutation.mutate(x);
                return Promise.resolve(undefined);
            }),
        [handleSubmit, mutation]
    );
    console.groupEnd();
    return (
        <FormProvider register={register}>
            <form ref={formRef} className='flex flex-col' onInput={onInput} onSubmit={onSubmit}>
                <section className={determineGridSize(getType(collection).flatColumns.length)[0]}>
                    <Controls />
                </section>
                <footer className='flex justify-center w-full'>
                    <input
                        type='submit'
                        className='inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105'
                    />
                </footer>
            </form>
        </FormProvider>
    );
}
