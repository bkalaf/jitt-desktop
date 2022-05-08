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
exports.MenuListItem = exports.NavLinkListItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const useWhyDidYou_1 = require("../hooks/useWhyDidYou");
const _cn_1 = require("./$cn");
const toTitleCase_1 = require("../common/text/toTitleCase");
function NavLinkListItem(props) {
    (0, useWhyDidYou_1.useWhyDidYou)(NavLinkListItem.name, props);
    const _a = (0, _cn_1.$cn)(props, {}, 'nav-button'), { to, children, className } = _a, spread = __rest(_a, ["to", "children", "className"]);
    return ((0, jsx_runtime_1.jsx)("li", Object.assign({ className: 'flex' }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.NavLink, Object.assign({ className: ({ isActive }) => (isActive ? `${className} active` : `${className} not-active`), to: to }, spread, { children: children != null ? children : (0, toTitleCase_1.toTitleCase)(to) })) })));
}
exports.NavLinkListItem = NavLinkListItem;
function MenuListItem(props) {
    const classNameFunc = (baseCn) => ({ isActive }) => (0, _cn_1.$cn)(props, {
        active: isActive,
        'not-active': !isActive
    });
    const children = props.children ? (0, toTitleCase_1.toTitleCase)(props.to) : '';
}
exports.MenuListItem = MenuListItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmF2TGlua0xpc3RJdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTmF2TGlua0xpc3RJdGVtLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1REFBMkM7QUFDM0Msd0RBQXFEO0FBQ3JELCtCQUE0QjtBQUM1Qiw0REFBeUQ7QUFFekQsU0FBZ0IsZUFBZSxDQUFDLEtBQStFO0lBQzNHLElBQUEsMkJBQVksRUFBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFDLE1BQU0sS0FBeUMsSUFBQSxTQUFHLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxZQUFZLENBQUMsRUFBckUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsT0FBNEMsRUFBdkMsTUFBTSxjQUFwQywrQkFBc0MsQ0FBK0IsQ0FBQztJQUM1RSxPQUFPLENBQ0gsNkNBQUksU0FBUyxFQUFDLE1BQU0sZ0JBQ2hCLHVCQUFDLDBCQUFPLGtCQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsYUFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBTSxNQUFNLGNBQ25ILFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBQSx5QkFBVyxFQUFDLEVBQUUsQ0FBQyxJQUN4QyxJQUNULENBQ1IsQ0FBQztBQUNOLENBQUM7QUFWRCwwQ0FVQztBQUVELFNBQWdCLFlBQVksQ0FBQyxLQUF5QztJQUNsRSxNQUFNLGFBQWEsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBeUIsRUFBRSxFQUFFLENBQUMsSUFBQSxTQUFHLEVBQUMsS0FBSyxFQUFFO1FBQzFGLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFlBQVksRUFBRSxDQUFDLFFBQVE7S0FDMUIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBQSx5QkFBVyxFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRWpFLENBQUM7QUFQRCxvQ0FPQyJ9