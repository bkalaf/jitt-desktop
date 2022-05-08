export type PropertyData = {
    embedded: boolean;
    reference: boolean;
    local: boolean;
    optional: boolean;
    linkingObjects: boolean;
    primitive: boolean;
    collection: boolean;
    type: string;
    objectType?: string;
    property?: string;
    name: string;
    mappedTo: string;
    fromDB?: (x: any) => string;
    toDB?: (x: string) => any;
    fields?: PropertyData[];
};
