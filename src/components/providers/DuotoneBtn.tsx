import { faTrashCan, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { useViewContext } from '../../hooks/useViewContext';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';
import { DuotoneIcon, DuotoneIconProps } from '../icons/DuotoneIcon';
import { Btn, IBtnProps } from './Btn';
import { checkSelectedToDisable } from './buildLibrary';
import { IGridViewContext } from './ViewProvider';

export type IDuotoneBtnProps = Omit<DuotoneIconProps & IBtnProps, 'toEnable'>;

export function DuotoneBtn(props: IDuotoneBtnProps) {
    useWhyDidYou(DuotoneBtn.name, props);
    const { onClick, initState, title, className, icon, primary, secondary, primaryOpacity, secondaryOpacity, bg, size } = props;
    const { isSelected } = useViewContext()! as IGridViewContext;
    return (
        <Btn onClick={onClick} initState={initState ?? false} title={title} className='shadow-inner shadow-black' toEnable={checkSelectedToDisable(isSelected)}>
            <DuotoneIcon icon={icon} size={size} bg={bg} primary={primary} secondary={secondary} primaryOpacity={primaryOpacity} secondaryOpacity={secondaryOpacity } />
        </Btn>
    );
}

// <Btn
//     onClick={() => {
//         deleteRows([props.rowData._id.toHexString()]);
//     }}
//     initState={false}
//     title='Delete this row'
//     className='shadow-inner shadow-black'
//     toEnable={checkSelectedToDisable(isSelected)}>
//     <DuotoneIcon icon={faTrashCan} primary='mediumseagreen' secondary='lawngreen' secondaryOpacity={0.7} bg='bg-slate-very-dark' size='lg' />
// </Btn>;
