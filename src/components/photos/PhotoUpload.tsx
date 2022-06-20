import React, { useCallback, useState } from 'react';
import { usePreventDefault } from '../../hooks/usePreventDefault';
import { ipcRenderer } from 'electron';
import * as path from 'path';
import { useMutation } from 'react-query';
import { useNavigateDown } from '../../hooks/useNavigateDown.1';

export function PhotoUpload() {
    const navDown = useNavigateDown();
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault();
        const files = ev.target.files;
        if (files === null) return;
        const result: File[] = [];
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            result.push(element);
        }
        setStagedFiles(result);
    }, []);
    function inner(f: File[]): Promise<void> {
        if (f.length === 0) return Promise.resolve();
        const [h, ...t] = f;
        console.log('sending', f);
        ipcRenderer.send('enqueue-photo-pipeline', path.dirname(h.path), path.basename(h.name), 'upload');
        return inner(t);
    }
    const mutation = useMutation((f: File[]) => {
        return inner(f).then(() => setStagedFiles([]));
    });
    const onClick = useCallback(() => {
        mutation.mutate(stagedFiles, { onSuccess: () => {
            navDown();
        }});
    }, [mutation, navDown, stagedFiles]);
    const onPrevent = usePreventDefault();
    const stagedFileCount = `Staged file count: ${stagedFiles.length ?? 0}`;
    return (
        <form className='items-center justify-center w-1/3 h-full' onSubmit={onPrevent} onReset={onPrevent}>
            <div className='flex flex-col items-center justify-center w-full'>
                <label htmlFor='photo-upload' className='flex text-lg uppercase bold font-fira-sans'>
                    Photo Uploader
                </label>
                <input
                    type='file'
                    id='photo-upload'
                    className='flex file:font-semibold file:font-fira-sans file:text-lg file:border file:text-slate-dark file:border-blue file:rounded hover:file:shadow-inner hover:file:shadow-cyan'
                    multiple
                    onChange={onChange}
                />
                <span className='inline-flex'>{stagedFileCount}</span>
                <button
                    className='flex bg-blue-dark text-white py-0.5 px-2 font-fira-sans text-center text-bold text-xl rounded-lg shadow-lg shadow-red border-white hover:bg-amber hover:text-black'
                    disabled={stagedFiles.length === 0}
                    onClick={onClick}
                    type='button'>
                    Upload
                </button>
            </div>
        </form>
    );
}
