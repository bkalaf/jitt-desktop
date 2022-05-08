"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = exports.InsertForm = exports.Property = exports.Control = exports.useRegister = exports.insertMutation = exports.convertFormData = exports.getConversion = exports.setProperty = exports.isDotNotation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable react/boolean-prop-naming */
const react_router_dom_1 = require("react-router-dom");
const react_1 = require("react");
const grid_1 = require("./grid");
const MainWindow_1 = require("./MainWindow");
const Modal_1 = require("./Modal");
const FormProvider_1 = require("./providers/FormProvider");
const useForm_1 = require("../hooks/useForm");
const react_query_1 = require("react-query");
const useRealm_1 = require("./grid/useRealm");
const useToast_1 = require("./useToast");
const snd_1 = require("../common/snd");
const OverlayProvider_1 = require("./providers/OverlayProvider");
const Indicator_1 = require("./Indicator");
function isDotNotation(str) {
    return str.includes('.');
}
exports.isDotNotation = isDotNotation;
function setProperty(prop) {
    return function inner(value) {
        return function outer(obj) {
            var _a;
            if (!isDotNotation(prop)) {
                if (value == null) {
                    const result = Object.assign({}, obj);
                    delete result[prop];
                    return result;
                }
                return Object.assign(Object.assign({}, obj), { [prop]: value });
            }
            const [head, ...tail] = prop.split('.');
            const obj2 = (_a = obj[head]) !== null && _a !== void 0 ? _a : {};
            return Object.assign(Object.assign({}, obj), { [head]: setProperty(tail.join('.'))(value)(obj2) });
        };
    };
}
exports.setProperty = setProperty;
function getConversion(type, objectType) {
    switch (type) {
        case 'bool':
            return (s) => (s == null ? null : s === 'true' ? true : false);
        case 'decimal128':
        case 'double':
        case 'float':
            return (s) => (s == null ? null : parseFloat(s));
        case 'int':
            return (s) => (s == null ? null : parseInt(s, 10));
        case 'dictionary':
        case 'list':
        case 'set':
            return (s) => (s == null ? [] : s.map((x) => getConversion((objectType !== null && objectType !== void 0 ? objectType : 'string'))(x)));
        case 'object':
        case 'objectId':
            return (s) => (s == null ? null : new Realm.BSON.ObjectId(s));
        case 'string':
            return (s) => (s == null ? null : s);
        case 'uuid':
            return (s) => (s == null ? null : new Realm.BSON.UUID(s));
    }
}
exports.getConversion = getConversion;
function convertFormData(oc, getProperty, typeName) {
    const result = new oc();
    return function (fd) {
        Object.entries(fd).forEach(([name, value]) => {
            var _a;
            const info = getProperty(typeName, name);
            const deserialize = (_a = info === null || info === void 0 ? void 0 : info.deserialize) !== null && _a !== void 0 ? _a : getConversion(info === null || info === void 0 ? void 0 : info.type, info === null || info === void 0 ? void 0 : info.objectType);
            setProperty(name)(deserialize(value))(result);
        });
        return result;
    };
}
exports.convertFormData = convertFormData;
function insertMutation(realm, collectionName) {
    return function (fd) {
        try {
            let result;
            realm.write(() => {
                result = realm.create(collectionName, fd, Realm.UpdateMode.Modified);
            });
            return Promise.resolve(result);
        }
        catch (error) {
            return Promise.reject(error);
        }
    };
}
exports.insertMutation = insertMutation;
function useRegister() {
    return (0, OverlayProvider_1.useProvidedContext)('Form', FormProvider_1.FormContext).register;
}
exports.useRegister = useRegister;
function Control(props) {
    const { name, label, feedback, showFeedback, tag, Element } = props, remain = __rest(props, ["name", "label", "feedback", "showFeedback", "tag", "Element"]);
    const controlID = `${props.name}-control`;
    const labelID = `${controlID}-label`;
    const feedbackID = `${controlID}-feedback`;
    const register = useRegister();
    return (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: 'relative flex flex-col' }, { children: [(0, jsx_runtime_1.jsx)("label", Object.assign({ id: labelID, htmlFor: controlID, className: 'flex text-lg font-bold leading-loose tracking-wider font-fira-sans indent-3' }, { children: label })), (0, jsx_runtime_1.jsx)(Indicator_1.IndicatorGroup, { tag: tag }), (0, jsx_runtime_1.jsx)(Element, Object.assign({}, register(name, remain))), (0, jsx_runtime_1.jsx)("small", Object.assign({ id: feedbackID, className: 'hidden text-base peer' }, { children: feedback }))] }));
}
exports.Control = Control;
function Property(props) {
    if (props.enumMap) {
        // Select
    }
    else if (props.displayAs) {
    }
    else if (props.inputType) {
    }
    else if (props.local) {
    }
    else if (props.option) {
    }
}
exports.Property = Property;
function InsertForm() {
    var _a, _b;
    const { getObjectClass, getProperty, getControls } = (0, MainWindow_1.useSchema)();
    const realm = (0, useRealm_1.useRealm)();
    const collectionName = (0, MainWindow_1.useCollectionParam)();
    const oc = getObjectClass(collectionName);
    const convert = (0, react_1.useMemo)(() => convertFormData(oc, getProperty, collectionName), [collectionName, getProperty, oc]);
    const [handleSubmit, register, formRef] = (0, useForm_1.useForm)(convert);
    const insertQuery = (0, react_1.useMemo)(() => insertMutation(realm, collectionName), [collectionName, realm]);
    const successToast = (0, useToast_1.useToast)('success');
    const failureToast = (0, useToast_1.useToast)('failure');
    const queryClient = (0, react_query_1.useQueryClient)();
    const mutation = (0, react_query_1.useMutation)(insertQuery, {
        onSuccess: (record) => {
            successToast('You have successfully inserted a record.', 'SUCCESS', record._id.toHexString());
            queryClient.invalidateQueries(['selectAll', collectionName]);
            queryClient.invalidateQueries(['dropdown', collectionName]);
            queryClient.refetchQueries(['selectAll', collectionName]);
            queryClient.refetchQueries(['dropdown', collectionName]);
        },
        onError: (error) => {
            failureToast(error.message, 'FAILURE', error.name);
        }
    });
    const onSubmit = (0, react_1.useMemo)(() => handleSubmit(x => {
        mutation.mutate(x);
        return Promise.resolve(undefined);
    }), [handleSubmit, mutation]);
    const getInfo = (0, react_1.useCallback)((name) => getProperty(collectionName, name), [collectionName, getProperty]);
    const controls = ((_b = (_a = getControls(collectionName)) === null || _a === void 0 ? void 0 : _a.map(snd_1.snd).filter(x => x != null)) !== null && _b !== void 0 ? _b : []);
    return ((0, jsx_runtime_1.jsx)(FormProvider_1.FormProvider, Object.assign({ register: register }, { children: (0, jsx_runtime_1.jsx)("form", { ref: formRef, className: 'grid grid-cols-4', onSubmit: onSubmit }) })));
}
exports.InsertForm = InsertForm;
function MainRouter() {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, Object.assign({ path: '/' }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: 'login', element: (0, jsx_runtime_1.jsx)(Modal_1.Modal, { children: (0, jsx_runtime_1.jsx)(MainWindow_1.LoginPage, {}) }) }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, Object.assign({ path: 'data' }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, Object.assign({ path: 'v1' }, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Route, Object.assign({ path: ':collection' }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, Object.assign({ path: 'new' }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(Modal_1.Modal, { children: (0, jsx_runtime_1.jsx)(InsertForm, {}) }) }) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, Object.assign({ path: ':id' }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) }) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(grid_1.Grid, {}) })] })) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { index: true, element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: 'v1' }) })] }))] })) }));
}
exports.MainRouter = MainRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpblJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01haW5Sb3V0ZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE4QztBQUM5Qyx1REFBMkQ7QUFDM0QsaUNBQW9EO0FBRXBELGlDQUE4QjtBQUM5Qiw2Q0FBd0U7QUFDeEUsbUNBQWdDO0FBQ2hDLDJEQUFxRTtBQUNyRSw4Q0FBMkM7QUFHM0MsNkNBQTBEO0FBQzFELDhDQUEyQztBQUMzQyx5Q0FBc0M7QUFDdEMsdUNBQW9DO0FBQ3BDLGlFQUFpRTtBQUVqRSwyQ0FBNkM7QUFFN0MsU0FBZ0IsYUFBYSxDQUFDLEdBQVc7SUFDckMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFGRCxzQ0FFQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxJQUFZO0lBQ3BDLE9BQU8sU0FBUyxLQUFLLENBQUMsS0FBVTtRQUM1QixPQUFPLFNBQVMsS0FBSyxDQUFDLEdBQXdCOztZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN0QixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7b0JBQ2YsTUFBTSxNQUFNLHFCQUFRLEdBQUcsQ0FBRSxDQUFDO29CQUMxQixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEIsT0FBTyxNQUFNLENBQUM7aUJBQ2pCO2dCQUNELHVDQUFZLEdBQUcsS0FBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBRzthQUNwQztZQUNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLE1BQUEsR0FBRyxDQUFDLElBQUksQ0FBQyxtQ0FBSSxFQUFFLENBQUM7WUFDN0IsdUNBQVksR0FB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