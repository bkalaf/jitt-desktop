export interface IPropertyInfo {
    typeName: string;
    name: string;
    type: string;
    datatype: string;
    objectType?: string;
    property?: string;
    defaultValue?: any;
    flags: Record<'embedded' | 'reference' | 'local' | 'enumerable' | 'linkingObjects' | 'primitive' | 'optional' | 'indexed', boolean>;
    mappedTo: string;
}
