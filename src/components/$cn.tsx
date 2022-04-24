import { partitionBy } from "./partitionBy";
import { distinct } from "./distinct";

export function $cn<T>(props: { className?: string; } & T, flags: Record<string, boolean> = {}, ...classes: string[]) {
    const { className, ...remain } = props;
    const classList = [...classes.map((x) => x.split(' ')).reduce((pv, cv) => [...pv, ...cv], []), ...(className?.split(' ') ?? [])];
    console.log('classList', classList)
    const [trues, falses] = partitionBy((x: [string, boolean]) => x[1])(Object.entries(flags) ?? [], [], []);
    console.log('trues', trues);
    console.log('falses', falses);
    const cns = distinct([...classList, ...trues.map((x) => x[0])]).filter(x => !falses.map(x => x[0]).includes(x));
    console.log('cns', cns);
    return { ...remain, className: cns.join(' ') };
}
