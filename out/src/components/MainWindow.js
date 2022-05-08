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
exports.useIDParam = exports.useCollectionParam = exports.Spinner = exports.LoginPage = exports.MainWindow = exports.CommandButton = exports.useSchema = exports.IconButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable react/boolean-prop-naming */
const pro_duotone_svg_icons_1 = require("@fortawesome/pro-duotone-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const TopBar_1 = require("./TopBar");
const client_1 = require("@apollo/client");
const OverlayProvider_1 = require("./providers/OverlayProvider");
const LoginForm_1 = require("./LoginForm");
const OnlineStatus_1 = require("./OnlineStatus");
const Toaster_1 = require("./providers/Toaster");
const LeftSidebar_1 = require("./LeftSidebar");
const CommandBarProvider_1 = require("./providers/CommandBarProvider");
const IconLinkButton_1 = require("./IconLinkButton");
const useToast_1 = require("./useToast");
const AuthStatus_1 = require("./AuthStatus");
const App_1 = require("./App");
const SchemaProvider_1 = require("./providers/SchemaProvider");
const MainRouter_1 = require("./MainRouter");
function IconButton(props) {
    const { icon, onClick, title, disabled } = props;
    return ((0, jsx_runtime_1.jsx)("li", Object.assign({ className: 'inline-flex', title: title }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ disabled: disabled !== null && disabled !== void 0 ? disabled : false, type: 'button', className: 'inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105 border-blue disabled:bg-neutral-dark disabled:opacity-50', onClick: onClick }, { children: (0, jsx_runtime_1.jsx)("span", Object.assign({ className: 'px-2 py-1 border border-white rounded-md' }, { children: (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: icon, size: '1x', className: 'block font-bold', fixedWidth: true }) })) })) })));
}
exports.IconButton = IconButton;
function useSchema() {
    return (0, OverlayProvider_1.useProvidedContext)('Schema', SchemaProvider_1.SchemaContext);
}
exports.useSchema = useSchema;
function CommandButton(props) {
    const { rVar } = props, remain = __rest(props, ["rVar"]);
    const { isDisabled, execute } = (0, client_1.useReactiveVar)(rVar);
    return (0, jsx_runtime_1.jsx)(IconButton, Object.assign({}, remain, { disabled: isDisabled, onClick: execute }));
}
exports.CommandButton = CommandButton;
function MainWindow() {
    const realm = (0, client_1.useReactiveVar)(App_1.$realm);
    const schema = useSchema();
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const goBack = (0, react_1.useCallback)(() => navigate(-1), [navigate]);
    const infoToast = (0, useToast_1.useToast)('info');
    const { isDisabled: insertDisabled, execute: insertExecute } = (0, CommandBarProvider_1.useInsertCommand)();
    const { isDisabled: deleteDisabled, execute: deleteExecute } = (0, CommandBarProvider_1.useDeleteCommand)();
    (0, react_1.useEffect)(() => {
        if (realm) {
            console.log('new realm', realm);
            console.log(schema.types);
            console.log(schema.getType('self-storage'));
            console.log(schema.getColumns('self-storage'));
            console.log(schema.getColumns('facility'));
            console.log(schema.getColumns('rental-unit'));
            console.log(schema.getControls('facility'));
            console.log(schema.getControls('self-storage'));
            console.log(schema.getControls('rental-unit'));
        }
    }, [realm, schema]);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: 'relative flex flex-col w-full h-full py-0.5' }, { children: [(0, jsx_runtime_1.jsx)(TopBar_1.TopBar, {}), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: 'flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-black transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-indigo-dark font-fira-sans mb-0.5 justify-center' }, { children: (0, jsx_runtime_1.jsxs)("ul", Object.assign({ className: 'flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark' }, { children: [(0, jsx_runtime_1.jsx)(IconLinkButton_1.IconLinkButton, { to: '/dashboard', title: 'Go to your dashboard.', icon: pro_duotone_svg_icons_1.faHome }), (0, jsx_runtime_1.jsx)(IconButton, { icon: pro_duotone_svg_icons_1.faArrowLeft, title: 'Go back 1 page.', onClick: goBack }), (0, jsx_runtime_1.jsx)(CommandButton, { icon: pro_duotone_svg_icons_1.faPlusCircle, title: 'Insert a new record.', rVar: App_1.$insertCommand }), (0, jsx_runtime_1.jsx)(CommandButton, { icon: pro_duotone_svg_icons_1.faTrashAlt, title: 'Delete selected records.', rVar: App_1.$deleteCommand })] })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: 'flex w-full px-2 text-base font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-slate-very-dark font-fira-sans  mb-0.5 flex-row justify-between items-center' }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: 'flex bg-blue text-white font-fira-sans border border-white rounded-lg px-2 my-0.5 tracking-wider leading-loose font-bold duration-1000 ease-in-out delay-200' }, { children: location.pathname })) })), (0, jsx_runtime_1.jsxs)("main", Object.assign({ className: 'flex flex-grow w-full px-2 text-white' }, { children: [(0, jsx_runtime_1.jsx)(LeftSidebar_1.LeftSidebar, {}), (0, jsx_runtime_1.jsx)(MainRouter_1.MainRouter, {})] })), (0, jsx_runtime_1.jsx)("footer", Object.assign({ className: 'flex w-full px-2 text-base font-bold text-white border border-white rounded-md bg-slate-very-dark' }, { children: (0, jsx_runtime_1.jsxs)("ul", Object.assign({ className: 'flex flex-row items-center justify-between w-full px-1 py-0.5' }, { children: [(0, jsx_runtime_1.jsx)(OnlineStatus_1.OnlineStatus, {}), (0, jsx_runtime_1.jsx)(AuthStatus_1.AuthStatus, {})] })) })), (0, jsx_runtime_1.jsx)(Toaster_1.Toaster, {})] })));
}
exports.MainWindow = MainWindow;
function LoginPage() {
    return (0, jsx_runtime_1.jsx)(LoginForm_1.LoginForm, {});
}
exports.LoginPage = LoginPage;
function Spinner() {
    return (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { size: '6x', icon: pro_duotone_svg_icons_1.faSpinner, className: 'text-red' });
}
exports.Spinner = Spinner;
function useCollectionParam() {
    const { collection } = (0, react_router_dom_1.useParams)();
    if (collection == null)
        throw new Error('no collection name');
    return collection;
}
exports.useCollectionParam = useCollectionParam;
function useIDParam() {
    const { id } = (0, react_router_dom_1.useParams)();
    if (id == null)
        throw new Error('no id param');
    return id;
}
exports.useIDParam = useIDParam;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbldpbmRvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01haW5XaW5kb3cudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE4QztBQUM5Qyw4RUFTNEM7QUFDNUMsc0VBQWlFO0FBQ2pFLGlDQUEyRDtBQUMzRCx1REFBdUU7QUFDdkUscUNBQWtDO0FBQ2xDLDJDQUFzRTtBQUN0RSxpRUFBaUU7QUFJakUsMkNBQXdDO0FBQ3hDLGlEQUE4QztBQUU5QyxpREFBOEM7QUFDOUMsK0NBQTRDO0FBQzVDLHVFQUFvRjtBQUNwRixxREFBa0Q7QUFDbEQseUNBQXNDO0FBQ3RDLDZDQUEwQztBQUMxQywrQkFBK0Q7QUFDL0QsK0RBQTJEO0FBQzNELDZDQUEwQztBQUcxQyxTQUFnQixVQUFVLENBQUMsS0FBc0I7SUFDN0MsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNqRCxPQUFPLENBQ0gsNkNBQUksU0FBUyxFQUFDLGFBQWEsRUFBQyxLQUFLLEVBQUUsS0FBSyxnQkFDcEMsaURBQ0ksUUFBUSxFQUFFLFFBQVEsYUFBUixRQUFRLGNBQVIsUUFBUSxHQUFJLEtBQUssRUFDM0IsSUFBSSxFQUFDLFFBQVEsRUFDYixTQUFTLEVBQUMsK1hBQStYLEVBQ3pZLE9BQU8sRUFBRSxPQUFPLGdCQUNoQiwrQ0FBTSxTQUFTLEVBQUMsMENBQTBDLGdCQUN0RCx1QkFBQyxtQ0FBZSxJQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsVUFBVSxTQUFHLElBQzdFLElBQ0YsSUFDUixDQUNSLENBQUM7QUFDTixDQUFDO0FBZkQsZ0NBZUM7QUFFRCxTQUFnQixTQUFTO0lBQ3JCLE9BQU8sSUFBQSxvQ0FBa0IsRUFBQyxRQUFRLEVBQUUsOEJBQWEs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