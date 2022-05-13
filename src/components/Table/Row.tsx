import { useToggle } from '../../hooks/useToggle';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';
import { $cn } from '../../util/$cn';
import { useViewContext } from "../../hooks/useViewContext";
import { IGridViewContext } from '../providers/ViewProvider';

export type ITableRowProps = React.TableHTMLAttributes<HTMLTableRowElement> & { oid: string };
export function TableRow(props: ITableRowProps) {
    useWhyDidYou(TableRow.name, props);
    const { isSelected, onClick } = useViewContext() as IGridViewContext;

    const { oid, ...remain } = props;
    const { children, ...spread } = $cn(
        remain,
        { selected: isSelected(oid) },
        'border border-white/50 rounded-lg divide divide-white/50 even:bg-sky-light odd:bg-slate-dark even:text-black odd:text-white group'
    );
    return (
        <tr {...spread} data-oid={oid} role='button' onClick={onClick}>
            {children}
        </tr>
    );
}



