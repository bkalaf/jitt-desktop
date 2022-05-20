/* eslint-disable @typescript-eslint/no-namespace */
import { ObjectSchema } from 'realm';
import { ObjectId } from 'bson';
import { objectMap, recordMap } from '../common/obj/objectMap';
import { Provinces } from './enums/province';
import { Country } from './enums/country';
import { LengthUOMS, lengthUOMS, pluralize } from './enums/lengthUOM';
import { AuctionSites } from './enums/auctionSite';
import { MimeTypes } from './enums/mimeTypes';
import { capitalize, isLower, isUpper, not } from '../common';
import { now } from '../aggregator';
import { LinkedObject, LinkingObject, LinkingObjects } from './LinkingObjects';
import { $currentUser } from '../components/globals';
import { MeasuresOf } from './enums/measuresOf';
import { BarcodeType, CapacityUOMS, Colors, FabricTypes, SKUTypes, StageTypes, WeightUOMS } from './enums';
import { ActivityAction } from './ActivityAction';
import { ActivityScope } from './ActivityScope';
import { decapitalize } from '../common/text/decapitalize';

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
        photo: 'photo',
        productDocumentation: 'product-documentation'
    },
    INVENTORY: {
        bin: 'bin',
        fixture: 'fixture',
        item: 'item',
        scan: 'scan',
        SKU: 'sku'
    },
    LISTINGS: {
        draft: 'draft',
        sellingPrice: 'selling-price',
        shippingRate: 'shipping-rate'
    },
    MATERIALS: {
        fabric: 'fabric',
        fabricSection: 'fabric-section',
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
        barcode: 'barcode',
        brand: 'brand',
        company: 'company',
        dimension: 'dimension',
        itemType: 'item-type',
        measurement: 'measurement',
        product: 'product',
        productLine: 'product-line'
    },
    SALES: {
        trackingNumber: 'tracking-number',
        fullfillment: 'fulfillment'
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
    | keyof typeof DTO.SALES,
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
            DTO.STORAGES
        ] as Record<string, string>[]
    )
        .map((x) => Object.entries(x))
        .reduce((pv, cv) => [...pv, ...cv], [])
) as any;

const allTypes = { ...primitives, ...realmObjects };
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
export const $$ = {
    ...objectMap((x: string) => decapitalize(x.split('-').map(capitalize).join('')))(allTypes)
};

console.log(JSON.stringify($$, null, '\t'));
export class Length {
    static schema: ObjectSchema = {
        name: $.length,
        embedded: true,
        properties: {
            value: { type: $.double, default: 0 },
            uom: { type: $.string, default: 'in' }
        }
    };
    value: number;
    uom: 'in' | 'm' | 'ft' | 'cm' | 'mm' | 'yd' | 'mi' | 'km';
    constructor() {
        this.value = 0;
        this.uom = 'in';
    }
    get displayAs() {
        const v = Number.isInteger(this.value) ? this.value.toFixed(0) : this.value.toFixed(1);
        return `${v} ${this.uom}`;
    }
}

namespace Admin {
    /**
     * @description Represents a repeating task, usually for maintenance, either completed or scheduled.
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class Activity
     * @see dto
     */
    export class Activity {
        static schema: ObjectSchema = {
            name: $.activity,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                action: $.string,
                scope: $.string,
                when: $.date,
                isComplete: $.bool,
                isScheduled: $.bool,
                brands: {
                    type: $.linkingObjects,
                    objectType: $.brand,
                    property: $$.activity
                },
                categories: {
                    type: $.linkingObjects,
                    objectType: $.category,
                    property: $$.activity
                },
                taxonomy: {
                    type: $.linkingObjects,
                    objectType: $.taxonomy,
                    property: $$.activity
                }
            }
        };
        _id: ObjectId;
        action: ActivityAction;
        scope: ActivityScope;
        when: Date;
        isComplete: boolean;
        isScheduled: boolean;
        brands: LinkingObjects<Scrapes.VerifiedBrand>;
        categories: LinkingObjects<Scrapes.Category>;
        taxonomy: LinkingObjects<Scrapes.Taxonomy>;
        constructor() {
            this._id = new ObjectId();
            this.action = 'scrape';
            this.scope = 'brands';
            this.when = now();
            this.isComplete = false;
            this.isScheduled = true;
            this.brands = [];
            this.categories = [];
            this.taxonomy = [];
        }
    }
    export class User {}
}

namespace Auctions {
    export class Cost {
        static schema: ObjectSchema = {
            name: $.cost,
            embedded: true,
            properties: {
                bid: { type: $.double, default: 0 },
                taxPercent: { type: $.optional.double, default: 0 },
                taxExempt: { type: $.bool, default: false },
                premiumPercent: { type: $.optional.double, default: 0 }
            }
        };
        bid: number;
        taxPercent: number;
        taxExempt: boolean;
        premiumPercent: number;
        constructor() {
            this.bid = 0;
            this.taxPercent = 0;
            this.premiumPercent = 0;
            this.taxExempt = false;
        }
        get taxDollar() {
            return this.taxExempt ? 0 : this.bid * (this.taxPercent / 100);
        }
        get premiumDollar() {
            return this.bid * (this.premiumPercent / 100);
        }
        get totalDollar() {
            return this.bid + this.premiumDollar + this.taxDollar;
        }
    }
    export class Purchase {
        static schema: ObjectSchema = {
            name: $.purchase,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                cost: $.cost,
                closeDate: $.date,
                auctionSite: { type: $.string, default: 'storagetreasures.com' },
                auctionId: $.optional.string,
                invoiceId: $.optional.string,
                invoice: $.fsItem,
                rentalUnit: $.rentalUnit
            }
        };
        _id: ObjectId;
        cost: Cost;
        closeDate: Date;
        auctionSite: AuctionSites;
        auctionId?: string;
        invoiceId?: string;
        invoice?: Files.FileItem;
        rentalUnit?: Storages.RentalUnit;
        constructor() {
            this._id = new ObjectId();
            this.cost = new Cost();
            this.closeDate = new Date(Date.now());
            this.auctionSite = 'storagetreasures.com';
        }
    }
}

namespace Details {
    export class Media {}

    export class Apparel {}
    export class Shoes {}
    export class Book extends Media {}
    export class Movie extends Media {}
    export class VideoGame extends Media {}
    export class UpperWear extends Apparel {}
    export class LowerWear extends Apparel {}
    export class OuterWear extends Apparel {}
    export class OutfitWear extends Apparel {}
    export class GolfClub extends Apparel {}
    export class Electronics {}
    export class Computer extends Electronics {}
}
namespace Files {
    export class Expense {
        static schema: ObjectSchema = {
            name: $.expense,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                amount: { type: $.double, default: 0 },
                reason: $.string,
                receipt: $.fsItem,
                item: $.item,
                purchase: $.purchase
            }
        };
        _id: ObjectId;
        amount: number;
        reason: string;
        receipt?: Files.FileItem;
        item?: Inventory.Item;
        purchase?: Auctions.Purchase;
        constructor() {
            this._id = new ObjectId();
            this.amount = 0;
            this.reason = '';
        }
    }
    /**
     * @description Allocated file or folder piece of the file system.
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class FileAlloc
     */
    export class FileAlloc {
        static schema: ObjectSchema = {
            name: $.fsAlloc,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                originalName: $.string,
                parent: $.fsAlloc,
                content: {
                    type: $.linkingObjects,
                    objectType: $.fsAlloc,
                    property: 'parent'
                },
                materializedPath: $.string,
                fsItem: $.fsItem,
                fileCreation: $.optional.date
            }
        };
        _id: ObjectId;
        name: string;
        originalName: string;
        parent?: FileAlloc;
        content: LinkingObjects<FileAlloc>;
        materializedPath: string;
        fsItem?: FileItem;
        fileCreation?: Date;
        constructor() {
            this._id = new ObjectId();
            this.name = '';
            this.originalName = '';
            this.content = [];
            this.materializedPath = '';
        }
        get path(): string {
            return [this.parent?.path ?? '', this.name].join('/');
        }
        get isFolder(): string {
            return (this.fsItem == null).toString();
        }
        get isFile(): string {
            return (!(this.fsItem == null)).toString();
        }
        get count(): number {
            return this.content.length;
        }
        get size(): number {
            return this.content.map((s) => s.size).reduce((x, y) => x + y, 0);
        }
        get type(): string {
            if (this.fsItem == null) return 'folder';
            if (this.fsItem.isInvoice === 'true') return 'invoice';
            if (this.fsItem.isPhoto === 'true') return 'photo';
            if (this.fsItem.isDoc === 'true') return 'document';
            if (this.fsItem.isReceipt === 'true') return 'receipt';
            return 'unknown';
        }
    }

    /**
     * @description File item part of the file system - is a blob and contains binary data.
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class FileItem
     */
    export class FileItem {
        static INVOICE_REGEX = /^\/auctions\/(\d*\/)?invoices\//;
        static PHOTO_REGEX = /^\/products\/(\d*\/)?images\//;
        static DOC_REGEX = /^\/products\/(\d*\/)?docs\//;
        static RECEIPT_REGEX = /^\/(auctions|products)\/(\d*\/)?receipts\//;

        static schema: ObjectSchema = {
            name: $.fsItem,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                fsAlloc: {
                    type: $.linkingObjects,
                    objectType: $.fsAlloc,
                    property: $.fsItem
                },
                data: $.optional.data,
                size: $.int,
                mimeType: $.optional.string,
                invoice: {
                    type: $.linkingObjects,
                    objectType: $.purchase,
                    property: 'invoice'
                },
                sku: {
                    type: $.linkingObjects,
                    objectType: $.SKU,
                    property: 'images'
                }
                // TODO add doc
                // TODO add photo
                // TODO add receipt
            }
        };
        _id: ObjectId;
        fsAlloc: LinkedObject<FileAlloc>;
        data?: ArrayBuffer;
        size: number;
        mimeType?: MimeTypes;
        invoice: LinkedObject<Auctions.Purchase>;
        constructor() {
            this._id = new ObjectId();
            this.size = 0;
            this.mimeType = '';
            this.fsAlloc = [];
            this.invoice = [];
        }
        get name() {
            // const arr = Object.entries(this.fsAlloc ?? {})[0][1];
            // const arr1 = this.fsAlloc[0];
            // console.log("ARR1", arr1);
            // const arr2 = Object.entries(this.fsAlloc[0]);
            // console.log('ARR2', arr2);
            // console.log('ARR', arr);
            console.log('NEW NAME', this.fsAlloc[0]);
            return this.fsAlloc[0].name;
        }
        get isAssigned() {
            return (this.invoice[0] != null).toString();
        }
        get isInvoice() {
            return FileItem.INVOICE_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
        }
        get isPhoto() {
            return FileItem.PHOTO_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
        }
        get isReceipt() {
            return FileItem.RECEIPT_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
        }
        get isDoc() {
            return FileItem.DOC_REGEX.test(this.fsAlloc[0]?.path ?? '/').toString();
        }
    }
    export class ImageStage {
        static schema: ObjectSchema = {
            name: $.imageStage,
            embedded: true,
            properties: {
                stage: { type: $.int, default: 0 },
                fsAlloc: $.fsAlloc,
                isApproved: { type: $.bool, default: false }
            }
        };
        stage: StageTypes;
        fsAlloc?: FileAlloc;
        isApproved: boolean;
        constructor() {
            this.stage = 0;
            this.isApproved = false;
        }
    }
    export class Photo {
        static schema: ObjectSchema = {
            name: $.photo,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                versions: $.listOf.imageStage,
                item: $.item
            }
        };
        _id: ObjectId;
        versions: ImageStage[];
        item?: Inventory.Item;
        constructor() {
            this._id = new ObjectId();
            this.versions = [];
        }
    }
    export class ProductDocumentation {
        static schema: ObjectSchema = {
            name: $.productDocumentation,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                fsItem: $.fsItem,
                product: $.product
            }
        };
        _id: ObjectId;
        fsItem?: FileItem;
        product?: Products.Product;
        constructor() {
            this._id = new ObjectId();
        }
    }
}
namespace Inventory {
    export class SKU {
        static schema: ObjectSchema = {
            name: $.SKU,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                barcode: $.barcode,
                type: $.optional.string,
                fixture: {
                    type: $.linkingObjects,
                    objectType: $.fixture,
                    property: 'sku'
                },
                bin: {
                    type: $.linkingObjects,
                    objectType: $.bin,
                    property: 'sku'
                },
                product: {
                    type: $.linkingObjects,
                    objectType: $.product,
                    property: 'sku'
                },
                photo: {
                    type: $.linkingObjects,
                    objectType: $.photo,
                    property: 'sku'
                },
                images: {
                    type: $.linkingObjects,
                    objectType: $.fsItem,
                    property: 'sku'
                }
            }
        };
        _id: ObjectId;
        barcode?: Products.Barcode;
        fixture: LinkedObject<Fixture>;
        bin: LinkedObject<Bin>;
        product: LinkedObject<Products.Product>;
        constructor() {
            this._id = new ObjectId();
            this.fixture = [];
            this.bin = [];
            this.product = [];
        }
        get type(): SKUTypes | undefined {
            return this.bin.length > 0 ? 'bin' : this.product.length > 0 ? 'product' : this.fixture.length > 0 ? 'fixture' : undefined;
        }
    }
    export class Fixture {
        static schema: ObjectSchema = {
            name: $.fixture,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                sku: $.SKU,
                color: $.listOf.string,
                notes: $.optional.string,
                bins: {
                    type: $.linkingObjects,
                    objectType: $.bin,
                    property: $$.fixture
                }
            }
        };
        _id: ObjectId;
        name: string;
        sku?: SKU;
        color: Colors[];
        notes: string;
        bins: LinkingObjects<Bin>;
        constructor() {
            this._id = new ObjectId();
            this.name = '';
            this.notes = '';
            this.bins = [];
            this.color = [];
        }
    }
    export class Bin {
        static schema: ObjectSchema = {
            name: $.bin,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                sku: $.SKU,
                color: $.optional.string,
                notes: $.optional.string,
                fixture: $.fixture
            }
        };
        _id: ObjectId;
        name: string;
        sku?: SKU;
        color: Colors[];
        notes: string;
        fixture?: Fixture;
        constructor() {
            this._id = new ObjectId();
            this.name = '';
            this.notes = '';
            this.color = [];
        }
    }
    export class Scan {
        static schema: ObjectSchema = {
            name: $.scan,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                sku: $.sku,
                bin: $.bin,
                item: $.item,
                timestamp: $.int,
                user: $.string
            }
        };
        _id: ObjectId;
        sku?: SKU;
        bin?: Bin;
        timestamp: number;
        user: string;
        constructor() {
            this._id = new ObjectId();
            this.timestamp = Date.now();
            this.user = getCurrentPartitionValue();
        }
    }
    export class Item {
        static schema = {
            name: $.item,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                colors: $.listOf.string,
                condition: { type: $.string, default: 'Likenew' },
                defects: $.listOf.string,
                features: $.listOf.string,
                tested: $.optional.date,
                sku: $.sku
            }
        };
    }
}
namespace Listings {
    export class Draft {}
    export class SellingPrice {
        static schema: ObjectSchema = {
            name: $.bin,
            primaryKey: '_id',
            properties: {
                _id: $.objectId
            }
        };
    }
    export class ShippingRate {
        static schema: ObjectSchema = {
            name: $.bin,
            primaryKey: '_id',
            properties: {
                _id: $.objectId
            }
        };
    }
}
namespace Materials {
    export class PercentOf {
        static schema: ObjectSchema = {
            name: $.percentOf,
            embedded: true,
            properties: {
                fabricType: $.string,
                percent: { type: $.double, default: 100 }
            }
        };
        fabricType: FabricTypes;
        percent: number;
        constructor() {
            this.percent = 100;
            this.fabricType = 'C';
        }
    }
    export class FabricSection {
        static schema: ObjectSchema = {
            name: $.fabric,
            embedded: true,
            properties: {
                sectionName: $.optional.string,
                segments: $.listOf.percentOf
            }
        };
        sectionName?: string;
        segments: PercentOf[];
        constructor() {
            this.segments = [];
        }
    }
    /**
     * @description The underlying composition of materials to create the multi-part combined.
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class Fabric
     * @see dto
     */
    export class Fabric {
        static schema: ObjectSchema = {
            name: DTO.MATERIALS.fabric,
            embedded: true,
            properties: {
                sections: $.listOf.fabricSection
            }
        };
        sections: FabricSection[];
        constructor() {
            this.sections = [];
        }
    }
}

namespace Pipelines {
    export class BarcodePipeline {
        static schema: ObjectSchema = {
            name: $.barcodePipeline,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                barcode: $.barcode,
                timestamp: $.int,
                user: $.string
            }
        };
        _id: ObjectId;
        barcode?: Barcode;
        timestamp: number;
        user: string;
        constructor() {
            this._id = new ObjectId();
            this.timestamp = Date.now();
            this.user = getCurrentPartitionValue();
        }
    }
    /**
     * @description
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class DraftPipeline
     */
    export class DraftPipeline {}
    /**
     * @description
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class ImagePipeline
     */
    export class ImagePipeline {
        static schema: ObjectSchema = {
            name: $.imagePipeline,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                photo: $.photo
            }
        };
    }
    /**
     * @description
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class PromotionPipeline
     */
    export class PromotionPipeline {}
    /**
     * @description
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class SkuPipeline
     */
    export class SkuPipeline {
        static schema: ObjectSchema = {
            name: $.skuPipeline,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                sku: $.sku,
                brandText: $.optional.string,
                descriptionText: $.optional.string,
                createdOn: $.optional.date,
                printedOn: $.optional.date
            }
        };
        _id: ObjectId;
        sku?: SKU;
        brandText?: string;
        descriptionText?: string;
        createdOn?: Date;
        printedOn?: Date;
        constructor() {
            this.createdOn = now();
            this._id = new ObjectId();

            // TODO finish up grabbing linked data for label
            // this.sku?.product.
        }

        markPrinted(): void {
            this.printedOn = now();
        }
    }
}

namespace Products {
    export class Barcode {
        static schema: ObjectSchema = {
            name: $.barcode,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                barcode: $.string,
                parts: $.listOf.string,
                valid: $.bool,
                type: $.optional.string,
                description: $.optional.string
            }
        };
        _id: ObjectId;
        barcode: string;
        parts: string[];
        valid: boolean;
        type?: BarcodeType;
        description?: string;
        get isValid() {
            const result = this.calculateCheckDigit();
            return result == null ? false : result[0];
        }
        constructor() {
            this._id = new ObjectId();
            this.barcode = '';
            this.parts = [];
            this.valid = false;
        }
        classify(): BarcodeType | undefined {
            switch (this.barcode.length) {
                case 8:
                    return 'UPCA';
                case 10:
                    return 'ISBN10';
                case 12:
                    return 'UPCE';
                case 13:
                    return this.barcode.startsWith('978') || this.barcode.startsWith('979') ? 'ISBN13' : 'EAN13';

                default:
                    return this.barcode.split('').some((x) => isLower(x) || isUpper(x)) ? 'ASIN' : undefined;
            }
        }
        MULTIPLIERS: number[] = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
        calculateCheckDigit(): [passed: boolean, actual: number, expected: number] | undefined {
            if (this.type === 'ASIN' || this.type === 'ELID' || this.type == null) return undefined;
            const [actual, ...remain] = this.barcode.padStart(13, '0').split('').reverse();
            const head = remain.reverse();
            const summed = this.MULTIPLIERS.map((x, ix) => parseInt(head[ix], 10) * x).reduce((pv, cv) => pv + cv, 0);
            const modulo = summed % 10;
            const subtracted = 10 - modulo;
            const expected = subtracted === 10 ? 0 : subtracted;
            return [parseInt(actual, 10) === expected, parseInt(actual, 10), expected] as [passed: boolean, actual: number, expected: number];
        }
    }
    export class Brand {
        static schema: ObjectSchema = {
            name: $.brand,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                alias: $.listOf.string,
                productLines: $.listOf.string,
                company: $.company,
                verifiedBrand: $.verifiedBrand,
                activity: $.activity
            }
        };
        _id: ObjectId;
        name: string;
        alias: string[];
        productLines: string[];
        company?: Company;
        verifiedBrand?: VerifiedBrand;
        activity?: Activity;
        constructor() {
            this._id = new ObjectId();
            this.name = '';
            this.alias = [];
            this.productLines = [];
        }
    }
    export class Company {
        static schema: ObjectSchema = {
            name: $.company,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                parent: $.company,
                descendants: {
                    type: $.linkingObjects,
                    objectType: $.company,
                    property: 'parent'
                },
                aliases: {
                    type: $.list,
                    objectType: $.string
                },
                rns: {
                    type: $.list,
                    objectType: $.int
                },
                country: {
                    type: $.list,
                    objectType: $.string
                },
                brands: {
                    type: $.linkingObjects,
                    objectType: $.brand,
                    property: 'company'
                }
            }
        };

        _id: ObjectId;
        name: string;
        parent?: Company;
        descendants: LinkingObjects<Company>;
        aliases: string[];
        rns: number[];
        country: Country[];
        brands: LinkingObjects<Brand>;
        constructor() {
            this._id = new ObjectId();
            this.name = '';
            this.descendants = [];
            this.aliases = [];
            this.rns = [];
            this.country = [];
            this.brands = [];
        }
    }
    export class Dimension<T extends LengthUOMS | WeightUOMS | CapacityUOMS> {
        static schema: ObjectSchema = {
            name: $.dimension,
            embedded: true,
            properties: {
                measureOf: $.string,
                value: { type: $.double, default: 0 },
                uom: { type: $.optional.string }
            }
        };
        measureOf: MeasuresOf;
        value: number;
        uom?: T;
        constructor() {
            this.measureOf = 'M';
            this.value = 0.0;
        }
    }
    export class ItemType {
        static schema: ObjectSchema = {
            name: $.itemtype,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                taxonomy: {
                    type: $.linkingObjects,
                    objectType: $.taxonomy,
                    property: 'itemType'
                },
                name: $.string,
                details: $.dictionaryOf.string
            }
        };
        _id: ObjectId;
        taxonomy: LinkingObjects<Taxonomy>;
        name: string;
        details: Record<string, string>;

        constructor() {
            this._id = new ObjectId();
            this.name = '';
            this.details = {};
            this.taxonomy = [];
        }
    }
    export class Measurement {
        static schema: ObjectSchema = {
            name: $.measurements,
            embedded: true,
            properties: {
                of: { type: $.string, default: 'L' },
                measures: $.listOf.string,
                uoms: $.listOf.string
            }
        };
        of: MeasuresOf;
        measures: string[];
        uoms: string[];
        constructor() {
            this.of = 'L';
            this.measures = [];
            this.uoms = [];
        }
    }
    export class Product {
        static schema = {
            name: $.product,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                brand: $.brand,
                productLine: $.productLine,
                dims: $.listOf.dimension,
                measurements: $.listOf.measurement,
                madeOf: $.madeOf,
                origin: $.optional.string,
                barcodes: $.listOf.barcode
            }
        };
    }
    export class ProductLine {
        static schema: ObjectSchema = {
            name: DTO.PRODUCTS.productLine,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                brand: DTO.PRODUCTS.brand,
                name: $.string,
                products: {
                    type: $.linkingObjects,
                    objectType: DTO.PRODUCTS.product,
                    property: 'productLine'
                }
            }
        };
        _id: ObjectId;
        name: string;
        brand?: Products.Brand;
        products: LinkingObjects<Product>;
        constructor() {
            this._id = new ObjectId();
            this.name = '';
            this.products = [];
        }
    }
}
namespace Sales {
    export class TrackingNumber {}
    export class Fulfillment {}
}
namespace Scrapes {
    export class VerifiedBrand {
        static schema: ObjectSchema = {
            name: $.verifiedBrand,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string
            }
        };
        _id: ObjectId;
        name: string;
        constructor() {
            this._id = new ObjectId();
            this.name = '';
        }
    }
    export class Category {
        static schema: ObjectSchema = {
            name: $.category,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                id: $.string,
                label: $.string,
                node: $.int,
                activity: $.activity
            }
        };
        _id: ObjectId;
        id: string;
        label: string;
        node: 0 | 1 | 2 | 3;
        activity?: Activity;
        constructor() {
            this._id = new ObjectId();
            this.id = '';
            this.label = '';
            this.node = 0;
        }
    }
    export class Taxonomy {
        static schema: ObjectSchema = {
            name: $.taxonomy,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                category: $.category,
                subCategory: $.category,
                subSubCategory: $.category,
                materializedPath: $.string,
                selectors: $.listOf.string,
                itemType: $.itemtype,
                activity: $.activity
            }
        };
        _id: ObjectId;
        category?: Category;
        subCategory?: Category;
        subSubCategory?: Category;
        materializedPath: string;
        selectors: string[];
        itemType?: ItemType;
        activity?: Activity;
        constructor() {
            this._id = new ObjectId();
            this.materializedPath = '';
            this.selectors = [];
        }
    }
}
namespace Supplies {
    export class Supplies {
        static schema: ObjectSchema = {
            name: $.bin,
            primaryKey: '_id',
            properties: {
                _id: $.objectId
            }
        };
    }
}
namespace Storages {
    export class Address {
        static schema: ObjectSchema = {
            name: 'address',
            embedded: true,
            properties: {
                street: $.optional.string,
                suite: $.optional.string,
                city: { type: $.string, default: '' },
                state: { type: $.string, default: 'CA' },
                country: { type: $.string, default: 'US' },
                postalCode: $.optional.string
            }
        };
        street?: string;
        suite?: string;
        city: string;
        state: Provinces;
        country: Country;
        postalCode?: string;
        constructor() {
            this.city = '';
            this.state = 'CA';
            this.country = 'US';
        }
    }
    export class SelfStorage {
        static schema: ObjectSchema = {
            name: $.selfStorage,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                website: $.optional.string,
                facilities: {
                    type: $.linkingObjects,
                    objectType: $.facility,
                    property: 'selfStorage'
                }
            }
        };
        _id: ObjectId;
        name: string;
        website?: string;
        facilities: Facility[];
        constructor() {
            this.name = '';
            this._id = new ObjectId();
            this.facilities = [];
        }
    }
    export class Facility {
        static schema: ObjectSchema = {
            name: 'facility',
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                selfStorage: SelfStorage.schema.name,
                address: Address.schema.name,
                facilityNumber: $.optional.string,
                email: $.optional.string,
                phone: $.optional.string,
                units: {
                    type: $.linkingObjects,
                    objectType: $.rentalUnit,
                    property: $.facility
                }
            }
        };
        _id: ObjectId;
        address: Address;
        selfStorage?: SelfStorage;
        facilityNumber?: string;
        email?: string;
        phone?: string;
        units: RentalUnit[];
        constructor() {
            this._id = new ObjectId();
            this.address = new Address();
            this.units = [];
        }
        get name() {
            return [this.selfStorage?.name ?? '', [this.address.city, this.address.state].join(', '), this.address.street?.split(' ').slice(1).join(' ')].join(
                ' - '
            );
        }
    }
    export class SquareFootage {
        static schema: ObjectSchema = {
            name: $.squareFootage,
            embedded: true,
            properties: {
                length: $.length,
                width: $.length
            }
        };
        length: Length;
        width: Length;
        get displayAs() {
            return `${this.length.displayAs} x ${this.width.displayAs}`;
        }
        constructor() {
            this.length = new Length();
            this.width = new Length();
        }
    }
    export class RentalUnit {
        static schema: ObjectSchema = {
            name: $.rentalUnit,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                facility: Facility.schema.name,
                unit: $.string,
                size: SquareFootage.schema.name,
                purchase: {
                    type: $.linkingObjects,
                    objectType: $.purchase,
                    property: 'rentalUnit'
                }
            }
        };
        _id: ObjectId;
        facility?: Facility | undefined;
        unit: string;
        size: SquareFootage;
        constructor() {
            this._id = new ObjectId();
            this.size = new SquareFootage();
            this.unit = '';
        }
        get name() {
            return [this.facility?.name, this.unit].join(' - ');
        }
    }
}

export const measurements = {
    neck: ['in'],
    shoulders: ['in'],
    arms: ['in'],
    chest: ['in'],
    jacket: ['in', ['S', 'R', 'L']],
    bust: ['in'],
    hem: ['in'],
    body: ['in'],
    inseam: ['in'],
    waist: ['in'],
    leg: ['in'],
    foot: ['in']
};

/**
 * @description A numeric value with a unit representation for context.
 * @author Robert Kalaf Jr.
 * @date 05/19/2022
 * @export
 * @class Dimension
 * @see dto
 */

export function getCurrentPartitionValue() {
    const cu = $currentUser();
    return cu?.profile.email ?? 'unknown';
}

export const schema = [
    SelfStorage,
    Facility,
    Address,
    RentalUnit,
    Length,
    SquareFootage,
    FileAlloc,
    FileItem,
    Purchase,
    Cost,
    Company,
    Brand,
    Category,
    Taxonomy,
    VerifiedBrand,
    ItemType,
    Activity
];

export function createFileAlloc(realm: Realm, name: string, parentName: string, child: string) {
    const parent = realm.objects<FileAlloc>($.fsAlloc).filtered(`materializedPath == '/${parentName}'`)[0];
    const obj = {
        _id: new Realm.BSON.ObjectId(),
        name,
        originalName: name,
        materializedPath: [parent.materializedPath, name].join('/'),
        parent
    };
    const gpobj = {
        _id: new Realm.BSON.ObjectId(),
        name: child,
        originalName: child,
        materializedPath: [obj.materializedPath, child].join('/'),
        parent: obj
    };
    let result: FileAlloc | undefined;
    realm.write(() => {
        result = realm.create<FileAlloc>($.fsAlloc, gpobj as any);
    });
    return result;
}
