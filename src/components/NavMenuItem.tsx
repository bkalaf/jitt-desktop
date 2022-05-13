import { Link } from 'react-router-dom';
import { toTitleCase } from '../common/text/toTitleCase';
import { $cn } from '../util/$cn';

export function NavMenuItem(props: { to: string, module?: string }) {
    const { module, to } = props;
    const spread = $cn({}, { 'bg-amber-dark': module == null, 'bg-emerald-dark': module === 'api', 'bg-rose-dark': module === 'fs', 'bg-violet-dark': module === 'queues' }, 'flex px-2 py-0.5 font-fira-sans text-lg font-semibold text-white tracking-wider leading-loose mx-2');
    return (
        <li {...spread}>
            <Link className='flex' to={`/${module ?? 'data'}/v1/${props.to}`}>
                {toTitleCase(props.to)}
            </Link>
        </li>
    );
}
