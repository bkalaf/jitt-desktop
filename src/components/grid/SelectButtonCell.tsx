import { faSquare, faSquareDashed } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { $cn } from '../../util/$cn';
import React from 'react';

export function SelectButtonCell(props: {
    oid: string;
    isSelected: (oid: string) => boolean;
    onClick: (ev: React.MouseEvent<HTMLElement>) => void;
    title: string;
}) {
    const { oid, isSelected, ...remain } = props;
    const spread = $cn(
        remain,
        {
            'text-red shadow-lg shadow-red': isSelected(oid),
            'text-red-light/50': !isSelected(oid)
        },
        'block bg-black text-white p-0.5 border border-white text-center'
    );
    return (
        <button {...spread}>
            <FontAwesomeIcon icon={isSelected(oid) ? faSquare : faSquareDashed} size='lg' />
        </button>
    );
}
