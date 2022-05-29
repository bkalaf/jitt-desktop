import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { DuotoneButton } from '../components/providers/DuotoneBtn';

export type IPaginationButtonProps = {
    icon: IconDefinition;
    onClick: () => void;
    title: string;
    canExecute: () => boolean;
};
export function PaginationButton({ canExecute, icon, onClick, title }: IPaginationButtonProps) {
    return (
        <DuotoneButton
            icon={icon}
            size='2x'
            primary='springgreen'
            secondary='darkslategray'
            bg='bg-slate-very-dark'
            border='border-lime'
            shadow='shadow-yellow'
            className='block w-8 h-8'
            onClick={onClick}
            disabled={!canExecute()}
            title={title}
        />
    );
}
