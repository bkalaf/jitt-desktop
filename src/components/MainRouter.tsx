/* eslint-disable react/no-children-prop */
/* eslint-disable react/boolean-prop-naming */
import { Navigate, Route, Routes } from 'react-router-dom';
import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { $showFileTools } from './MainWindow';
import { InsertForm } from './InsertForm';
import { GridContainer } from './GridContainer';
import { LoginForm } from './forms/LoginForm';
import { ModalContainer } from './ModalContainer';
import { useLog } from './providers/buildLibrary';
import { DataOrModifiedFn, useAsyncResource } from 'use-async-resource';
import { ignore } from '../common';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useMutation } from 'react-query';
import { uploadFile } from '../queries/insertMutation';

export type RealmTypes =
    | 'objectId'
    | 'uuid'
    | 'string'
    | 'bool'
    | 'int'
    | 'double'
    | 'float'
    | 'decimal128'
    | 'object'
    | 'list'
    | 'dictionary'
    | 'set'
    | 'date'
    | 'data'
    | 'linkingObjects';

export function FilePreview({ resource, file }: { resource: () => Promise<ArrayBuffer>; file: File }) {
    const [reader, updateReader] = useAsyncResource(resource, []);
    return (
        <React.Suspense fallback='Loading Image'>
            <ImageLoader reader={reader} file={file} />
        </React.Suspense>
    );
}
export function ImageLoader({ reader, file }: { reader: DataOrModifiedFn<ArrayBuffer>; file: File }) {
    const log = useLog();
    const data = reader();
    log(data);
    const [objectURL, setObjectURL] = useState<string | undefined>(undefined);
    log(objectURL);

    useEffect(() => {
        if (objectURL == null) {
            const r = new FileReader();
            r.addEventListener('loadend', (ev) => {
                console.log(ev);
                setObjectURL(r.result as string);
            });
            r.readAsDataURL(file);
        }
        return () => (objectURL == null ? ignore() : URL.revokeObjectURL(objectURL));
    }, [file, objectURL]);
    return file.type === 'application/pdf' ? <iframe src={objectURL} className='block w-full' /> : <img src={objectURL} className='block w-full'></img>;
}
export function UploadFile() {
    const log = useLog();
    const realm = useLocalRealm();
    const [previews, setPreviews] = useState<File[]>([]);
    const onChange = useCallback(
        async (ev: React.ChangeEvent<HTMLInputElement>) => {
            const files = ev.target.files;
            if (files == null) throw new Error();
            const p: File[] = [];
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                log(file);
                const { name, type, size, lastModified, path } = file;
                p.push(file);
            }
            setPreviews(p);
        },
        [log]
    );
    const mutation = useMutation(uploadFile(realm), { onSuccess: () => setPreviews([]) });

    const [isLoading, startTransition] = useTransition();
    const onClick = useCallback(() => startTransition(() => mutation.mutate(previews)), [mutation, previews]);
    return (
        <section className='flex flex-col w-full'>
            <input
                type='file'
                name='incoming'
                className='flex file:font-semibold file:font-fira-sans file:text-lg file:border file:text-slate-dark file:border-blue file:rounded hover:file:shadow-inner hover:file:shadow-cyan'
                multiple
                onChange={onChange}
            />
            <div className='grid grid-cols-4'>
                {previews.map((x, ix) => (
                    <FilePreview resource={() => x.arrayBuffer()} file={x} key={ix} />
                ))}
            </div>
            <div className='flex items-center justify-center'>
                <button className='inline-flex px-3 py-1 text-lg font-bold text-white border-black rounded-lg font-fira-sans bg-blue' onClick={onClick}>
                    Submit
                </button>
            </div>
            {isLoading && <div className='flex'>Saving...</div>}
        </section>
    );
}

export function FileTools({ children }: { children: Children }) {
    useEffect(() => {
        $showFileTools(true);
        return () => {
            $showFileTools(false);
        };
    }, []);
    return <>{children}</>;
}
export function MainRouter() {
    return (
        <Routes>
            <Route path='/'>
                <Route
                    path='login'
                    element={
                        <ModalContainer>
                            <LoginForm />
                        </ModalContainer>
                    }
                />

                <Route path='fs'>
                    <Route path='v1'>
                        <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <ModalContainer>
                                            <UploadFile />
                                        </ModalContainer>
                                    }
                                />
                            </Route>
                            <Route
                                index
                                element={
                                    <FileTools>
                                        <GridContainer />
                                    </FileTools>
                                }
                            />
                        </Route>
                    </Route>
                    <Route index element={<Navigate to='v1' />} />
                </Route>
                <Route path='data'>
                    <Route path='v1'>
                        <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <ModalContainer>
                                            <InsertForm />
                                        </ModalContainer>
                                    }
                                />
                            </Route>
                            <Route path=':id'>
                                <Route index element={<></>} />
                            </Route>
                            <Route index element={<GridContainer />} />
                        </Route>

                        {/* <Route path=':collection'>
                            <Route path='new'>
                                <Route
                                    index
                                    element={
                                        <React.Suspense fallback={<Spinner />}>
                                            <Modal>
                                                <InsertForm collectionName='' />
                                            </Modal>
                                        </React.Suspense>
                                    }
                                />
                            </Route>
                            <Route path=':id'>
                                <Route index element={<></>} />
                            </Route>
                            <Route
                                index
                                element={
                                    <React.Suspense fallback={<Spinner />}>
                                        <Grid />
                                    </React.Suspense>
                                }
                            />
                        </Route> */}
                    </Route>
                    <Route index element={<Navigate to='v1' />} />
                </Route>
            </Route>
        </Routes>
    );
}
