import { faArrowDownAZ, faArrowUpAZ } from '@fortawesome/pro-duotone-svg-icons';
import { Menu } from '@electron/remote';
import { useCallback, useMemo } from 'react';
import { DuotoneIcon } from '../../components/icons/DuotoneIcon';
import { useSorted } from '../../components/useSorted';
import { appSettings } from '../../settings';
import { IDefinitionProps } from './index';
import { useSearchParams } from 'react-router-dom';
import { filterOps, FilterTuple, OpSymbol, unzip } from '../../components/MainRouter';

export const readFilter = (sp: URLSearchParams) =>
    sp
        .get('filter')
        ?.split('&')
        .map((x) => x.split(':') as FilterTuple) ?? [];
const getFilteredArgs = (sp: URLSearchParams) => {
    const [funcs, vars] = unzip(
        readFilter(sp)
            .map((tuple) => {
                if (tuple.length === 3) {
                    const [k, op, v] = tuple;
                    return (ix: number) => [`${k} ${filterOps[op]} $${ix}`, v] as [string, any];
                }
                const [k, agg, op, v] = tuple;
                return (ix: number) => [`${k}.${filterOps[agg]} ${filterOps[op]} $${ix}`, v] as [string, any];
            })
            .map((f, ix) => f(ix))
    );
    return [funcs.join(' AND '), ...vars] as [string, ...string[]];
};

export function useFilters(): (x: string) => (x: OpSymbol, pred?: (x: any) => boolean) => boolean {
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = readFilter(searchParams);
    return useCallback(
        (col: string) => {
            return function (incop: OpSymbol, pred: (x: any) => boolean = (x: any) => true) {
                filters
                    .filter((x) => x[0] === col)
                    .filter((x) => {
                        const op = x[2];
                        return op === incop;
                    })
                    .filter((x) => {
                        const value = x[x.length - 1];
                        return pred(value);
                    })
                    .some((x) => x != null);
                return false;
            };
        },
        [filters]
    );
}
export function TableHeaderCell(props: Omit<IDefinitionProps, 'children'>) {
    const { displayName, name, ...remain } = props;
    const [sort, toggleSort, lookupSort] = useSorted();
    const onClick = useCallback(() => {
        toggleSort(props.name);
    }, [props.name, toggleSort]);
    const icon = useMemo(() => {
        const s = lookupSort(name);
        if (s == null) return null;
        return s === 'ASC' ? faArrowUpAZ : faArrowDownAZ;
    }, [lookupSort, name]);
    const filters = useFilters();

    const contextMenu = appSettings.grid.header.cell.contextMenu(toggleSort, lookupSort, filters);
    const menu = Menu.buildFromTemplate(contextMenu(name) as any[]);
    const onContextMenu = useCallback(() => {
        menu.popup();
    }, [menu]);
    return (
        <th
            className='relative text-xl font-bold tracking-wide text-white border border-white font-fira-sans bg-blue-dark px-2 py-0.5'
            scope='col'
            key={name}
            role='button'
            onClick={onClick}
            onContextMenu={onContextMenu}>
            {displayName}
            {icon != null && <DuotoneIcon className='absolute top-0 right-0 w-8 h-8 opacity-70' icon={icon} size='lg' primary='yellowgreen' secondary='black' />}
        </th>
    );
}
