import * as fs from 'graceful-fs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { ObjectId } from 'bson';
import { ipcRenderer } from 'electron';
import * as path from 'path';
import { photoRoot } from '../../msgqueue/photoRoot';
import { UseMutationResult } from 'react-query';
import { Menu } from '@electron/remote';

const galleryContextMenu = (mutation: any) =>
    Menu.buildFromTemplate([
        {
            type: 'normal',
            label: 'Delete photo',
            toolTip: 'This is an unrecoverable operation.',
            click: function (menuItem: any, window: any, event: KeyboardEvent) {
                console.log('MENU CLICKED');
                mutation();
            }
        }
    ] as any);

export function GalleryPhoto({ deleteMutation, filename }: { deleteMutation: UseMutationResult<any, unknown, string, unknown>; filename: string }) {
    const realm = useLocalRealm();
    const [src, setSrc] = useState('');

    const updateSrc = useCallback((value: string | undefined) => {
        setSrc((prev) => {
            if (value == null && prev != null) {
                URL.revokeObjectURL(prev);
                return '';
            }
            if (value != null && value !== prev) return value;
            return prev;
        });
    }, []);
    const buffer = useMemo(() => fs.readFileSync(filename).buffer, [filename]);
    useEffect(() => {
        const objectURL = URL.createObjectURL(new Blob([buffer]));
        setSrc(objectURL);  
        return () => updateSrc(undefined);
    }, [buffer, updateSrc]);

    const folderPart = path.dirname([photoRoot, filename].join('/'));
    const namePart = path.basename([photoRoot, filename].join('/'));
    const onChange = useCallback(
        (ev: React.ChangeEvent<HTMLSelectElement>) => {
            const el = ev.target as HTMLSelectElement;
            const itemOID = ev.target.value;
            const item = realm.objectForPrimaryKey<IItem>('item', new ObjectId(itemOID));
            const bc = item?.sku.barcode ?? '';
            ipcRenderer.send('enqueue-assigned-photo', folderPart, namePart, 'assign', bc);
        },
        [namePart, folderPart, realm]
    );

    const onContextMenu = useCallback(
        (ev: React.MouseEvent) => {
            galleryContextMenu(() => deleteMutation.mutate(filename)).popup();
        },
        [deleteMutation, filename]
    );
    return (
        <div className='flex flex-col' data-filename={[folderPart, namePart].join('/')}>
            <img
                className='block object-fill'
                key={filename}
                src={src}
                alt={filename}
                data-filename={[folderPart, namePart].join('/')}
                onContextMenu={onContextMenu}
            />
            ;
            <select className='flex w-full text-white border-black rounded-lg shadow-lg shadow-red' onChange={onChange}>
                <>
                    <option value='' label='Assign to item...' />,
                    {...realm.objects<IItem>('item').map((x) => {
                        <option key={x._id.toHexString()} value={x._id.toHexString()} label={[x.product.brand?.name, x.product.shortDescription].join(': ')} />;
                    })}
                </>
            </select>
        </div>
    );
}
