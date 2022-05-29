import { objectMap } from '../common/obj/objectMap';

export const primitives = {
    objectId: 'objectId',
    string: 'string',
    int: 'int',
    float: 'float',
    double: 'double',
    decimal128: 'decimal128',
    date: 'date',
    data: 'data',
    uuid: 'uuid',
    bool: 'bool'
};
export const DTO = {
    ADMIN: {
        activity: 'activity',
        user: 'user'
    },
    AUCTIONS: {
        cost: 'cost',
        purchase: 'purchase'
    },
    DETAILS: {},
    FILES: {
        expense: 'expense',
        fsAlloc: 'fs-alloc',
        fsItem: 'fs-item',
        imageStage: 'image-stage',
        photoPack: 'photo-pack',
        productDocumentation: 'product-documentation'
    },
    INVENTORY: {
        barcode: 'barcode',
        bin: 'bin',
        fixture: 'fixture',
        item: 'item',
        scan: 'scan'
        // SKU: 'sku'
    },
    LISTINGS: {
        draft: 'draft',
        sellingPrice: 'selling-price',
        shippingRate: 'shipping-rate'
    },
    MATERIALS: {
        composition: 'composition',
        section: 'section',
        percentOf: 'percent-of'
    },
    PIPELINES: {
        barcodePipeline: 'barcode-pipeline',
        draftPipeline: 'draft-pipeline',
        imagePipeline: 'image-pipeline',
        promotionPipeline: 'promotion-pipeline',
        skuPipeline: 'sku-pipeline'
    },
    PRODUCTS: {
        brand: 'brand',
        company: 'company',
        dimension: 'dimension',
        itemType: 'item-type',
        measurement: 'measurement',
        product: 'product',
        productLine: 'product-line'
    },
    SALES: {
        sale: 'sale',
        sellingPrice: 'selling-price',
        trackingNumber: 'shipment-status',
        fullfillment: 'fulfillment',
        shippingLabel: 'shipping-label'
    },
    SCRAPES: {
        category: 'category',
        taxonomy: 'taxonomy',
        verifiedBrand: 'verified-brand'
    },
    STORAGES: {
        address: 'address',
        facility: 'facility',
        length: 'length',
        rentalUnit: 'rental-unit',
        selfStorage: 'self-storage',
        squareFootage: 'square-footage'
    },
    SCHEMA: {
        dbTable: 'dbTable',
        dbColumn: 'dbColumn',
        dbDataType: 'dbDataType',
        dbDescriptor: 'dbDescriptor',
        dbSort: 'dbSort',
        dbInputProps: 'dbInputProps',
        dbSelectProps: 'dbSelectProps',
        dbOutputProps: 'dbOutputProps',
        dbFieldSetProps: 'dbFieldSetProps',
        dbTextAreaProps: 'dbTextAreaProps',
        dbCellInputProps: 'dbCellInputProps'
    }
};

export const realmObjects: Record<
    | keyof typeof DTO.ADMIN
    | keyof typeof DTO.AUCTIONS
    | keyof typeof DTO.FILES
    | keyof typeof DTO.INVENTORY
    | keyof typeof DTO.LISTINGS
    | keyof typeof DTO.MATERIALS
    | keyof typeof DTO.PIPELINES
    | keyof typeof DTO.PRODUCTS
    | keyof typeof DTO.SCRAPES
    | keyof typeof DTO.STORAGES
    | keyof typeof DTO.SALES
    | keyof typeof DTO.SCHEMA,
    string
> = Object.fromEntries(
    (
        [
            DTO.ADMIN,
            DTO.AUCTIONS,
            DTO.DETAILS,
            DTO.FILES,
            DTO.INVENTORY,
            DTO.LISTINGS,
            DTO.MATERIALS,
            DTO.PIPELINES,
            DTO.PRODUCTS,
            DTO.SALES,
            DTO.SCRAPES,
            DTO.STORAGES,
            DTO.SCHEMA
        ] as Record<string, string>[]
    )
        .map((x) => Object.entries(x))
        .reduce((pv, cv) => [...pv, ...cv], [])
) as any;

export const allTypes = { ...primitives, ...realmObjects };
export const $ = {
    ...allTypes,
    optional: {
        ...objectMap((x) => `${x}?`)(allTypes)
    },
    list: 'list',
    listOf: {
        ...objectMap((x) => `${x}[]`)(allTypes)
    },
    linkingObjects: 'linkingObjects',
    object: 'object',
    dictionary: 'dictionary',
    dictionaryOf: {
        ...objectMap((x) => `${x}{}`)(allTypes)
    },
    set: 'set',
    setOf: {
        ...objectMap((x) => `${x}<>`)(allTypes)
    }
};