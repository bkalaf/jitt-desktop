import { faTrashCan, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { useViewContext } from '../../hooks/useViewContext';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';
import { $cn } from '../../util/$cn';
import { DuotoneIcon, DuotoneIconProps } from '../icons/DuotoneIcon';
import { Btn, IBtnProps } from './Btn';
import { checkSelectedToDisable } from './buildLibrary';
import { IGridViewContext } from './ViewProvider';

export type IDuotoneBtnProps = Omit<DuotoneIconProps & IBtnProps, 'toEnable'>;

export function DuotoneButton(props: IDuotoneBtnProps) {
    const { onClick, initState, title, icon, primary, secondary, primaryOpacity, secondaryOpacity, bg, size, border, shadow, disabled, ...remain } = props;
    const { className } = $cn(
        remain,
        {
            'shadow-sky': shadow == null,
            'bg-amber-light': bg == null,
            'border-cyan/70': border == null,
            [bg ?? '']: bg != null,
            [border ?? '']: border != null,
            [shadow ?? '']: shadow != null
        },
        'transform transition-all duration-1000 delay-150 ease-in-out flex items-center justify-center px-2 py-0.5 align-middle text-center  border rounded-md  shadow-lg m-auto w-auto disabled:opacity-30 disabled:hover:opacity-30 disabled:focus:opacity-30 focus:ring focus:ring-red/70 hover:ring hover:ring-red/70'
    );
    return (
        <button type='button' onClick={onClick} className={className} disabled={disabled}>
            <DuotoneIcon
                icon={icon}
                size={size}
                bg={bg}
                primary={primary}
                secondary={secondary}
                primaryOpacity={primaryOpacity}
                secondaryOpacity={secondaryOpacity}
            />
        </button>
    );
}
/**
 * @deprecated
 */
export function DuotoneBtn(props: IDuotoneBtnProps) {
    useWhyDidYou(DuotoneBtn.name, props);
    const { onClick, initState, title, className, icon, primary, secondary, primaryOpacity, secondaryOpacity, bg, size } = props;
    const { isSelected } = useViewContext()! as IGridViewContext;
    return (
        <Btn onClick={onClick} initState={initState ?? false} title={title} className='shadow-inner shadow-black' toEnable={checkSelectedToDisable(isSelected)}>
            <DuotoneIcon
                icon={icon}
                size={size}
                bg={bg}
                primary={primary}
                secondary={secondary}
                primaryOpacity={primaryOpacity}
                secondaryOpacity={secondaryOpacity}
            />
        </Btn>
    );
}
