import { Link } from 'react-router-dom';
import { toTitleCase } from '../common/text/toTitleCase';

export function NavMenuItem(props: { to: string }) {
    return (
        <li className='flex px-2 py-0.5 font-fira-sans text-lg font-semibold text-white bg-teal-dark'>
            <Link className='flex' to={`/data/v1/${props.to}`}>
                {toTitleCase(props.to)}
            </Link>
        </li>
    );
}
