import { toTitleCase } from '../../common';
import { IDefinitionProps } from './index';

export function Definition(props: IDefinitionProps) {
    const { displayName: $displayName, name: $name, children, ...remain } = props;
    const displayName = $displayName ?? toTitleCase($name);

    return children({ displayName, name: $name, ...remain });
}
