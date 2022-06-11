import * as fs from 'graceful-fs';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { ObjectId } from 'bson';
import { ipcRenderer } from 'electron';
import * as path from 'path';

export function GalleryPhoto(props: { filename: string; }) {
    const realm = useLocalRealm();
    const [src, setSrc] = useState('');

    const data = fs.readFileSync(props.filename);
    useEffect(() => {
        const objectURL = URL.createObjectURL(new Blob([data.buffer]));
        setSrc(objectURL);
    }, [data.buffer]);

    const folder = path.dirname(props.filename);
    const filename = path.basename(props.filename);
    const onChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        const el = ev.target as HTMLSelectElement;
        const itemOID = ev.target.value;
        const item = realm.objectForPrimaryKey<IItem>('item', new ObjectId(itemOID));
        const bc = item?.barcode.barcode ?? '';
        ipcRenderer.send('enqueue-assigned-photo', folder, filename, 'assign', bc);
    }, [filename, folder, realm]);
    return (
        <div className='flex flex-col'>
            <img className='inline-flex' key={props.filename} src={src} alt={props.filename} />;
            <select className='flex w-full text-white border-black rounded-lg shadow-lg shadow-red' onChange={onChange}>
                <>
                    <option value='' label='Assign to item...' />,
                    {...realm
                        .objects<IItem>('item')
                        .sorted([
                            ['brand.name', false],
                            ['product.shortDescription', false]
                        ])
                        .map((x) => {
                            <option
                                key={x._id.toHexString()}
                                value={x._id.toHexString()}
                                label={[x.product.brand.name, x.product.shortDescription].join(': ')} />;
                        })}
                </>
            </select>
        </div>
    );
}
