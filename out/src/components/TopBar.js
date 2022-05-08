"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopBar = exports.AuthSegment = exports.TopBarItems = exports.ModuleMenu = exports.LinkButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const useAuth_1 = require("../hooks/useAuth");
const _cn_1 = require("./$cn");
const App_1 = require("./App");
const ButtonGroup_1 = require("./ButtonGroup");
const ButtonListItem_1 = require("./ButtonListItem");
const NavLinkListItem_1 = require("./NavLinkListItem");
const RootMenu_1 = require("./RootMenu");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('./../assets/logos/resized-logo.png');
function LinkButton({ children, to }) {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ to: to, className: 'flex' }, { children: children })));
}
exports.LinkButton = LinkButton;
function ModuleMenu() {
    return ((0, jsx_runtime_1.jsx)("ol", Object.assign({ className: 'flex flex-row p-3 space-x-1.5' }, { children: ['api', 'data', 'files', 'queues'].map((x, index) => ((0, jsx_runtime_1.jsx)(NavLinkListItem_1.NavLinkListItem, { className: 'px-3 nav-button', to: x }, index))) })));
}
exports.ModuleMenu = ModuleMenu;
exports.TopBarItems = {
    AuthButtons: {
        Login: react_1.default.memo(() => ((0, jsx_runtime_1.jsx)(NavLinkListItem_1.NavLinkListItem, Object.assign({ className: 'px-3 nav-button auth-button', to: '/login' }, { children: "Log-In" }))), () => true)
    },
    Menu: {
        ModuleMenu: react_1.default.memo(ModuleMenu),
        MenuItem: undefined,
        ModuleMenuItems: react_1.default.memo(RootMenu_1.RootMenuListItems),
        Logo: react_1.default.memo(() => {
            const $className = (0, react_1.useCallback)(({ isActive }) => (0, _cn_1.$cn)({}, { isActive }).className, []);
            return ((0, jsx_runtime_1.jsx)(react_router_dom_1.NavLink, Object.assign({ className: $className, to: '/' }, { children: (0, jsx_runtime_1.jsx)("img", { src: logo, className: 'object-scale-down h-14' }) })));
        }, () => true)
    }
};
function AuthSegment() {
    const cu = (0, client_1.useReactiveVar)(App_1.$currentUser);
    const logOutFunction = (0, react_1.useCallback)(() => {
        if (!cu)
            return Promise.resolve();
        cu.logOut();
        (0, App_1.$currentUser)(null);
    }, [cu]);
    const { isAuthenticated } = (0, useAuth_1.useAuth)();
    return ((0, jsx_runtime_1.jsxs)(ButtonGroup_1.ButtonGroup, { children: [!isAuthenticated && (0, jsx_runtime_1.jsx)(exports.TopBarItems.AuthButtons.Login, {}), !isAuthenticated && (0, jsx_runtime_1.jsx)(ButtonListItem_1.ButtonListItem, Object.assign({ ix: 1 }, { children: "Register" })), isAuthenticated && ((0, jsx_runtime_1.jsx)(ButtonListItem_1.ButtonListItem, Object.assign({ ix: 2, onClick: logOutFunction }, { children: "Log-Out" })))] }));
}
exports.AuthSegment = AuthSegment;
function TopBar() {
    return ((0, jsx_runtime_1.jsxs)("nav", Object.assign({ className: 'flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-md shadow-md bg-sky-dark font-fira-sans mb-0.5 items-center justify-between' }, { children: [(0, jsx_runtime_1.jsx)(exports.TopBarItems.Menu.Logo, {}), (0, jsx_runtime_1.jsx)(exports.TopBarItems.Menu.ModuleMenu, {}), (0, jsx_runtime_1.jsx)(AuthSegment, {})] })));
}
exports.TopBar = TopBar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9wQmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVG9wQmFyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBZ0Q7QUFDaEQsK0NBQWdFO0FBQ2hFLHVEQUFpRDtBQUNqRCw4Q0FBMkM7QUFDM0MsK0JBQTRCO0FBQzVCLCtCQUFxQztBQUVyQywrQ0FBNEM7QUFDNUMscURBQWtEO0FBQ2xELHVEQUFvRDtBQUNwRCx5Q0FBK0M7QUFDL0MsOERBQThEO0FBQzlELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzNELFNBQWdCLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQXNDO0lBQzNFLE9BQU8sQ0FDSCx1QkFBQyx1QkFBSSxrQkFBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUN6QixRQUFRLElBQ04sQ0FDVixDQUFDO0FBQ04sQ0FBQztBQU5ELGdDQU1DO0FBRUQsU0FBZ0IsVUFBVTtJQUN0QixPQUFPLENBQ0gsNkNBQUksU0FBUyxFQUFDLCtCQUErQixnQkFDeEMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUNsRCx1QkFBQyxpQ0FBZSxJQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBYSxFQUFFLEVBQUUsQ0FBQyxJQUFaLEtBQUssQ0FBVyxDQUNyRSxDQUFDLElBQ0QsQ0FDUixDQUFDO0FBQ04sQ0FBQztBQVJELGdDQVFDO0FBQ1ksUUFBQSxXQUFXLEdBQUc7SUFDdkIsV0FBVyxFQUFFO1FBQ1QsS0FBSyxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQ2IsR0FBRyxFQUFFLENBQUMsQ0FDRix1QkFBQyxpQ0FBZSxrQkFBQyxTQUFTLEVBQUMsNkJBQTZCLEVBQUMsRUFBRSxFQUFDLFFBQVEsNEJBRWxELENBQ3JCLEVBQ0QsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUNiO0tBQ0o7SUFDRCxJQUFJLEVBQUU7UUFDRixVQUFVLEVBQUUsZUFBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDbEMsUUFBUSxFQUFFLFNBQVM7UUFDbkIsZUFBZSxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQUMsNEJBQWlCLENBQUM7UUFDOUMsSUFBSSxFQUFFLGVBQUssQ0FBQyxJQUFJLENBQ1osR0FBRyxFQUFFO1lBQ0QsTUFBTSxVQUFVLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQXlCLEVBQUUsRUFBRSxDQUFDLElBQUEsU0FBRyxFQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdHLE9BQU8sQ0FDSCx1QkFBQywwQkFBTyxrQkFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBQyxHQUFHLGdCQUNsQyxnQ0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyx3QkFBd0IsR0FBTyxJQUNuRCxDQUNiLENBQUM7UUFDTixDQUFDLEVBQ0QsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUNiO0tBQ0o7Q0FDSixDQUFDO0FBRUYsU0FBZ0IsV0FBVztJQUN2QixNQUFNLEVBQUUsR0FBRyxJQUFBLHVCQUFjLEVBQUMsa0JBQVksQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sY0FBYyxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDcEMsSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWixJQUFBLGtCQUFZLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNULE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztJQUN0QyxPQUFPLENBQ0gsd0JBQUMseUJBQVcsZUFDUCxDQUFDLGVBQWUsSUFBSSx1QkFBQyxtQkFBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEtBQUcsRUFDckQsQ0FBQyxlQUFlLElBQUksdUJBQUMsK0JBQWMsa0JBQUMsRUFBRSxFQUFFLENBQUMsOEJBQTJCLEVBQ3BFLGVBQWUsSUFBSSxDQUNoQix1QkFBQywrQkFBYyxrQkFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLDZCQUU3QixDQUNwQixJQUNTLENBQ2pCLENBQUM7QUFDTixDQUFDO0FBbkJELGtDQW1CQztBQUNELFNBQWdCLE1BQU07SUFDbEIsT0FBTyxDQUNILCtDQUFLLFNBQVMsRUFBQyxrT0FBa08saUJBQzdPLHVCQUFDLG1CQUFXLENBQUMsSUFBSSxDQUFDLElBQUksS0FBRyxFQUN6Qix1QkFBQyxtQkFBVyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUcsRUFDL0IsdUJBQUMsV0FBVyxLQUFHLEtBQ2IsQ0FDVCxDQUFDO0FBQ04sQ0FBQztBQVJELHdCQVFDIn0=