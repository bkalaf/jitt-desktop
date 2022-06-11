import React, { useCallback, useState } from 'react';
import { usePreventDefault } from '../hooks/usePreventDefault';
import { ipcRenderer } from 'electron';
import * as path from 'path';

export function PhotoUpload() {
    const [stagedFiles, setStagedFiles] = useState<File[]>([]);
    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault();
        const files = ev.target.files;
        if (files === null)
            return;
        const result: File[] = [];
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            result.push(element);
        }
        setStagedFiles(result);
    }, []);
    const onClick = useCallback(() => {
        function inner(f: File[]) {
            if (f.length === 0)
                return;
            const [h, ...t] = f;
            console.log('sending', f);
            ipcRenderer.send('enqueue-photo-pipeline', path.dirname(h.path), path.basename(h.name), 'upload');
            inner(t);
        }
        inner(stagedFiles);
        setStagedFiles([]);
    }, [stagedFiles]);
    const onPrevent = usePreventDefault();
    const stagedFileCount = `Staged file count: ${stagedFiles.length ?? 0}`;
    return (
        <form className='items-center justify-center w-full h-full' onSubmit={onPrevent} onReset={onPrevent}>
            <div className='flex flex-col'>
                <label htmlFor='photo-upload' className='flex text-lg uppercase bold font-fira-sans'>
                    Photo Uploader
                </label>
                <input
                    type='file'
                    id='photo-upload'
                    className='flex file:font-semibold file:font-fira-sans file:text-lg file:border file:text-slate-dark file:border-blue file:rounded hover:file:shadow-inner hover:file:shadow-cyan'
                    multiple
                    onChange={onChange} />
                <span className='inline-flex'>{stagedFileCount}</span>
                <button
                    className='flex bg-black text-white py-0.5 px-2 font-fira-sans text-bold text-xl rounded-lg shadow-lg shadow-red border-white'
                    disabled={stagedFiles.length === 0}
                    onClick={onClick}
                    type='button'>
                    Upload
                </button>
            </div>
        </form>
    );
}
