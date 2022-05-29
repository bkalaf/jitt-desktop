import { DbDescriptor } from './DbDescriptor';


export type IDbFieldSetProps = {
    displayName?: string;
    required: boolean;
    summaryFunction?: DbDescriptor;
    span: number;
};
