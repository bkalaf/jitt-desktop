/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-namespace */
import { ObjectSchema } from 'realm';
import { ObjectId } from 'bson';
import { Provinces } from './enums/province';
import { Country } from './enums/country';
import { LengthUOMS } from './enums/lengthUOM';
import { AuctionSites } from './enums/auctionSite';
import { MimeTypes } from './enums/mimeTypes';
import { capitalize, isLower, isUpper } from '../common/text';
import { now } from '../aggregator';
import { LinkedObject, LinkingObjects } from './LinkingObjects';
import { $currentUser } from '../components/globals';
import { MeasuresOf } from './enums/measuresOf';
import { ActivityActions, ActivityScopes, BarcodeType, CapacityUOMS, Colors, Conditions, MaterialTypes, StageTypes, WeightUOMS } from './enums';
import { Select } from '../components/forms/elements/Select';
import { Input } from '../components/forms/elements/Input';
import { Fieldset } from '../components/forms/elements/Fieldset';
import { Output } from '../components/forms/elements/Output';
import { Product } from 'electron';
import { MeasurementFor } from './enums/measurementFor';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { Textarea } from '../components/forms/elements/Textarea';
import { FieldsetHTMLAttributes } from 'react';
import { $ } from './$';
import { DbCellInputProps } from './DbCellInputProps';
import { DbDescriptor } from './DbDescriptor';
import { IDbTable } from './IDbTable';
import { DbSort } from './DbSort';
import { DbTable } from './DbTable';
import { DbColumn } from './DbColumn';
import { DbDataType } from './DbDataType';
import { DbInputProps } from './DbInputProps';
import { DbSelectProps } from './DbSelectProps';
import { DbTextAreaProps } from './DbTextAreaProps';
import { DbFieldSetProps } from './DbFieldSetProps';
import { DbOutputProps } from './DbOutputProps';

// export const $$ = {
//     ...objectMap((x: string) => decapitalize(x.split('-').map(capitalize).join('')))(allTypes)
// };

export class Length {
    static schema: ObjectSchema = {
        name: $.length,
        embedded: true,
        properties: {
            value: { type: $.double, default: 0 },
            uom: { type: $.string, default: 'in' }
        }
    };
}

function createColumns(obj: any) {
    return obj.fields.map((x: any) => x.name);
}
export namespace Admin {
    /**
     * @description Represents a repeating task, usually for maintenance, either completed or scheduled.
     * @author Robert Kalaf Jr.
     * @date 05/19/2022
     * @export
     * @class Activity
     * @see dto
     */
    export class Activity {
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                action: string;
                scope: string;
                when: string;
                isComplete: boolean;
                isScheduled: boolean;
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id),
                when: new Date(Date.parse(input.when))
            };
        }
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
                    property: 'activity'
                },
                categories: {
                    type: $.linkingObjects,
                    objectType: $.category,
                    property: 'activity'
                },
                taxonomy: {
                    type: $.linkingObjects,
                    objectType: $.taxonomy,
                    property: 'activity'
                }
            }
        };
        _id: ObjectId;
        action: ActivityActions;
        scope: ActivityScopes;
        when: Date;
        isComplete: boolean;
        isScheduled: boolean;
        brands: LinkingObjects<Products.Brand>;
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

export namespace Auctions {
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
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                cost: any;
                closeDate: string;
                auctionSite: string;
                auctionId: string;
                invoiceId: string;
                invoice: {
                    _id: string;
                };
                rentalUnit: {
                    _id: string;
                };
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id),
                invoice: toID(realm, input, 'invoice', 'fs-item'),
                rentalUnit: toID(realm, input, 'rentalUnit', 'rental-unit')
            };
        }
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

export namespace Details {
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
function textToBin(text: string) {
    return Array.from(text)
        .reduce((acc: any[], char: string) => acc.concat(char.charCodeAt(0).toString(2)), [])
        .map((bin) => '0'.repeat(8 - bin.length) + bin);
}
export namespace Files {
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
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                name: string;
                originalName: string;
                parent: {
                    _id: string;
                };
                materializedPath: string;
                fsItem:
                    | {
                          _id: string;
                      }
                    | undefined;
                fileCreation?: Date;
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id),
                parent: toID(realm, input, 'parent', 'fs-alloc'),
                fsItem: toID(realm, input, 'fsItem', 'fs-item')
            };
        }
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

        get path(): string {
            const obj: any = this;
            return [obj.parent?.path ?? '', obj.name].join('/');
        }
        get isFolder(): string {
            const obj: any = this;

            return (obj.fsItem == null).toString();
        }
        get isFile(): string {
            const obj: any = this;

            return (!(obj.fsItem == null)).toString();
        }
        get count(): number {
            const obj: any = this;

            return obj.content.length;
        }
        get size(): number {
            const obj: any = this;

            return obj.content.map((s: any) => s.size).reduce((x: any, y: any) => x + y, 0);
        }
        get type(): string {
            const obj: any = this;

            if (obj.fsItem == null) return 'folder';
            if (obj.fsItem.isInvoice === 'true') return 'invoice';
            if (obj.fsItem.isPhoto === 'true') return 'photo';
            if (obj.fsItem.isDoc === 'true') return 'document';
            if (obj.fsItem.isReceipt === 'true') return 'receipt';
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

        static convertTo(realm: Realm, file: string) {
            const data = fs.readFileSync(file).buffer;
            const size = fs.lstatSync(file).size;
            const mimeType = path.extname(file);
            const input = {
                data,
                size,
                mimeType,
                _id: new ObjectId()
            };
            realm.write(() => {
                realm.create('fs-item', input);
            });
        }
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                data: string;
                size: string;
                mimeType: string;
            }
        ) {
            console.log(`data.length: ${input.data.length} size: ${input.size}`);
            const fsAlloc: any = realm.objects<FileAlloc>('fs-alloc').filtered('fsItem._id == $0', new ObjectId(input._id))[0];
            const filename = [`/home/bobby/.config/jitt-desktop/fs`, fsAlloc.materializedPath].join('/');
            console.log(filename);
            const buffer = fs.readFileSync(filename);
            return {
                ...input,
                _id: new ObjectId(input._id),
                data: buffer
            };
        }

        static schema: ObjectSchema = {
            name: $.fsItem,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                fsAlloc: {
                    type: $.linkingObjects,
                    objectType: $.fsAlloc,
                    property: 'fsItem'
                },
                data: $.optional.data,
                size: $.int,
                mimeType: $.optional.string,
                invoice: {
                    type: $.linkingObjects,
                    objectType: $.purchase,
                    property: 'invoice'
                }
                // TODO add doc
                // TODO add photo
                // TODO add receipt
            }
        };

        get name() {
            // const arr = Object.entries(this.fsAlloc ?? {})[0][1],
            // const arr1 = this.fsAlloc[0],
            // console.log("ARR1", arr1);
            // const arr2 = Object.entries(this.fsAlloc[0]);
            // console.log('ARR2', arr2);
            // console.log('ARR', arr);
            const obj: any = this;
            return obj.fsAlloc[0].name;
        }
        get isAssigned() {
            const obj: any = this;

            return (obj.invoice[0] != null).toString();
        }
        get isInvoice() {
            const obj: any = this;

            return FileItem.INVOICE_REGEX.test(obj.fsAlloc[0]?.path ?? '/').toString();
        }
        get isPhoto() {
            const obj: any = this;

            return FileItem.PHOTO_REGEX.test(obj.fsAlloc[0]?.path ?? '/').toString();
        }
        get isReceipt() {
            const obj: any = this;

            return FileItem.RECEIPT_REGEX.test(obj.fsAlloc[0]?.path ?? '/').toString();
        }
        get isDoc() {
            const obj: any = this;

            return FileItem.DOC_REGEX.test(obj.fsAlloc[0]?.path ?? '/').toString();
        }
    }
    /**
     * @description
     * @author Robert Kalaf Jr.
     * @date 05/20/2022
     * @export
     * @class ImageStage
     * @property {StageTypes} stage
     * @property {FileAlloc} fsAlloc
     * @property {boolean} canPublish
     * @property {string[]} columns
     */
    export class ImageStage {
        static schema: ObjectSchema = {
            name: $.imageStage,
            embedded: true,
            properties: {
                stage: { type: $.int, default: 0 },
                fsAlloc: $.fsAlloc,
                canPublish: { type: $.bool, default: false }
            }
        };
        stage: StageTypes;
        fsAlloc?: FileAlloc;
        canPublish: boolean;
        constructor() {
            this.stage = 0;
            this.canPublish = false;
        }
    }
    export class PhotoPack {
        static schema: ObjectSchema = {
            name: $.photoPack,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                versions: $.dictionaryOf.imageStage,
                item: {
                    type: $.linkingObjects,
                    objectType: $.item,
                    property: 'photoPack'
                }
            }
        };
        _id: ObjectId;
        versions: ImageStage[];
        item?: LinkedObject<Inventory.Item>;
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
                fsAlloc: $.fsAlloc,
                product: {
                    type: $.linkingObjects,
                    objectType: $.product,
                    property: 'productDocumentation'
                }
            }
        };
        _id: ObjectId;
        fsAlloc?: FileAlloc;
        product?: LinkedObject<Products.Product>;
        constructor() {
            this._id = new ObjectId();
        }
    }
}
export namespace Inventory {
    // export class SKU {
    //     static schema: ObjectSchema = {
    //         name: $.SKU,
    //         primaryKey: '_id',
    //         properties: {
    //             _id: $.objectId,
    //             barcode: $.barcode,
    //             type: $.optional.string,
    //             fixture: {
    //                 type: $.linkingObjects,
    //                 objectType: $.fixture,
    //                 property: 'sku'
    //             },
    //             bin: {
    //                 type: $.linkingObjects,
    //                 objectType: $.bin,
    //                 property: 'sku'
    //             },
    //             product: {
    //                 type: $.linkingObjects,
    //                 objectType: $.product,
    //                 property: 'sku'
    //             },
    //             photo: {
    //                 type: $.linkingObjects,
    //                 objectType: $.photo,
    //                 property: 'sku'
    //             },
    //             images: {
    //                 type: $.linkingObjects,
    //                 objectType: $.fsItem,
    //                 property: 'sku'
    //             }
    //         }
    //     };
    //     _id: ObjectId;
    //     barcode?: Products.Barcode;
    //     fixture: LinkedObject<Fixture>;
    //     bin: LinkedObject<Bin>;
    //     product: LinkedObject<Products.Product>;
    //     constructor() {
    //         this._id = new ObjectId();
    //         this.fixture = [],
    //         this.bin = [],
    //         this.product = [],
    //     }
    //     get type(): SKUTypes | undefined {
    //         return this.bin.length > 0 ? 'bin' : this.product.length > 0 ? 'product' : this.fixture.length > 0 ? 'fixture' : undefined;
    //     }
    // }
    export class Barcode {
        static schema: ObjectSchema = {
            name: $.barcode,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                barcode: $.string,
                valid: $.bool,
                type: $.optional.string,
                description: $.optional.string,
                bin: {
                    type: $.linkingObjects,
                    objectType: $.bin,
                    property: 'barcode'
                },
                fixture: {
                    type: $.linkingObjects,
                    objectType: $.fixture,
                    property: 'barcode'
                },
                product: $.product,
                item: {
                    type: $.linkingObjects,
                    objectType: $.item,
                    property: 'barcode'
                }
            }
        };
        setBarcode = (barcode: string) => {
            (this as any).barcode = barcode;
            (this as any).type = this.classify();
            const [isValid] = this.calculateCheckDigit() ?? [false];
            (this as any).valid = isValid;
        };

        classify = (): BarcodeType | undefined => {
            switch ((this as any).barcode.length) {
                case 8:
                    return 'UPCA';
                case 10:
                    return 'ISBN10';
                case 12:
                    return 'UPCE';
                case 13:
                    return (this as any).barcode.startsWith('978') || (this as any).barcode.startsWith('979') ? 'ISBN13' : 'EAN13';

                default:
                    return (this as any).barcode.split('').some((x: string) => isLower(x) || isUpper(x)) ? 'ASIN' : undefined;
            }
        };
        MULTIPLIERS: number[] = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
        calculateCheckDigit = (): [passed: boolean, actual: number, expected: number] | undefined => {
            if ((this as any).type === 'ASIN' || (this as any).type === 'ELID' || (this as any).type == null) return undefined;
            const [actual, ...remain] = (this as any).barcode.padStart(13, '0').split('').reverse();
            const head = remain.reverse();
            const summed = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3]
                .map((x: number, ix: number) => parseInt(head[ix], 10) * x)
                .reduce((pv: number, cv: number) => pv + cv, 0);
            const modulo = summed % 10;
            const subtracted = 10 - modulo;
            const expected = subtracted === 10 ? 0 : subtracted;
            return [parseInt(actual, 10) === expected, parseInt(actual, 10), expected] as [passed: boolean, actual: number, expected: number];
        };
    }

    
    export class Fixture {
        static schema: ObjectSchema = {
            name: $.fixture,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                barcode: $.barcode,
                notes: $.optional.string,
                bins: {
                    type: $.linkingObjects,
                    objectType: $.bin,
                    property: 'fixture'
                }
            }
        };
    }
    export class Bin {
        static schema: ObjectSchema = {
            name: $.bin,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                barcode: $.barcode,
                notes: $.optional.string,
                fixture: $.fixture
            }
        };
    }
    // export class Scan {
    //     static schema: ObjectSchema = {
    //         name: $.scan,
    //         primaryKey: '_id',
    //         properties: {
    //             _id: $.objectId,
    //             sku: $.SKU,
    //             bin: $.bin,
    //             item: $.item,
    //             timestamp: $.int,
    //             user: $.string
    //         }
    //     };
    //     _id: ObjectId;
    //     sku?: SKU;
    //     bin?: Bin;
    //     timestamp: number;
    //     user: string;
    //     constructor() {
    //         this._id = new ObjectId();
    //         this.timestamp = Date.now();
    //         this.user = getCurrentPartitionValue();
    //     }
    // }
    export class Item {
        static schema = {
            name: $.item,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                product: $.product,
                barcode: $.optional.barcode,
                colors: $.listOf.string,
                condition: { type: $.string, default: 'Likenew' },
                defects: $.listOf.string,
                features: $.listOf.string,
                tested: $.optional.date,
                draft: $.optional.draft,
                photoPack: $.photoPack
            }
        };
        _id: ObjectId;
        product?: Products.Product;
        colors: string[];
        condition: Conditions;
        defects: string[];
        features: string[];
        tested?: Date;
        barcode?: Inventory.Barcode;
        draft?: Listings.Draft;
        photoPack?: Files.PhotoPack;
        constructor() {
            this._id = new ObjectId();
            this.colors = [];
            this.condition = 'Likenew';
            this.defects = [];
            this.features = [];
        }
    }
}
export namespace Listings {
    export class Draft {
        static schema: ObjectSchema = {
            name: $.draft,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                marketplace: { type: $.string, default: 'mercari.com' }
            }
        };
    }
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
export namespace Materials {
    export class PercentOf {
        static schema: ObjectSchema = {
            name: $.percentOf,
            embedded: true,
            properties: {
                materialType: $.string,
                percent: { type: $.double, default: 100 }
            }
        };
        materialType: MaterialTypes;
        percent: number;
        constructor() {
            this.percent = 100;
            this.materialType = 'C';
        }
    }
    export class Section {
        static schema: ObjectSchema = {
            name: $.section,
            embedded: true,
            properties: {
                name: $.optional.string,
                segments: $.listOf.percentOf
            }
        };
        name?: string;
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
    export class Composition {
        static schema: ObjectSchema = {
            name: $.composition,
            embedded: true,
            properties: {
                sections: $.listOf.section
            }
        };
        sections: Section[];
        constructor() {
            this.sections = [];
        }
    }
}
export namespace Pipelines {
    export function addToLabelPrintQueue(realm: Realm, barcode: IBarcode) {
        const fixture = realm.objects<IBarcode>('barcode').filtered('@links.fixture.@count === 1');
        const bin = realm.objects<IBarcode>('barcode').filtered('@links.bin.@count === 1');
        console.log(`fixture barcodes`, fixture);
        console.log(`bin barcodes`, bin);

        const _id = new ObjectId();
        if (fixture.filtered('barcode == $0', barcode.barcode).length > 0) {
            const item = realm.objects<IFixture>('fixture').filtered('barcode == $0', barcode)[0];
            realm.write(() => {
                realm.create('label-print-queue', {
                    _id,
                    name: item.name,
                    barcode,
                    notes: item.notes,
                    type: 'fixture'
                })
            });
        }
        if (bin.filtered('barcode == $0', barcode.barcode).length > 0) {
            const item = realm.objects<IBin>('bin').filtered('barcode == $0', barcode)[0];
            realm.write(() => {
                realm.create('label-print-queue', {
                    _id,
                    name: item.name,
                    barcode,
                    notes: item.notes,
                    type: 'bin'
                })
            });
        }
    }
    export class LabelPrintQueue {
        static schema: ObjectSchema = {
            name: 'label-print-queue',
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                barcode: $.barcode,
                name: $.string,
                notes: $.string,
                type: $.string
            }
        }
    }
}

// export namespace Pipelines {
//     export class BarcodePipeline {
//         static schema: ObjectSchema = {
//             name: $.barcodePipeline,
//             primaryKey: '_id',
//             properties: {
//                 _id: $.objectId,
//                 barcode: $.barcode,
//                 timestamp: $.int,
//                 user: $.string
//             }
//         };
//         _id: ObjectId;
//         barcode?: Barcode;
//         timestamp: number;
//         user: string;
//         constructor() {
//             this._id = new ObjectId();
//             this.timestamp = Date.now();
//             this.user = getCurrentPartitionValue();
//         }
//     }
//     /**
//      * @description
//      * @author Robert Kalaf Jr.
//      * @date 05/19/2022
//      * @export
//      * @class DraftPipeline
//      */
//     export class DraftPipeline {}
//     /**
//      * @description
//      * @author Robert Kalaf Jr.
//      * @date 05/19/2022
//      * @export
//      * @class ImagePipeline
//      */
//     export class ImagePipeline {
//         static schema: ObjectSchema = {
//             name: $.imagePipeline,
//             primaryKey: '_id',
//             properties: {
//                 _id: $.objectId,
//                 photo: $.photo
//             }
//         };
//     }
//     /**
//      * @description
//      * @author Robert Kalaf Jr.
//      * @date 05/19/2022
//      * @export
//      * @class PromotionPipeline
//      */
//     export class PromotionPipeline {}
//     /**
//      * @description
//      * @author Robert Kalaf Jr.
//      * @date 05/19/2022
//      * @export
//      * @class SkuPipeline
//      */
//     export class SkuPipeline {
//         static schema: ObjectSchema = {
//             name: $.skuPipeline,
//             primaryKey: '_id',
//             properties: {
//                 _id: $.objectId,
//                 sku: $.sku,
//                 brandText: $.optional.string,
//                 descriptionText: $.optional.string,
//                 createdOn: $.optional.date,
//                 printedOn: $.optional.date
//             }
//         };
//         _id: ObjectId;
//         sku?: SKU;
//         brandText?: string;
//         descriptionText?: string;
//         createdOn?: Date;
//         printedOn?: Date;
//         constructor() {
//             this.createdOn = now();
//             this._id = new ObjectId();

//             // TODO finish up grabbing linked data for label
//             // this.sku?.product.
//         }

//         markPrinted(): void {
//             this.printedOn = now();
//         }
//     }
// }

export namespace Products {
    export class Brand {
        static schema: ObjectSchema = {
            name: $.brand,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string,
                alias: $.listOf.string,
                productLines: {
                    type: $.linkingObjects,
                    objectType: $.productLine,
                    property: 'brand'
                },
                company: $.company,
                verifiedBrand: $.verifiedBrand,
                activity: $.activity
            }
        };
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
    }
    export class Dimension {
        static schema: ObjectSchema = {
            name: $.dimension,
            embedded: true,
            properties: {
                measureOf: $.string,
                value: { type: $.double, default: 0 },
                uom: { type: $.optional.string }
            }
        };
    }
    export class ItemType {
        static schema: ObjectSchema = {
            name: $.itemType,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                taxonomy: {
                    type: $.linkingObjects,
                    objectType: $.taxonomy,
                    property: 'itemType'
                },
                classification: $.taxonomy,
                name: $.string,
                details: $.listOf.string,
                supertype: $.itemType
            }
        };
    }
    export class Measurement {
        static schema: ObjectSchema = {
            name: $.measurement,
            embedded: true,
            properties: {
                of: $.listOf.string,
                measures: $.listOf.string,
                uoms: $.listOf.string
            }
        };
        of: MeasurementFor;
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
                shortDescription: $.string,
                productLine: $.productLine,
                dims: $.listOf.dimension,
                measurements: $.listOf.measurement,
                composition: $.composition,
                origin: $.optional.string,
                barcodes: {
                    type: $.linkingObjects,
                    objectType: $.barcode,
                    property: $.product
                },
                productDocumentation: $.productDocumentation
            }
        };
    }
    export class ProductLine {
        static schema: ObjectSchema = {
            name: $.productLine,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                brand: $.brand,
                name: $.string,
                products: {
                    type: $.linkingObjects,
                    objectType: $.product,
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
// export namespace Sales {
//     export class Sale {
//         static schema: ObjectSchema = {
//             name: $.sale,
//             embedded: true,
//             properties: {}
//         };
//     }

//     export class ShipmentStatus {
//         static schema: ObjectSchema = {
//             name: $.shipmentStatus,
//             embedded: true,
//             properties: {
//                 carrier: $.string,
//                 trackingNumber: $.string,
//                 shipmentCreatedOn: $.date,
//                 shippedOn: $.date,
//                 eta: $.date
//             }
//         };
//     }
//     export class Sale {
//         static schema: ObjectSchema = {
//             name: $.fullfillment,
//             primaryKey: '_id',
//             properties: {
//                 _id: $.objectId,
//                 draft: $.draft,
//                 sellingPrice: $.sellingPrice,
//                 fulfillment: $.fulfillment
//             }
//         };
//     }
// }

// export namespace Reflection {
//     export class TypeData {
//         static schema: ObjectSchema = {
//             name: 'type-data',
//             primaryKey: '_id',
//             properties: {
//                 _id: $.objectId,
//                 kind: $.string,
//                 name: $.string,
//                 embedded: $.optional.bool,
//                 listType: $.optional.string,
//                 fields: 'field-data[]',
//                 Header: $.optional.string,
//                 headerProps: $.dictionaryOf.string,
//                 MutableRow: $.optional.string,
//                 ImmutableRow: $.optional.string,
//                 rowProps: $.dictionaryOf.string
//             }
//         };
//         name = '';
//     }
//     export class FieldData {
//         static schema: ObjectSchema = {
//             name: 'field-data',
//             embedded: true,
//             properties: {
//                 name: $.listOf.string,
//                 datatype: $.string,
//                 owningType: 'type-data',
//                 readOnly: { type: $.bool, default: false },
//                 required: { type: $.bool, default: false },
//                 multiple: { type: $.bool, default: false },
//                 getLength: { type: $.bool, default: false },
//                 callToText: { type: $.bool, default: false },
//                 excludeInsert: { type: $.bool, default: false },
//                 excludeGrid: { type: $.bool, default: false },
//                 excludeEdit: { type: $.bool, default: false },
//                 excludeTabular: { type: $.bool, default: false },
//                 descriptor: 'mixed',
//                 displayName: $.string,
//                 minLength: $.optional.int,
//                 maxLength: $.optional.int,
//                 min: $.optional.int,
//                 max: $.optional.int,

//                 pattern: $.optional.string,
//                 step: $.optional.double,
//                 defaultValue: 'mixed',
//                 placeholder: $.optional.string,
//                 enumMap: $.dictionaryOf.string,
//                 lookupMap: $.dictionaryOf.string,
//                 type: $.optional.string,
//                 size: $.optional.int,
//                 icon: 'mixed',

//                 Control: $.optional.string,
//                 Cell: $.optional.string,
//                 Label: $.optional.string,
//                 controlProps: 'mixed',
//                 cellProps: 'mixed',
//                 labelProps: 'mixed'
//             }
//         };
//     }
// }

export function toID(realm: Realm, obj: Record<string, any>, property: string, collection = '') {
    console.log(`toID`, obj[property]);
    if (obj[property] == null) return undefined;
    return realm.objectForPrimaryKey(collection, new ObjectId(obj[property]._id));
}
export namespace Scrapes {
    export class VerifiedBrand {
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id)
            };
        }
        static schema: ObjectSchema = {
            name: $.verifiedBrand,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                name: $.string
            }
        };
    }
    export class Category {
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                name: string;
                website?: string;
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id)
            };
        }
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
        activity?: Admin.Activity;
        constructor() {
            this._id = new ObjectId();
            this.id = '';
            this.label = '';
            this.node = 0;
        }
    }

    export class Taxonomy {
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                category: { _id: string };
                subCategory: { _id: string };
                subSubCategory: { _id: string };
                itemType?: { _id: string };
                activity?: { _id: string };
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id),
                category: toID(realm, input, 'category', 'category'),
                subCategory: toID(realm, input, 'subCategory', 'category'),
                subSubCategory: toID(realm, input, 'subSubCategory', 'category'),
                itemType: toID(realm, input, 'itemType', 'item-type'),
                activity: toID(realm, input, 'activity', 'activity')
            };
        }
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
                itemType: $.itemType,
                activity: $.activity
            }
        };
    }
}
export namespace Supplies {
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

export namespace Storages {
    export class Address {
        static schema: ObjectSchema = {
            name: $.address,
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
    }
    export class SelfStorage {
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                name: string;
                website?: string;
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id)
            };
        }
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
    }
    export class Facility {
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                selfStorage: {
                    _id: string;
                };
                address: {
                    street: string;
                    suite: string;
                    city: string;
                    state: string;
                    country: string;
                    postalCode: string;
                };
                facilityNumber?: string;
                email?: string;
                phone?: string;
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id),
                selfStorage: toID(realm, input, 'selfStorage', 'self-storage')
            };
        }
        static schema: ObjectSchema = {
            name: $.facility,
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
                    property: 'facility'
                }
            }
        };
        get name() {
            const obj = this as any;
            return [obj.selfStorage?.name ?? '', [obj.address.city, obj.address.state].join(', '), obj.address.street?.split(' ').slice(1).join(' ')].join(
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
    }

    // const proto = Object.getPrototypeOf(SquareFootage);
    // console.log(Object.getPrototypeOf(new SquareFootage()));
    // console.log(Object.getOwnPropertyNames(SquareFootage));
    // console.log(SquareFootage.constructor);
    // console.log(Object.getPrototypeOf(SquareFootage.constructor));
    // console.log(Object.getOwnPropertyNames(proto));
    // console.log(Object.getOwnPropertyDescriptor(proto, 'toText'));
    // console.log(Object.getOwnPropertyDescriptor(SquareFootage, 'toText'));

    // const sq = new Storages.SquareFootage();
    // console.log(Object.getOwnPropertyNames(sq));
    // console.log(Object.getOwnPropertyDescriptors(sq));
    // console.log(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(sq)));

    // console.log(Object.create(SquareFootage));
    // console.log(Object.getPrototypeOf(Object.create(SquareFootage)));
    // console.log(Object.getOwnPropertyDescriptors(Object.create(SquareFootage)));
    // console.log(Object.getOwnPropertyDescriptors(SquareFootage));

    // console.log('*******');
    // console.log(Object.create(SelfStorage.constructor));
    // console.log(Object.getPrototypeOf(Object.create(SquareFootage)));
    // console.log(Object.getOwnPropertyDescriptors(Object.create(SquareFootage)));
    // console.log(Object.getOwnPropertyDescriptors(SquareFootage));
    // const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(new SquareFootage()), 'toText');
    // const funcText = descriptor?.get?.toString() ?? '';
    // const fd = {
    //     length: { displayAs: '10 ft' },
    //     width: { displayAs: '50 ft' }
    // };
    // const t = '('.concat(funcText.replace('get ', 'function ').concat(`).bind(fd)()`));
    // console.log(t);
    // console.log(eval(t));
    export class RentalUnit {
        static async convertFrom(
            realm: Realm,
            input: {
                _id: string;
                facility: {
                    _id: string;
                };
                unit: string;
                size: any;
            }
        ) {
            return {
                ...input,
                _id: new ObjectId(input._id),
                facility: toID(realm, input, 'rentalUnit', 'rental-unit')
            };
        }
        static schema: ObjectSchema = {
            name: $.rentalUnit,
            primaryKey: '_id',
            properties: {
                _id: $.objectId,
                facility: $.facility,
                unit: $.string,
                size: $.squareFootage,
                purchase: {
                    type: $.linkingObjects,
                    objectType: $.purchase,
                    property: 'rentalUnit'
                }
            }
        };
        get name() {
            const obj = this as any;
            return [
                obj.facility?.selfStorage.name,
                obj.facility?.address.city,
                obj.facility?.address.state,
                obj.facility?.address.street?.split(' ').slice(1).join(' '),
                obj.unit
            ].join(' - ');
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

export function List() {
    return <></>;
}
export function Radio() {
    return <></>;
}
export type IFieldsetProps = {
    label: string;
} & FieldsetHTMLAttributes<HTMLFieldSetElement>;

export function FieldsetElement(props: IFieldsetProps) {
    const { label, children, ...remain } = props;
    return (
        <fieldset {...remain}>
            <legend>{label}</legend>
            {children}
        </fieldset>
    );
}
export const controlTypes = {
    Input: Input,
    Radio: Radio,
    Select: Select,
    List: List,
    Textarea: Textarea,
    Output: Output,
    Fieldset: Fieldset
};
export function IconCell(props: any) {
    return <></>;
}
export function ValueCell(props: any) {
    return <></>;
}
export function LookupCell(props: any) {
    return <></>;
}
export function SummaryCell(props: any) {
    return <></>;
}
export function ExpandCell(props: any) {
    return <></>;
}
export const cellTypes = {
    Icon: IconCell,
    Value: ValueCell,
    Summary: SummaryCell,
    Lookup: LookupCell,
    Expand: ExpandCell
};
export type CellType = keyof typeof cellTypes;
export type ControlType = keyof typeof controlTypes;

export const schema = [
    DbInputProps,
    DbSelectProps,
    DbFieldSetProps,
    DbOutputProps,
    DbTextAreaProps,
    DbCellInputProps,
    DbDataType,
    DbColumn,
    DbTable,
    DbSort,
    DbDescriptor,
    Admin.Activity,
    Auctions.Cost,
    Auctions.Purchase,
    Files.Expense,
    Files.FileAlloc,
    Files.FileItem,
    Files.ImageStage,
    Files.PhotoPack,
    Files.ProductDocumentation,
    Length,
    Inventory.Barcode,
    Inventory.Fixture,
    Inventory.Bin,
    Inventory.Item,
    Listings.Draft,
    Materials.PercentOf,
    Materials.Section,
    Materials.Composition,
    Products.Brand,
    Products.Company,
    Products.Dimension,
    Products.ItemType,
    Products.Measurement,
    Products.Product,
    Products.ProductLine,
    Scrapes.Category,
    Scrapes.Taxonomy,
    Scrapes.VerifiedBrand,
    Storages.Address,
    Storages.Facility,
    Storages.RentalUnit,
    Storages.SelfStorage,
    Storages.SquareFootage
];

export function createFileAlloc(realm: Realm, name: string, parentName: string, child: string) {
    const parent: any = realm.objects<Files.FileAlloc>($.fsAlloc).filtered(`materializedPath == '/${parentName}'`)[0];
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
    let result: Files.FileAlloc | undefined;
    realm.write(() => {
        result = realm.create<Files.FileAlloc>($.fsAlloc, gpobj as any);
    });
    return result;
}
