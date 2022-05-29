import { DbDescriptor } from './DbDescriptor';
import { DbSort } from './DbSort';


export type IDbSelectProps = {
    displayName?: string;
    required: boolean;
    disabledFunction?: DbDescriptor;
    defaultValue?: string;
    optionValue?: string;
    optionLabel?: string;
    enumMap: Record<string, string>;
    multiple: boolean;
    size?: number;
    sort: DbSort[];
    filter?: string;
    convertToFD?: DbDescriptor;
    convertFromFD?: DbDescriptor;
};
