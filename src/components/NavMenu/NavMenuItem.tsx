import { Link } from 'react-router-dom';
import { objectMap, recordMap } from '../../common';
import { toTitleCase } from '../../common/text/toTitleCase';
import { $cn } from '../../util/$cn';

const modules: Record<string, string> = {
    null: 'bg-amber-dark',
    api: 'bg-emerald-dark',
    fs: 'bg-rose-dark',
    queues: 'bg-violet-dark'
};

const flags = recordMap(
    ([k, v]) => (modules == null ? 'null' : modules) === k,
    (k) => modules[k.toString()]
);
console.log(flags);
console.log(flags(modules));
export function NavMenuItem(props: { to: string; module?: string; label?: string } & React.LiHTMLAttributes<HTMLLIElement>) {
    const { module, to, label, ...remain } = props;
    const spread = $cn(remain, flags(modules), 'flex px-2 py-0.5 font-fira-sans text-lg font-semibold text-white tracking-wider leading-loose mx-2');
    return (
        <li {...spread}>
            <Link className='flex text-3xl' to={`/${module ?? 'data'}/v1/${to}`}>
                {label ?? toTitleCase(to)}
            </Link>
        </li>
    );
}
