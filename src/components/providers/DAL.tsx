import { faBinoculars, faKey, faSquare, faSquareCheck } from '@fortawesome/pro-duotone-svg-icons';
import { SortDescriptor } from 'realm';
import { countries } from '../../data/enums/country';
import { lengthUOMS } from '../../data/enums/lengthUOM';
import { provinces } from '../../data/enums/province';
import { Fieldset, ManyOf } from '../forms/elements/Fieldset';
import { Input } from '../forms/elements/Input';
import { Output } from '../forms/elements/Output';
import { Select } from '../forms/elements/Select';
import { IFieldInfo } from '../../types/metadata/IFieldInfo';
import { $ } from '../../data/$';

import {
    activityActions,
    activityScopes,
    auctionSites,
    barcodeTypes,
    capacityUOMS,
    conditions,
    materialTypes,
    measuresOf,
    mimeTypes,
    stageTypes,
    weightUOMS
} from '../../data/enums';
import { $mk } from '../../data/Builder';
import { measurementFor } from '../../data/enums/measurementFor';
import { objectMap } from '../../common';
export type ColumnScope = [string, string | undefined];

// import './../../data/index';

// export const $DAL = Object.fromEntries(
//     [
//         Storages.SelfStorage,
//         Storages.Facility,
//         Storages.Address,
//         Storages.RentalUnit,
//         // Length,
//         // Storages.SquareFootage,
//         // Files.FileAlloc,
//         // Files.FileItem,
//         // Auctions.Purchase,
//         // Auctions.Cost,
//         // Products.Company,
//         // Products.Brand,
//         // Scrapes.Category,
//         // Scrapes.Taxonomy,
//         // Scrapes.VerifiedBrand,
//         // Products.ItemType,
//         // Admin.Activity
//     ].map((x: any) => {
//         console.log(x);
//         return [
//         x.schema.name,
//         {
//             sorted: x.sorted,
//             columns: x.columns,
//             fields: x.fields
//         }
//     ]
//     })
// );

export function allUnitsOfMeasure(): Record<string, string> {
    return { ...lengthUOMS, ...capacityUOMS, ...objectMap<string[], string>((x) => x[1])(weightUOMS as Record<string, string[]>) };
}
export const DAL: Record<
    string,
    {
        // headers: string[];
        columns: string[];
        // row: (x: any) => Array<string | undefined | Array<any>>;
        sorted: SortDescriptor[];
        fields: IFieldInfo[];
    }
> = {
    ['activity']: {
        columns: ['_id', 'action', 'scope', 'when', 'isComplete', 'isScheduled', 'brands', 'categories', 'taxonomy'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Select,
                enumMap: activityActions,
                name: 'action'
            },
            {
                el: Select,
                enumMap: activityScopes,
                name: 'scope'
            },
            {
                el: Input,
                name: 'when',
                type: 'datetime'
            },
            $mk.checkbox()('isComplete'),
            $mk.checkbox()('isScheduled'),
            $mk.countOf()('brands'),
            $mk.countOf()('categories'),
            $mk.countOf()('taxonomy')
        ],
        sorted: [
            ['action', false],
            ['scope', false],
            ['when', false]
        ]
    },
    ['address']: {
        // headers: ['Street', 'Suite', 'City', 'State/Province', 'Country', 'Postal/Zip Code'],
        columns: ['street', 'suite', 'city', 'state', 'country', 'postalCode'],
        // row: (x: Address) => [x.street, x.suite, x.city, provinces[x.state], countries[x.country], x.postalCode],
        fields: [
            {
                el: Input,
                name: 'street',
                type: 'text'
            },
            {
                el: Input,
                name: 'suite',
                type: 'text'
            },
            {
                el: Input,
                name: 'city',
                required: true,
                type: 'text'
            },
            {
                defaultValue: 'CA',
                el: Select,
                enumMap: provinces,
                name: 'state',
                required: true
            },
            {
                defaultValue: 'US',
                el: Select,
                enumMap: countries,
                name: 'country',
                required: true
            },
            {
                el: Input,
                name: 'postalCode',
                pattern: '^[0-9]{5}([- ]?[0-9]{4})?$|^[A-Z][0-9][A-Z][- ]?[0-9][A-Z][0-9]$',
                type: 'text'
            }
        ],
        sorted: []
    },
    barcode: {
        columns: ['_id', 'barcode', 'valid', 'type', 'description', 'bin', 'fixture', 'product', 'item'],
        fields: [
            $mk.ID(),
            $mk.text({
                isBarcode: true
            })('barcode'),
            $mk.checkbox()('valid'),
            $mk.dd()('type', barcodeTypes),
            $mk.text()('description'),
            $mk.countOf()('bin'),
            $mk.countOf()('fixture'),
            $mk.countOf()('product'),
            $mk.countOf()('item')
        ],
        sorted: [['barcode', false]]
    },
    bin: {
        columns: ['_id', 'name', 'barcode', 'notes', 'fixture'],
        fields: [
            $mk.ID(),
            $mk.text({
                required: true
            })('name'),
            $mk.barcode({
                required: true
            })('barcode.barcode'),
            $mk.text()('notes'),
            $mk.lookup()($.fixture, 'name')
        ],
        sorted: [['name', false]]
    },
    ['brand']: {
        columns: ['_id', 'name', 'alias', 'productLines', 'company', 'verifiedBrand', 'activity'],
        fields: [
            $mk.ID(),
            $mk.text({
                required: true
            })('name'),
            {
                el: ManyOf(Input),
                name: 'alias',
                type: 'text'
            },
            $mk.countOf()('productLines'),
            $mk.lookup()('company', 'name'),
            $mk.lookup()('verifiedBrand', 'name'),
            $mk.lookup()('activity', 'when')
        ],
        sorted: [['name', false]]
    },
    ['category']: {
        columns: ['_id', 'id', 'label', 'node'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            }
        ],
        sorted: [
            ['id', false],
            ['label', false]
        ]
    },
    ['company']: {
        columns: ['_id', 'name', 'parent', 'descendants', 'aliases', 'rns', 'country', 'brands'],
        fields: [
            $mk.ID(),
            $mk.text()('name'),
            $mk.lookup()('parent', 'name'),
            $mk.countOf()('descendants'),
            $mk.listOf()('aliases', Input),
            $mk.listOf()('rns', Input),
            $mk.dd()('country', countries),
            $mk.countOf()('brands')
        ],
        sorted: [['name', false]]
    },
    composition: {
        columns: ['sections'],
        fields: [$mk.embedded()('sections')],
        sorted: []
    },
    ['cost']: {
        columns: ['bid', 'taxPercent', 'taxDollar', 'taxExempt', 'premiumPercent', 'premiumDollar', 'totalDollar'],
        fields: [
            {
                el: Input,
                min: 0,
                name: 'bid',
                placeholder: '$10.00',
                required: true,
                step: 0.01,
                type: 'number'
            },
            {
                el: Input,
                max: 100,
                min: 0,
                name: 'taxPercent',
                placeholder: '5.00%',
                required: true,
                step: 0.01,
                type: 'number'
            },
            {
                el: Input,
                name: 'taxExempt',
                type: 'checkbox'
            },
            {
                el: Input,
                max: 100,
                min: 0,
                name: 'premiumPercent',
                placeholder: '5.00%',
                required: true,
                step: 0.01,
                type: 'number'
            },
            {
                el: Output,
                name: 'taxDollar'
            },
            {
                el: Output,
                name: 'premiumDollar'
            },
            {
                el: Output,
                name: 'totalDollar'
            }
        ],
        sorted: [['bid', false]]
    },
    dimension: {
        columns: ['measureOf', 'value', 'uom'],
        fields: [
            $mk.dd()('measureOf', measuresOf),
            $mk.positiveFloat({
                min: 0.0,
                step: 0.01,
                type: 'number'
            })('value'),
            $mk.dd()('uom', allUnitsOfMeasure())
        ],
        sorted: [
            ['measureOf', false],
            ['value', false]
        ]
    },
    expense: {
        columns: ['_id', 'amount', 'reason', 'receipt', 'item', 'purchase'],
        fields: [
            $mk.ID(),
            $mk.positiveFloat()('amount'),
            $mk.text()('reason'),
            $mk.lookup()('receipt', 'size'),
            $mk.lookup()('item', '_id'),
            $mk.lookup()('purchase', '_id')
        ],
        sorted: [['amount', false]]
    },
    ['facility']: {
        // headers: ['ID', 'Name', 'Storage', 'Address', 'Email', 'Phone'],
        columns: ['_id', 'name', 'selfStorage', 'address', 'email', 'phone'],
        // row: (x: Facility) => [x._id.toHexString(), x.name, x.selfStorage?.name, DAL.address.row(x.address), x.email, x.phone],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Output,
                name: 'name'
            },
            {
                el: Select,
                name: 'selfStorage',
                optionMap: {
                    label: 'name',
                    value: '_id'
                },
                to: 'self-storage'
            },
            {
                el: Fieldset,
                name: 'address'
            },
            {
                el: Input,
                label: 'E-mail',
                name: 'email',
                type: 'email'
            },
            {
                el: Input,
                name: 'phone',
                type: 'tel'
            },
            {
                el: Input,
                name: 'facilityNumber',
                type: 'text'
            }
        ],
        sorted: [
            ['selfStorage.name', false],
            ['address.city', false]
        ]
    },
    ['file-alloc']: {
        columns: ['_id', 'name', 'originalName', 'parent', 'materializedPath', 'fsItem', 'type', 'fileCreation', 'count', 'path', 'isFolder', 'isFile', 'size'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Input,
                name: 'name',
                required: true,
                type: 'text'
            },
            {
                el: Input,
                name: 'originalName',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Select,
                name: 'parent',
                optionMap: {
                    label: 'materializedPath',
                    value: '_id'
                },
                to: $.fsAlloc
            },
            {
                el: Input,
                name: 'materializedPath',
                readOnly: true
            },
            {
                el: Select,
                name: 'fsItem',
                optionMap: {
                    label: 'isAssigned',
                    value: '_id'
                },
                to: $.fsItem
            },
            {
                el: Output,
                name: 'type'
            },
            {
                el: Input,
                name: 'fileCreation',
                type: 'date'
            },
            {
                el: Input,
                name: 'count',
                type: 'number'
            },
            {
                el: Output,
                name: 'path'
            },
            {
                el: Output,
                name: 'isFile'
            },
            {
                el: Output,
                name: 'isFolder'
            }
        ],
        sorted: [['materializedPath', false]]
    },
    ['file-item']: {
        columns: ['_id', 'fsAlloc', 'data', 'size', 'mimeType', 'invoice', 'name', 'isAssigned', 'isInvoice'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Select,
                hideOnInsert: true,
                name: 'fsAlloc',
                optionMap: {
                    label: 'materializedPath',
                    value: '_id'
                }
            },
            {
                el: Input,
                icon: faBinoculars,
                name: 'data',
                type: 'image'
            },
            {
                el: Input,
                name: 'size',
                required: true,
                type: 'number'
            },
            {
                el: Select,
                enumMap: mimeTypes,
                name: 'mimeType'
            },
            {
                el: Select,
                hideOnInsert: true,
                name: 'invoice',
                optionMap: {
                    label: 'invoiceId',
                    value: '_id'
                }
            },
            {
                el: Output,
                name: 'name'
            },
            {
                el: Output,
                iconFalse: faSquare,
                iconTrue: faSquareCheck,
                name: 'isAssigned'
            },
            {
                el: Output,
                iconFalse: faSquare,
                iconTrue: faSquareCheck,
                name: 'isInvoice'
            }
        ],
        sorted: [['size', false]]
    },
    fixture: {
        columns: ['_id', 'barcode', 'name', 'notes', 'bins'],
        fields: [
            $mk.ID(),
            $mk.barcode()('barcode.barcode'),
            $mk.text({
                required: true
            })('name'),
            $mk.text({
                maxLength: 200
            })('notes'),
            $mk.countOf()('bins')
        ],
        sorted: [['name', false]]
    },
    ['image-stage']: {
        columns: ['stage', 'fsAlloc', 'canPublish'],
        fields: [$mk.dd()('stage', stageTypes), $mk.lookup()('fsAlloc', 'name'), $mk.checkbox()('canPublish')],
        sorted: [['stage'], ['fsAlloc.name']]
    },
    item: {
        columns: ['_id', 'product', 'barcode', 'colors', 'condition', 'defects', 'features', 'tested', 'draft', 'photoPack'],
        fields: [
            $mk.ID(),
            $mk.lookup()('product', 'shortDescription'),
            $mk.barcode()('barcode.barcode'),
            $mk.listOf()('colors', Input),
            $mk.dd()('condition', conditions),
            $mk.listOf()('defects', Input),
            $mk.listOf()('features', Input),
            $mk.datetime()('tested'),
            $mk.lookup()('draft', '_id'),
            $mk.countOf()('photoPack')
        ],
        sorted: [
            ['product.brand.name', false],
            ['product.shortDescription', false]
        ]
    },
    ['item-type']: {
        columns: ['_id', 'taxonomy', 'name', 'details'],
        fields: [
            $mk.ID(),
            $mk.countOf()('taxonomy'),
            $mk.text({
                required: true
            })('name'),
            $mk.listOf({
                type: 'text'
            })('details', Input)
        ],
        sorted: [['name', false]]
    },
    ['length']: {
        columns: ['value', 'uom'],
        fields: [
            $mk.positiveFloat({
                defaultValue: 0.0,
                min: 0.0,
                required: true
            })('value'),
            $mk.dd()('uom', lengthUOMS)
        ],
        sorted: []
    },
    ['measurement']: {
        columns: ['of', 'measures', 'uoms'],
        fields: [
            $mk.dd({
                required: true,
                minLength: 1,
                maxLength: 1
            })('of', measurementFor),
            $mk.listOf({
                type: 'text'
            })('measures', Input),
            $mk.listOf({
                enumMap: allUnitsOfMeasure()
            })('uoms', Select)
        ],
        sorted: [
            ['of', false],
            ['measures', false]
        ]
    },
    ['percent-of']: {
        columns: ['materialType', 'percent'],
        fields: [
            $mk.dd({
                minLength: 1,
                maxLength: 2
            })('materialType', materialTypes),
            $mk.positiveFloat({
                maxValue: 100.0,
                minValue: 0.0,
                placeholder: 'ex: 51.25 '
            })('percent') // TODO add display % sign
        ],
        sorted: []
    },
    ['photo-pack']: {
        columns: ['_id', 'versions', 'items'],
        fields: [$mk.ID(), $mk.countOf()('versions'), $mk.lookup()('item', 'name')],
        sorted: []
    },
    ['product-line']: {
        columns: ['_id', 'brand', 'name', 'products'],
        fields: [$mk.ID(), $mk.text({ required: true })('name'), $mk.lookup()('brand', 'name'), $mk.countOf()('products')],
        sorted: [['name', false]]
    },
    ['product-documentation']: {
        columns: ['_id', 'fsItem', 'product'],
        fields: [$mk.ID(), $mk.lookup()($.fsItem, 'name'), $mk.lookup()($.product, 'shortDescription')],
        sorted: [['fsAlloc.name']]
    },
    ['purchase']: {
        columns: ['_id', 'rentalUnit', 'closeDate', 'auctionSite', 'auctionId', 'invoiceId', 'invoice', 'cost'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Select,
                name: 'rentalUnit',
                optionMap: {
                    label: 'name',
                    value: '_id'
                },
                to: $.rentalUnit
            },
            {
                el: Input,
                name: 'closeDate',
                required: true,
                type: 'date'
            },
            {
                el: Select,
                enumMap: auctionSites,
                name: 'auctionSite',
                required: true
            },
            {
                el: Input,
                name: 'auctionId',
                type: 'text'
            },
            {
                el: Input,
                name: 'invoiceId',
                type: 'text'
            },
            {
                el: Select,
                name: 'invoice',
                optionMap: {
                    label: 'data',
                    value: '_id'
                },
                to: $.fsItem
            },
            {
                el: Fieldset,
                name: 'cost'
            }
        ],
        sorted: [['closeDate', false]]
    },
    ['rental-unit']: {
        columns: ['_id', 'name', 'facility', 'unit', 'size'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Output,
                name: 'name'
            },
            {
                el: Select,
                name: 'facility',
                optionMap: {
                    label: 'name',
                    value: '_id'
                },
                to: 'facility'
            },
            {
                el: Input,
                name: 'unit',
                required: true,
                type: 'text'
            },
            {
                asDisplay: true,
                el: Fieldset,
                name: 'size'
            }
        ],
        sorted: [
            ['facility.selfStorage.name', false],
            ['facility.address.city', false]
        ]
    },
    section: {
        columns: ['name', 'segments'],
        fields: [
            $mk.text({
                required: false
            })('name'),
            $mk.listOf()('segments', Input)
        ],
        sorted: [['name', false]]
    },
    ['self-storage']: {
        // headers: ['ID', 'Name', 'Website'],
        columns: ['_id', 'name', 'website'],
        // row: (x: SelfStorage) => [x._id.toHexString(), x.name, x.website],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Input,
                minLength: 5,
                name: 'name',
                required: true,
                type: 'text'
            },
            {
                el: Input,
                name: 'website',
                type: 'url'
            }
        ],
        sorted: [['name', false]]
    },
    ['square-footage']: {
        columns: ['length', 'width'],
        fields: [
            {
                asDisplay: true,
                el: Fieldset,
                name: 'length'
            },
            {
                asDisplay: true,
                el: Fieldset,
                name: 'width'
            },
            {
                el: Output,
                name: 'displayAs'
            }
        ],
        sorted: []
    },
    ['taxonomy']: {
        columns: ['_id', 'category', 'subCategory', 'subSubCategory', 'materializedPath', 'selectors', 'itemType'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            }
        ],
        sorted: [['materializedPath', false]]
    },
    ['verified-brand']: {
        columns: ['_id', 'name'],
        fields: [
            {
                el: Input,
                hideOnInsert: true,
                icon: faKey,
                label: 'ID',
                name: '_id',
                readOnly: true,
                required: true,
                type: 'text'
            },
            {
                el: Input,
                name: 'name',
                readOnly: true,
                required: true,
                type: 'text'
            }
        ],
        sorted: [['name', false]]
    }
};
