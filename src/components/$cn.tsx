import { partitionBy } from '../common/array/partitionBy';
import { distinct } from '../common/array/distinct';

export function $cn<T>(props: { className?: string } & T, flags: Record<string, boolean> = {}, ...classes: string[]) {
    const { className, ...remain } = props;
    const classList = [...classes.map((x) => x.split(' ')).reduce((pv, cv) => [...pv, ...cv], []), ...(className?.split(' ') ?? [])];
    const [trues, falses] = partitionBy((x: [string, boolean]) => x[1])(Object.entries(flags) ?? [], [], []);
    const cns = distinct([...classList, ...trues.map((x) => x[0])]).filter((x) => !falses.map((x) => x[0]).includes(x));
    return { ...remain, className: cns.join(' ') };
}
