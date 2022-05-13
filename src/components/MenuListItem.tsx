import { $cn } from '../util/$cn';
import { toTitleCase } from '../common/text/toTitleCase';

/**
 * @deprecated
 */
export function MenuListItem(props: { children?: Children; to: string; }) {
    const classNameFunc = (baseCn: string) => ({ isActive }: { isActive: boolean; }) => $cn(props, {
        active: isActive,
        'not-active': !isActive
    });
    const children = props.children ? toTitleCase(props.to) : '';
}
