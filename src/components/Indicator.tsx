import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faBan, faCalculatorAlt, faExclamationCircle, faPenSlash, faShieldXmark } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNotNil } from '../common/isNotNull';
import { $cn } from '../util/$cn';

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
    id: string;
    tag: string;
} & IProps;
export function Indicator(props: IIndicatorProps) {
    const { prop, tag, className: $className, id, ...remain } = props;
    const el = document.getElementById(id) as HTMLInputElement;
    console.log(`indicator-el`, id, el);
    const { size, icon, ...spread } = $cn(
        remain,
        {
            'hidden': isNotNil(el) ? (prop === 'required' && !el.required) || (prop === 'readOnly' && !el.readOnly) || (prop === 'disabled' && !el.disabled) || (el.tagName !== 'OUTPUT' && prop === 'local') : true,
            'flex': isNotNil(el) ? (prop === 'required' && el.required) || (prop === 'readOnly' && el.readOnly) || (prop === 'disabled' && el.disabled) || (el.tagName === 'OUTPUT' && prop === 'local') : false     
        },
        $className
    );
    return (
        <span {...spread}>
            <FontAwesomeIcon size={size} icon={icon} />
        </span>
    );
}

export function IndicatorGroup(props: { tag: string, id: string }) {
    const { tag,id  } = props;
    return (
        <div className='absolute top-0 right-0'>
            <Indicator
                prop='required'
                tag={tag}
                icon={faExclamationCircle}
                size='lg'
                className='text-white bg-red'
                title='Field is required.'
                id={id}
            />
            <Indicator
                prop='readOnly'
                tag={tag}
                icon={faPenSlash}
                size='lg'
                className='text-white bg-orange'
                title='Field is immutable.'
                id={id}
            />
            <Indicator prop='disabled' tag={tag} icon={faBan} size='lg' className='text-white bg-black ' title='Field is disabled.' id={id} />
            {/* <Indicator
                prop='invalid'
                tag={tag}
                icon={faShieldXmark}
                size='lg'
                className='absolute top-0 right-0 text-white bg-magenta'
                title='Field is not valid.'
            /> */}
            <Indicator
                prop='local'
                tag={tag}
                icon={faCalculatorAlt}
                size='lg'
                className='text-white bg-blue'
                title='Field is calculated.'
                id={id}
            />
        </div>
    );
}
