import React from 'react';
import { faBackwardStep, faBackwardFast, faSlashForward, faForwardFast, faForwardStep } from '@fortawesome/pro-duotone-svg-icons';
import { ButtonGroup } from '../components/ButtonGroup';
import { DuotoneIcon } from '../components/icons/DuotoneIcon';
import { getDigitIconDefintion } from '../components/useGrid';
import { PaginationButton } from './PaginationButton';
import { useConst } from './useConst';

export type IPaginationControlProps = {
    canGoPrevious: () => boolean;
    canGoNext: () => boolean;
    previousPage: () => void;
    nextPage: () => void;
    currentPage: number;
    maxPage: number;
    firstPage: () => void;
    lastPage: () => void;
    pageStats: Array<{ page: number; start: number; end: number }>;
};

export function PaginationControls({ previousPage, canGoPrevious, firstPage, lastPage, canGoNext, nextPage, maxPage, pageStats, currentPage }: IPaginationControlProps) {
    const konstTrue = useConst(true);
    return (
        <div className='flex items-center justify-center w-full'>
            <ButtonGroup className='flex p-1 space-x-0.5'>
                <PaginationButton icon={faBackwardStep} onClick={previousPage} title='Go to the previous page.' canExecute={canGoPrevious} />
                <PaginationButton icon={faBackwardFast} onClick={firstPage} title='Go to the first page.' canExecute={konstTrue} />

                <span className='flex flex-row items-center border rounded-lg text-row white flex-px-1 bg-zinc-dark/50 group space-x-0.5'>
                    {currentPage
                        .toString()
                        .padStart(Object.entries(pageStats).length.toString().length, '0')
                        .split('')
                        .map(getDigitIconDefintion)
                        .map((icon, ix) => {
                            return (
                                <DuotoneIcon
                                    key={ix}
                                    size='2x'
                                    primary='deeppink'
                                    secondary='black'
                                    secondaryOpacity={0.9}
                                    icon={icon}
                                    className='flex'
                                    noBlock />
                            );
                        })}
                    <DuotoneIcon
                        size='lg'
                        primary='red'
                        secondary='white'
                        secondaryOpacity={0.9}
                        icon={faSlashForward}
                        title='of'
                        className='hidden hover:flex group-hover:flex'
                        noBlock />
                    {Object.entries(pageStats)
                        .length.toString()
                        .split('')
                        .map(getDigitIconDefintion)
                        .map((icon, ix) => {
                            return (
                                <DuotoneIcon
                                    key={ix}
                                    size='2x'
                                    primary='white'
                                    secondary='springgreen'
                                    secondaryOpacity={0.9}
                                    icon={icon}
                                    title={`Page #${currentPage} of ${maxPage}`}
                                    className='hidden hover:flex group-hover:flex'
                                    noBlock />
                            );
                        })}
                </span>
                <PaginationButton icon={faForwardFast} onClick={lastPage} canExecute={konstTrue} title='Go to the last page.' />
                <PaginationButton icon={faForwardStep} onClick={nextPage} canExecute={canGoNext} title='Go to the next page.' />
            </ButtonGroup>
        </div>
    );
}
