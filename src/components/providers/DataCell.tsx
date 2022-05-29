import { useCallback, useEffect, useRef, useState } from 'react';
import { ignore } from '../../common/ignore';
import { IconDefinition, faWindowClose } from '@fortawesome/pro-duotone-svg-icons';
import { TableCell } from '../Table/Cell';
import { DuotoneButton } from './DuotoneBtn';
import { useToggle } from '../../hooks/useToggle';
import { ModalContainer } from '../ModalContainer';
import { MimeTypes } from '../../data/enums/mimeTypes';


export function DataCell({ result, icon, x, mimeType }: { result: ArrayBuffer; icon: IconDefinition; x: string; mimeType: MimeTypes; }) {
    const [showImage, toggleImage] = useToggle(false);
    const [src, setSrc] = useState<undefined | string>(undefined);
    const reader = useRef(new FileReader());
    const cb = useCallback((ev: ProgressEvent<FileReader>) => setSrc(ev.target!.result as string), []);
    useEffect(() => {
        const r = reader.current;
        r.addEventListener('loadend', cb);
        return () => r.removeEventListener('loadend', cb);
    }, [cb]);
    useEffect(() => {
        if (src == null && reader.current.readyState === reader.current.EMPTY) {
            reader.current.readAsDataURL(new Blob([result], { type: 'application/pdf' }));
        }
        return () => (src != null ? URL.revokeObjectURL(src) : ignore());
    }, [result, src]);
    return (
        <TableCell key={x}>
            <DuotoneButton icon={icon} primary='red' secondary='black' size='lg' onClick={toggleImage} />
            {showImage && (
                <ModalContainer>
                    <div className='relative flex items-center justify-center w-full h-full p-4 '>
                        <DuotoneButton
                            primary='white'
                            secondary='cyan'
                            icon={faWindowClose}
                            size='2x'
                            className='absolute top-0 right-0 mt-2 mr-2'
                            onClick={toggleImage}></DuotoneButton>
                        {mimeType === 'pdf' ? (
                            <iframe src={`${src}#zoom-75`} className='flex object-scale-down w-full h-full' />
                        ) : (
                            <img src={src} className='flex object-scale-down w-full h-full' />
                        )}
                    </div>
                </ModalContainer>
            )}
        </TableCell>
    );
}
