import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export function Spinner() {
    return <FontAwesomeIcon size='6x' icon={faSpinner} className='text-red' />;
}
