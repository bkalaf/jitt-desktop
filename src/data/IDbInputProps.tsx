import { DbDescriptor } from './DbDescriptor';


export type IDbInputProps = {
    required: boolean;
    readOnly: boolean;
    disabledFunction?: DbDescriptor;
    defaultValue?: string;
    type?: React.HTMLInputTypeAttribute;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    formatter?: DbDescriptor;
    convertFromFD?: DbDescriptor;
    convertToFD?: DbDescriptor;
    initializerFunction?: DbDescriptor;
    placeholder?: string;
    validatorFunctions?: DbDescriptor[];
};
