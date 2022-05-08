import { faWindowClose } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneElement } from 'react';
import { useOverlay } from './providers/OverlayProvider';

export function Overlay() {
    const { contents, popOverlay, props } = useOverlay();
    return (
        <div {...props}>
            <div className='container relative flex items-center justify-center p-5 text-white border rounded-lg shadow-lg pointer-events-auto bg-black/80 border-blue shadow-black'>
                <button
                    type='button'
                    className='absolute top-0 right-0 mt-2 mr-3 text-white bg-transparent border border-white rounded-lg'
                    onClick={popOverlay}
                    title='Close Window'>
                    <FontAwesomeIcon size='lg' icon={faWindowClose} />
                </button>
                {contents.map((x, ix) => cloneElement(x, { ...x.props, key: ix }))}
            </div>
        </div>
    );
}
