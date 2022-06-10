import { RegisterFunction } from '../../hooks/useRegister';
import { $cn } from '../../util/$cn';
import { IDefinitionProps } from '../definitions';

export function DimensionsElement(props: { register: RegisterFunction } & IDefinitionProps) {
    const { name, register, defaultValue, init, ...remain } = props;
    const $defaultValue = defaultValue ?? (init == null ? null : init());
    const spread = $cn(remain, {}, 'peer');
    
    return <></>;
}
