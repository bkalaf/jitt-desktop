"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaProvider = exports.useProvideSchemaContext = exports.createProps = exports.indexSort = exports.SchemaContext = exports.toTypeInfo = exports.ORM = exports.fromKebabToCamelCase = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const pro_duotone_svg_icons_1 = require("@fortawesome/pro-duotone-svg-icons");
const react_1 = require("react");
const isIn_1 = require("../../common/array/isIn");
const capitalize_1 = require("../../common/text/capitalize");
const decapitalize_1 = require("../../common/text/decapitalize");
const toTitleCase_1 = require("../../common/text/toTitleCase");
const data_1 = require("../../data");
const country_1 = require("../../data/enums/country");
const lengthUOM_1 = require("../../data/enums/lengthUOM");
const province_1 = require("../../data/enums/province");
const App_1 = require("../App");
function fromKebabToCamelCase(str) {
    return (0, decapitalize_1.decapitalize)(str.split('-').map(capitalize_1.capitalize).join(''));
}
exports.fromKebabToCamelCase = fromKebabToCamelCase;
exports.ORM = {
    address: {
        columns: [
            { name: 'suite' },
            { name: 'street' },
            { name: 'city' },
            { name: 'state', enum: province_1.provinces },
            { name: 'country', enum: country_1.countries },
            { name: 'postalCode' }
        ]
    },
    length: {
        columns: [{ name: 'value' }, { name: 'uom', enum: lengthUOM_1.lengths }],
        displayAs: true
    },
    squareFootage: {
        columns: [{ name: 'length' }, { name: 'width' }],
        displayAs: true
    },
    selfStorage: {
        columns: [{ name: '_id', label: 'ID', icon: pro_duotone_svg_icons_1.faKey }, { name: 'name' }, { name: 'website' }],
        descendants: [{ to: 'facility', on: 'facilities' }],
        sort: ['name']
    },
    facility: {
        columns: [
            { name: '_id', label: 'ID', icon: pro_duotone_svg_icons_1.faKey },
            { name: 'name', local: true },
            { name: 'selfStorage', to: 'self-storage', option: ['_id', 'name'] },
            { name: 'address', embedded: true },
            { name: 'facilityNumber' },
            { name: 'email' },
            { name: 'phone' }
        ],
        descendants: [{ to: 'rental-unit', on: 'units' }],
        sort: ['selfStorage.name', 'address.city']
    },
    rentalUnit: {
        columns: [
            { name: '_id', label: 'ID', icon: pro_duotone_svg_icons_1.faKey },
            { name: 'facility', to: 'facility', option: ['_id', 'name'] },
            { name: 'unit' },
            { name: 'size', embedded: true, displayAs: true }
        ],
        sort: ['facility.selfStorage.name', 'unit']
    }
};
function toTypeInfo(name, properties, embedded) {
    var _a;
    const orm = exports.ORM[fromKebabToCamelCase(name)];
    const columns = orm.columns.map((x, ix) => { var _a; return (Object.assign(Object.assign(Object.assign({}, x), ((_a = properties.find(([k, v]) => fromKebabToCamelCase(k) === x.name)) !== null && _a !== void 0 ? _a : [x.name, {}])[1]), { index: ix })); }).map(x => { var _a; return (Object.assign(Object.assign({}, x), { propertyType: x.embedded ? 'embedded' : x.local ? 'local' : x.to != null ? 'reference' : (0, isIn_1.isIn)(['list', 'dictionary', 'set'])((_a = x.type) !== null && _a !== void 0 ? _a : '') ? 'collection' : 'primitive' })); });
    return {
        name,
        properties: Object.fromEntries(columns.map(x => [x.name, x])),
        embedded,
        sort: (_a = orm.sort) !== null && _a !== void 0 ? _a : []
    };
}
exports.toTypeInfo = toTypeInfo;
exports.SchemaContext = (0, react_1.createContext)(undefined);
function indexSort(a, b) {
    if (a[1] == null || b[1] == null)
        return 0;
    return a[1].index < b[1].index ? -1 : a[1].index === b[1].index ? 0 : 1;
}
exports.indexSort = indexSort;
function createProps(name, v) {
    var _a, _b, _c;
    const props = {
        required: !((_a = v === null || v === void 0 ? void 0 : v.optional) !== null && _a !== void 0 ? _a : false),
        readOnly: ((_b = v === null || v === void 0 ? void 0 : v.readOnly) !== null && _b !== void 0 ? _b : false) || ((_c = v === null || v === void 0 ? void 0 : v.local) !== null && _c !== void 0 ? _c : false),
        minLength: v === null || v === void 0 ? void 0 : v.minLength,
        maxLength: v === null || v === void 0 ? void 0 : v.maxLength,
        min: v === null || v === void 0 ? void 0 : v.min,
        max: v === null || v === void 0 ? void 0 : v.max,
        pattern: v === null || v === void 0 ? void 0 : v.pattern,
        multiple: v === null || v === void 0 ? void 0 : v.multiple,
        size: v === null || v === void 0 ? void 0 : v.size,
        type: v === null || v === void 0 ? void 0 : v.inputType,
        validators: v === null || v === void 0 ? void 0 : v.validators,
        serialize: (v === null || v === void 0 ? void 0 : v.serialize) || ((v === null || v === void 0 ? void 0 : v.displayAs) ? (x) => x.displayAs : undefined),
        deserialize: v === null || v === void 0 ? void 0 : v.deserialize,
        label: v === null || v === void 0 ? void 0 : v.label
    };
    Object.getOwnPropertyNames(props).forEach(k => {
        if (props[k] == null) {
            delete props[k];
        }
    });
    return props;
}
exports.createProps = createProps;
function useProvideSchemaContext() {
    const realm = (0, client_1.useReactiveVar)(App_1.$realm);
    const getObjectClass = (0, react_1.useCallback)(function (name) {
        return data_1.schema.find((x) => x.schema.name === name);
    }, []);
    const types = (0, react_1.useMemo)(() => {
        if (realm == null)
            return null;
        return Object.fromEntries(realm.schema.map((x) => {
            var _a;
            return [
                x.name,
                toTypeInfo(x.name, Object.entries(x.properties), (_a = x.embedded) !== null && _a !== void 0 ? _a : false)
            ];
        }));
    }, [realm]);
    const getType = (0, react_1.useCallback)((name) => {
        if (types == null)
            return null;
        return types[name];
    }, [types]);
    const getProperty = (0, react_1.useCallback)((typename, name) => {
        if (types == null)
            return null;
        return types[typename].properties[name];
    }, [types]);
    const getControls = (0, react_1.useCallback)((name) => {
        var _a, _b;
        if (types == null)
            return [];
        const result = Object.entries((_b = (_a = getType(name)) === null || _a === void 0 ? void 0 : _a.properties) !== null && _b !== void 0 ? _b : {}).sort(indexSort).map(([name, info]) => { var _a; return (info === null || info === void 0 ? void 0 : info.propertyType) !== 'embedded' ? [[name, info]] : getControls((_a = info.objectType) !== null && _a !== void 0 ? _a : '').map(([k, v]) => { var _a; return [[name, k].join('.'), Object.assign(Object.assign({}, v), { parentTypes: [...(_a = info.parentTypes) !== null && _a !== void 0 ? _a : [], info.objectType] })]; }); }).reduce((pv, cv) => [...pv, ...cv], []).map(([k, v], ix) => { var _a, _b; return [k, Object.assign(Object.assign({}, v), { index: ix, label: (_a = v === null || v === void 0 ? void 0 : v.label) !== null && _a !== void 0 ? _a : (0, toTitleCase_1.toTitleCase)((_b = v === null || v === void 0 ? void 0 : v.name) !== null && _b !== void 0 ? _b : ''), props: createProps(k, v) })]; });
        return result;
    }, [getType, types]);
    const getColumns = (0, react_1.useCallback)((name) => {
        var _a, _b;
        if (types == null)
            return [];
        const result = Object.entries((_b = (_a = getType(name)) === null || _a === void 0 ? void 0 : _a.properties) !== null && _b !== void 0 ? _b : {}).sort(indexSort).map(([name, info]) => { var _a; return !(info === null || info === void 0 ? void 0 : info.embedded) || (info.embedded && (info === null || info === void 0 ? void 0 : info.displayAs) === true) ? [[name, info]] : getColumns((_a = info.objectType) !== null && _a !== void 0 ? _a : '').map(([k, v]) => { var _a; return [[name, k].join('.'), Object.assign(Object.assign({}, v), { parentTypes: [...(_a = info.parentTypes) !== null && _a !== void 0 ? _a : [], info.objectType] })]; }); }).reduce((pv, cv) => [...pv, ...cv], []).map(([k, v], ix) => { var _a, _b; return [k, Object.assign(Object.assign({}, v), { index: ix, label: (_a = v === null || v === void 0 ? void 0 : v.label) !== null && _a !== void 0 ? _a : (0, toTitleCase_1.toTitleCase)((_b = v === null || v === void 0 ? void 0 : v.name) !== null && _b !== void 0 ? _b : ''), props: createProps(k, v) })]; });
        return result;
    }, [getType, types]);
    return {
        types,
        getObjectClass,
        getColumns,
        getControls,
        getType,
        getProperty
    };
}
exports.useProvideSchemaContext = useProvideSchemaContext;
function SchemaProvider({ children }) {
    const value = useProvideSchemaContext();
    return (0, jsx_runtime_1.jsx)(exports.SchemaContext.Provider, Object.assign({ value: value }, { children: children }));
}
exports.SchemaProvider = SchemaProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NoZW1hUHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9wcm92aWRlcnMvU2NoZW1hUHJvdmlkZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSwyQ0FBZ0Q7QUFDaEQsOEVBQTJFO0FBQzNFLGlDQUFvRjtBQUVwRixrREFBK0M7QUFFL0MsNkRBQTBEO0FBQzFELGlFQUE4RDtBQUM5RCwrREFBNEQ7QUFDNUQscUNBQW9DO0FBQ3BDLHNEQUFxRDtBQUNyRCwwREFBcUQ7QUFDckQsd0RBQXNEO0FBQ3RELGdDQUFnQztBQUVoQyxTQUFnQixvQkFBb0IsQ0FBQyxHQUFXO0lBQzVDLE9BQU8sSUFBQSwyQkFBWSxFQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLHVCQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRkQsb0RBRUM7QUFDWSxRQUFBLEdBQUcsR0FrQlo7SUFDQSxPQUFPLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDTCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDakIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2xCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNoQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLG9CQUFTLEVBQUU7WUFDbEMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxtQkFBUyxFQUFFO1lBQ3BDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRTtTQUN6QjtLQUNKO0lBQ0QsTUFBTSxFQUFFO1FBQ0osT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxtQkFBTyxFQUFFLENBQUM7UUFDNUQsU0FBUyxFQUFFLElB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