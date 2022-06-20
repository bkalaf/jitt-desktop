import * as fs from 'graceful-fs';
import React from 'react';
import { photoRoot } from '../../msgqueue/photoRoot';
import { checkDirectory } from '../../common/fs/checkDirectory';
import { GalleryPhoto } from './GalleryPhoto';
import { usePhotoGallery } from "../usePhotoGallery";

export function PhotoGrid() {
    checkDirectory(photoRoot);
    const [ dirContents, deleteMutation ] = usePhotoGallery();
    return (
        <div className='grid w-full h-full grid-cols-8'>
            {(dirContents ?? []).map((fn) => {
                return <GalleryPhoto deleteMutation={deleteMutation} key={fn} filename={fn} />;
            })}
        </div>
    );
}
