import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';

export interface DuotoneIconProps {
    icon: IconDefinition;
    primary?: string;
    bg?: string;
    secondary?: string;
    primaryOpacity?: number;
    secondaryOpacity?: number;
    size?: SizeProp;
    className?: string;
}
export function DuotoneIcon(props: DuotoneIconProps) {
    const { icon, bg, primary, className, size, secondary, primaryOpacity, secondaryOpacity } = props;
    const style = useMemo(
        () => ({
            '--fa-primary-color': primary,
            '--fa-secondary-color': secondary,
            '--fa-primary-opacity': primaryOpacity ?? 1.0,
            '--fa-secondary-opacity': secondaryOpacity ?? 1.0
        }),
        [primary, primaryOpacity, secondary, secondaryOpacity]
    );
    return (
        <span className='w-full m-auto'>
            <FontAwesomeIcon icon={icon} size={size} style={style as any} className={`${bg} ${className} block p-0.5`} />
        </span>
    );
}
