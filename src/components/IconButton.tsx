import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { $cn } from '../util/$cn';
import { IconButtonProps } from './MainWindow';

export function IconButton(props: IconButtonProps) {
    const { overrideDisabled, ...remain } = props;
    const { icon, onClick, title, disabled, className } = $cn(
        remain,
        {
            'disabled:opacity-50': !overrideDisabled,
            'disabled:bg-neutral-dark': !overrideDisabled,
            'hover:disabled:bg-black': overrideDisabled ?? false,
            'hover:disabled:scale-100': overrideDisabled ?? false
        },
        'inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105 border-blue'
    );
    return (
        <li className='inline-flex' title={title}>
            <button disabled={disabled ?? false} type='button' className={className} onClick={onClick} tabIndex={disabled ? -1 : undefined}>
                <span className='px-2 py-1 border border-white rounded-md'>
                    <FontAwesomeIcon icon={icon} size='1x' className='block font-bold' fixedWidth />
                </span>
            </button>
        </li>
    );
}
