import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { $cn } from '../../util/$cn';

export interface DuotoneIconProps {
    icon: IconDefinition;
    primary?: string;
    bg?: string;
    secondary?: string;
    primaryOpacity?: number;
    secondaryOpacity?: number;
    size?: SizeProp;
    className?: string;
    title?: string;
    noBlock?: boolean;
    border?: string;
    shadow?: string;
}
export function DuotoneIcon(props: DuotoneIconProps) {
    const { icon, bg, primary, className, size, secondary, primaryOpacity, secondaryOpacity, title, noBlock } = props;
    const style = useMemo(
        () => ({
            '--fa-primary-color': primary,
            '--fa-secondary-color': secondary,
            '--fa-primary-opacity': primaryOpacity ?? 1.0,
            '--fa-secondary-opacity': secondaryOpacity ?? 1.0
        }),
        [primary, primaryOpacity, secondary, secondaryOpacity]
    );
    const spread = $cn({ className }, {
        block: !(noBlock ?? false)
    }, 'block   ');
    return (
        <span title={title} {...spread}>
            <FontAwesomeIcon icon={icon} size={size} style={style as any} {...spread} />
        </span>
    );
}
