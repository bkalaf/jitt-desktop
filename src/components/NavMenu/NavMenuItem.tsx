import { Link } from 'react-router-dom';
import { toTitleCase } from '../../common/text/toTitleCase';
import { $cn } from '../../util/$cn';

export type NavMenuModule = 'scrapes' | 'fs' | 'auctions' | 'products' | 'storage' | 'inventory' | 'listing';

export function NavMenuItem(props: { prefix: string, to: string; module?: NavMenuModule; label?: string } & React.LiHTMLAttributes<HTMLLIElement>) {
    const { module, to, label, prefix, ...remain } = props;
    const spread = $cn(remain, {
        'bg-emerald-dark': module === 'scrapes',
        'bg-yellow-dark': module === 'fs',
        'bg-violet-dark': module === 'storage',
        'bg-orange-dark': module === 'inventory',
        'bg-indigo-light': module === 'listing',
        'bg-blue-dark': module === 'auctions',
        'bg-rose-dark': module === 'products'
    }, 'flex px-2 py-0.5 font-fira-sans text-base font-semibold text-white tracking-wider leading-loose mx-2');
    return (    
        <li key={props.label} {...spread}>
            <Link className='flex text-base' to={[prefix, to].join('/')}>
                {label ?? toTitleCase(to)}
            </Link>
        </li>
    );
}
