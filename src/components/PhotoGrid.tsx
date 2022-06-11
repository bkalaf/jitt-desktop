import * as fs from 'graceful-fs';
import React from 'react';
import { photoRoot } from '../msgqueue/photoRoot';
import { checkDirectory } from '../common/fs/checkDirectory';
import { GalleryPhoto } from './GalleryPhoto';

export function PhotoGrid() {
    checkDirectory(photoRoot);
    const dirContents = fs.readdirSync(photoRoot);
    return (
        <div className='grid w-full h-full grid-cols-8'>
            {dirContents.map((fn) => {
                return <GalleryPhoto key={fn} filename={fn} />;
            })}
        </div>
    );
}
