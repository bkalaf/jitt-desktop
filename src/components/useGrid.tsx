import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { createFrom, rangeBetween, toTitleCase } from '../common';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { toOutput } from './providers/DataTypeInfo';
import { useMetaDataContext } from './Toaster';
import { useViewContext } from '../hooks/useViewContext';
import { ButtonGroup } from './ButtonGroup';
import { DuotoneButton } from './providers/DuotoneBtn';
import {
    faBackwardFast,
    faBackwardStep,
    faEmptySet,
    faForwardFast,
    faForwardStep,
    faSlashForward,
    faSquare0,
    faSquare1,
    faSquare2,
    faSquare3,
    faSquare4,
    faSquare5,
    faSquare6,
    faSquare7,
    faSquare8,
    faSquare9,
    IconDefinition
} from '@fortawesome/pro-duotone-svg-icons';
import { DuotoneIcon } from './icons/DuotoneIcon';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { $cn } from '../util/$cn';

export function getPageIndexes(length: number, perPage = 50) {
    const maxPage = Math.ceil(length / perPage);
    const startIndexes = rangeBetween(0, maxPage - 1).map((x) => x * perPage);
    const endIndexes = startIndexes.map((x) => (x + perPage - 1 > length - 1 ? length - 1 : x + perPage - 1));
    // console.log(maxPage);
    // console.log(startIndexes);
    // console.log(endIndexes);
    return Object.fromEntries(
        rangeBetween(0, maxPage - 1).map((x) => [x + 1, { start: startIndexes[x], end: endIndexes[x] }] as [number, { start: number; end: number }])
    );
}

export function getDigitIconDefintion(num: string): IconDefinition {
    switch (num) {
        case '0':
            return faSquare0;
        case '1':
            return faSquare1;
        case '2':
            return faSquare2;
        case '3':
            return faSquare3;
        case '4':
            return faSquare4;
        case '5':
            return faSquare5;
        case '6':
            return faSquare6;
        case '7':
            return faSquare7;
        case '8':
            return faSquare8;
        case '9':
            return faSquare9;

        default:
            throw new Error(`Non-digit: ${num}`);
    }
}
export function parseNumberToIconDefinitionArray(num: string, len = 1) {
    const n = num.padStart(len, '0');
    if (n.length === 0) return [faEmptySet];
    if (n.length === 1) return [getDigitIconDefintion(n)];
    return n.split('').map(getDigitIconDefintion);
}
export type PageIconState = 'flip-in' | 'not-animated' | 'flip-out' | 'hidden';

// export function NumberIconGroup({
//     pageNumber,
//     size,
//     primary,
//     secondary,
//     len
// }: {
//     pageNumber: string;
//     size: SizeProp;
//     primary: string;
//     secondary: string;
//     len: number;
// }): JSX.Element {
//     const [iconState, setIconState] = useState<PageIconState>('flip-in');
//     const [[page, iconDefs], setIconDefs] = useState<[string, IconDefinition[][]]>([pageNumber.padStart(len, '0'), [[faEmptySet]]] as [
//         string,
//         IconDefinition[][]
//     ]);

//     useEffect(() => {
//         if (page !== pageNumber) {
//             const arr = [...iconDefs, parseNumberToIconDefinitionArray(pageNumber, len)];
//             setIconDefs([pageNumber, arr]);
//             setIconState('flip-out');
//         }
//     }, [iconDefs, len, page, pageNumber]);

//     const onAnimationEnd = useCallback(() => {
//         setIconState((prev) => {
//             if (prev === 'flip-in') return 'not-animated';
//             if (prev === 'flip-out') {
//                 const [head, ...tail] = iconDefs;
//                 setIconDefs();
//                 pendingIconDefs.current = undefined;
//                 return 'flip-out';
//             }
//             return prev;
//         });
//     }, []);

//     return (
//         <span className='flex space-x-1 transition duration-1000 ease-in-out'>
//             {rangeBetween(0, len - 1).map((index) => {
//                 return (
//                     <IndividualDigitIcon
//                         key={index}
//                         size={size}
//                         primary={primary}
//                         secondary={secondary}
//                         iconState={iconState}
//                         len={len}
//                         index={index}
//                         onAnimationEnd={onAnimationEnd}
//                         defArray={iconDefs}
//                     />
//                 );
//             })}
//         </span>
//     );
// }

export function IndividualDigitIcon({
    size,
    primary,
    secondary,
    iconState,
    len,
    index,
    onAnimationEnd,
    defArray
}: {
    iconState: PageIconState;
    len: number;
    index: number;
    onAnimationEnd: () => void;
    size: SizeProp;
    primary: string;
    secondary: string;
    defArray: IconDefinition[];
}) {
    const { className } = $cn(
        {},
        {
            zoomIn: iconState === 'flip-in',
            zoomOut: iconState === 'flip-out',
            ['delay-500']: len >= 1 && index === 0,
            ['delay-1000']: len >= 2 && index === 1,
            ['delay-[1500ms]']: len >= 3 && index === 2,
            ['delay-[2000ms]']: len >= 4 && index === 3
        },
        'flex transition duration-1000 ease-in-out border border-black'
    );
    const icon = useMemo(() => defArray[index], [defArray, index]);

    return (
        <div className={className} onAnimationEnd={onAnimationEnd}>
            <DuotoneIcon size={size} primary={primary} secondary={secondary} icon={icon} className='flex' />
        </div>
    );
}
// export function PageIcon({ page, size, primary, secondary }: { page: number; size: SizeProp; primary: string; secondary: string }) {
//     const [iconState, setIconState] = useState<PageIconState>('flip-in');
//     return NumberIcon(page.toString(), size, primary, secondary, iconState);
// }
export function useGrid<T extends { _id: Realm.BSON.ObjectId }>(resultsPerPage = 50) {
    return useCallback(function InnerGrid() {
        const [collection] = useRoutedCollection(true);
        const metadata = useMetaDataContext();
        const Headers = metadata.getHeaders(collection);
        const ColGroup = metadata.getColGroup(collection);
        const Row = metadata.getRowComponent(collection);
        useWhyDidYou(InnerGrid.name, {});
        const { data } = useViewContext() as any as { data: Realm.Results<T> };
        const pageStats = useMemo(() => getPageIndexes(data.length, resultsPerPage ?? 50), [data]);
        const [page, setPage] = useState(1);
        const firstPage = useCallback(() => {
            setPage(1);
        }, []);
        const lastPage = useCallback(() => {
            setPage(Object.entries(pageStats).length);
        }, [pageStats]);
        const prevPage = useCallback(() => {
            setPage((prev) => {
                if (prev === 1) return 1;
                return prev - 1;
            });
        }, []);
        const nextPage = useCallback(() => {
            setPage((prev) => {
                if (prev === Object.entries(pageStats).length) return prev;
                return prev + 1;
            });
        }, [pageStats]);
        const window = useMemo(() => [...data.slice(pageStats[page.toString()].start, pageStats[page.toString()].end + 1)], [data, page, pageStats]);

        return (
            <section className='flex flex-col w-full'>
                <header className='flex justify-center w-full'>
                    <ButtonGroup className='flex p-1 space-x-0.5'>
                        <DuotoneButton
                            icon={faBackwardStep}
                            size='lg'
                            primary='springgreen'
                            secondary='darkslategray'
                            bg='bg-slate-very-dark'
                            border='border-lime'
                            shadow='shadow-yellow'
                            className='inline-flex'
                            onClick={prevPage}
                            title='Go to the previous page.'></DuotoneButton>
                        <DuotoneButton
                            icon={faBackwardFast}
                            size='lg'
                            primary='springgreen'
                            secondary='darkslategray'
                            bg='bg-slate-very-dark'
                            border='border-lime'
                            shadow='shadow-yellow'
                            className='inline-flex'
                            onClick={firstPage}
                            title='Go to the first page'></DuotoneButton>
                        <span className='flex flex-row items-center border rounded-lg text-row white flex-px-1 bg-zinc-dark/50 group space-x-0.5'>
                            {page
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
                                            noBlock
                                        />
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
                                noBlock
                            />
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
                                            title={`Page #${page} of ${Object.entries(pageStats).length}`}
                                            className='hidden hover:flex group-hover:flex'
                                            noBlock
                                        />
                                    );
                                })}
                        </span>
                        <DuotoneButton
                            icon={faForwardFast}
                            size='lg'
                            primary='springgreen'
                            secondary='darkslategray'
                            bg='bg-slate-very-dark'
                            border='border-lime'
                            shadow='shadow-yellow'
                            className='inline-flex'
                            onClick={lastPage}
                            title='Go to the last page'></DuotoneButton>
                        <DuotoneButton
                            icon={faForwardStep}
                            size='lg'
                            primary='springgreen'
                            secondary='darkslategray'
                            bg='bg-slate-very-dark'
                            border='border-lime'
                            shadow='shadow-yellow'
                            className='inline-flex'
                            onClick={nextPage}
                            title='Go to the next page'></DuotoneButton>
                    </ButtonGroup>
                </header>
                <table className='w-full h-auto border border-collapse border-white rounded-lg table-auto'>
                    <caption className='text-xl font-extrabold uppercase font-fira-sans tracking-loose'>{toTitleCase(collection)}</caption>
                    {ColGroup}
                    {Headers}
                    <tbody>
                        {window?.map((x, ix) => (
                            <Row key={x._id.toHexString()} rowData={x} />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className='w-full'>
                                <span className='w-full text-center'>{`${(data as Realm.Results<T>).length.toString()} of ${(
                                    data as Realm.Results<T>
                                ).length.toString()}`}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className='flex flex-grow'></div>
            </section>
        );
    }, []);
}
