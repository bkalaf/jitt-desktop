import { useWhyDidYou } from '../../hooks/useWhyDidYou';
import { $cn } from '../../util/$cn';
export type ITableCellProps = React.TableHTMLAttributes<HTMLTableCellElement>;

export function TableCell(props: ITableCellProps) {
    useWhyDidYou(TableCell.name, props);
    const { children, ...spread } = $cn(
        props,
        {},
        'px-2 py-0.5 align-middle text-center border border-white/50 rounded-lg divide divide-white/50 text-base font-normal font-fira-sans'
    );
    return <td {...spread}>{children}</td>;
}
