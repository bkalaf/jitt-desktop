import React, { useCallback, useEffect, useMemo } from 'react';
import { useSchema } from '../hooks/useSchema';
import { FormProvider } from './providers/FormProvider';
import { useForm } from '../hooks/useForm';
import { IPropertyInfo } from './providers/SchemaProvider';
import { useMutation, useQueryClient } from 'react-query';
import { useRealm } from '../hooks/useRealm';
import { useToast } from '../hooks/useToast';
import { snd } from '../common/tuple/snd';
import { convertFormData, setReferenceField } from '../util/convertFormData';
import { insertMutation } from '../queries/insertMutation';
import { Property } from './forms/Property';
import { useDAL } from '../hooks/useDAL';

export function InsertForm<T extends Record<string, any>>(props: { collectionName: string }) {
    console.group('InsertForm');
    const { collectionName } = props;
    if (collectionName == null) throw new Error('no collectionName');
    const { getObjectClass, getProperty, getControls } = useSchema();
    const realm = useRealm();
    console.log('collectionName', collectionName);
    const oc = getObjectClass<T>(collectionName)!;
    console.log('oc', oc);
    const { getFieldFromType } = useDAL(collectionName);

    const convert = useMemo(() => convertFormData<T>(oc!, getFieldFromType!, collectionName), [collectionName, getFieldFromType, oc]);
    const [handleSubmit, register, formRef, onInput] = useForm<T, undefined>(convert, oc);
    const insertQuery = useMemo(() => insertMutation<T>(realm!, collectionName), [collectionName, realm]);
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const queryClient = useQueryClient();
    const mutation = useMutation(insertQuery, {
        onSuccess: (record: T & Realm.Object) => {
            successToast('You have successfully inserted a record.', 'SUCCESS', (record as any)._id.toHexString());
            queryClient.invalidateQueries(['selectAll', collectionName]);
            queryClient.invalidateQueries(['dropdown', collectionName]);
            queryClient.refetchQueries(['selectAll', collectionName]);
            queryClient.refetchQueries(['dropdown', collectionName]);
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
    const { insertControls: controls } = useDAL(collectionName);
    const Controls = useMemo(() => controls, [controls]);
    console.groupEnd();
    return (
        <FormProvider register={register}>
            <form ref={formRef} className='grid grid-cols-4' onInput={onInput} onSubmit={onSubmit}>
                <section>
                    <Controls />
                </section>
                <footer>
                    <input
                        type='submit'
                        className='inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105'
                    />
                </footer>
            </form>
        </FormProvider>
    );
}
