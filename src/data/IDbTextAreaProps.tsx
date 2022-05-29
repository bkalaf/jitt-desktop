import { IDbDescriptor } from './IDbDescriptor';


export type IDbTextAreaProps = {
    displayName?: string;
    required: boolean;
    readOnly: boolean;
    disabledFunction?: IDbDescriptor;
    defaultValue?: string;
    rows?: number;
};
