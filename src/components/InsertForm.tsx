import { useEffect, useMemo, useState } from 'react';
import { FormProvider } from './providers/FormProvider';
import { useUncontrolledForm } from '../hooks/useForm';
import { setReferenceField } from '../util/convertFormData';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useMetaDataContext } from './Toaster';
import { convertFromFormData } from './convertFromFormData';
import { determineGridSize } from './determineGridSize';
import { useChangeFileParent } from './useChangeFileParent';
import { useRealmMutation } from '../queries/useRealmMutation';
import { Mutation } from '../queries';
import { DefinedType, InsertFormControls } from '../data/definitions';
import { Spinner } from './Indicators/Spinner';
import { ignore } from '../common';

const createFileAlloc = ignore;
export function InsertForm<T extends Record<string, any>>({ Controls, initialData, convert, postInsert }: { Controls: DefinedType; initialData: T; convert: any; postInsert?: <T>(input: T) => void }) {
    console.group('InsertForm');
    const [collection] = useRoutedCollection();
    const realm = useLocalRealm();

    const [handleSubmit, register, onInput, isFeedbacking, getFeedback] = useUncontrolledForm(convert, { _id: new Realm.BSON.ObjectId(), ...initialData });
    // const insertQuery = useMemo(() => insertMutation<T>(realm!, collection), [collection, realm]);
    // const successToast = useToast('success');
    // const failureToast = useToast('failure');
    // const queryClient = useQueryClient();
    const [isLoading, moveFile] = useChangeFileParent();
    const newLocal = (record: Record<string, any> & Realm.Object): void => {
        if ('auctionId' in record) {
            const parent: any = createFileAlloc(realm, (record as any).auctionId, 'auctions', 'invoices');
            if (parent?.materializedPath?.length ?? 0 > 0) {
                moveFile(parent?.materializedPath ?? '', (record as any)._id.toHexString());
            }
        }
    };
    const [state, loading, execute] = useRealmMutation(Mutation.insert, postInsert ?? ignore);
    // const mutation = useMutation(insertQuery, {
    //     onSuccess: (record: T & Realm.Object) => {
    //         successToast('You have successfully inserted a record.', 'SUCCESS', (record as any)._id.toHexString());
    //         queryClient.invalidateQueries(['selectAll', collection]);
    //         queryClient.invalidateQueries(['dropdown', collection]);
    //         queryClient.refetchQueries(['selectAll', collection]);
    //         queryClient.refetchQueries(['dropdown', collection]);

    //     },
    //     onError: (error: any) => {
    //         failureToast(error.message, 'FAILURE', error.name);
    //     }
    // });
    const onSubmit = useMemo(
        () =>
            handleSubmit((x) => {
                execute(x);
                return undefined;
            }),
        [execute, handleSubmit]
    );

    console.groupEnd();
    return (
        <FormProvider register={register} isFeedbacking={isFeedbacking} getFeedback={getFeedback}>
            <form className='flex flex-col' onInput={onInput} onSubmit={onSubmit}>
                <section className='grid grid-cols-4'>
                    <InsertFormControls Definition={Controls} isFeedbacking={isFeedbacking} getFeedback={getFeedback} />
                </section>
                <footer className='flex flex-row justify-center w-full'>
                    {loading && <Spinner />}
                    {!loading && (
                        <input
                            type='submit'
                            className='inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105'
                        />
                    )}
                    <input
                        type='reset'
                        className='inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105'
                    />
                </footer>
            </form>
        </FormProvider>
    );
}
