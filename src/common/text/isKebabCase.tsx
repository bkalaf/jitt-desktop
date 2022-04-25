import { isUpper } from '../../components/TopBar';

export function isKebabCase(str: string) {
    return str.includes('-') && str.split('').every((x) => !isUpper(x));
}
