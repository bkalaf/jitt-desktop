import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faBan, faCalculatorAlt, faExclamationCircle, faPenSlash, faShieldXmark } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { $cn } from './$cn';

export type IProps = {
    className?: string;
    children?: Children;
};
export type IIndicatorProps = {
    prop: string;
    icon: IconDefinition;
    className: string;
    size: SizeProp;
    title: string;
    tag: string;
} & IProps;
export function Indicator(props: IIndicatorProps) {
    const { prop, tag, className: $className, ...remain } = props;
    const { size, icon, ...spread } = $cn(
        remain,
        {
            'hidden peer-required:flex': prop === 'required',
            'hidden peer-readonly:flex': prop === 'readOnly',
            'hidden peer-disabled:flex': prop === 'disabled',
            'hidden peer-invalid:flex': prop === 'invalid',
            hidden: prop === 'local' && tag !== 'OUTPUT',
            flex: prop === 'local' && tag === 'OUTPUT'
        },
        $className
    );
    return (
        <span {...spread}>
            <FontAwesomeIcon size={size} icon={icon} />
        </span>
    );
}

export function IndicatorGroup(props: { tag: string }) {
    const { tag } = props;
    return (
        <>
            <Indicator
                prop='required'
                tag={tag}
                icon={faExclamationCircle}
                size='lg'
                className='absolute top-0 right-0 text-white bg-red'
                title='Field is required.'
            />
            <Indicator
                prop='readOnly'
                tag={tag}
                icon={faPenSlash}
                size='lg'
                className='absolute top-0 right-0 text-white bg-orange'
                title='Field is immutable.'
            />
            <Indicator prop='disabled' tag={tag} icon={faBan} size='lg' className='absolute top-0 right-0 text-white bg-black' title='Field is disabled.' />
            <Indicator
                prop='invalid'
                tag={tag}
                icon={faShieldXmark}
                size='lg'
                className='absolute top-0 right-0 text-white bg-magenta'
                title='Field is not valid.'
            />
            <Indicator
                prop='local'
                tag={tag}
                icon={faCalculatorAlt}
                size='lg'
                className='absolute top-0 right-0 text-white bg-blue'
                title='Field is calculated.'
            />
        </>
    );
}
