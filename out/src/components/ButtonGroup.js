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
exports.ButtonGroup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useWhyDidYou_1 = require("../hooks/useWhyDidYou");
const _cn_1 = require("./$cn");
function ButtonGroup(props) {
    (0, useWhyDidYou_1.useWhyDidYou)(ButtonGroup.name, props);
    const _a = (0, _cn_1.$cn)(props, {}, 'flex space-x-2 flex-row p-3'), { children } = _a, spread = __rest(_a, ["children"]);
    return (0, jsx_runtime_1.jsx)("ol", Object.assign({}, spread, { children: children }));
}
exports.ButtonGroup = ButtonGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9CdXR0b25Hcm91cC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esd0RBQXFEO0FBQ3JELCtCQUE0QjtBQUc1QixTQUFnQixXQUFXLENBQUMsS0FBOEI7SUFDdEQsSUFBQSwyQkFBWSxFQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsTUFBTSxLQUEwQixJQUFBLFNBQUcsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLDZCQUE2QixDQUFDLEVBQXZFLEVBQUUsUUFBUSxPQUE2RCxFQUF4RCxNQUFNLGNBQXJCLFlBQXVCLENBQWdELENBQUM7SUFDOUUsT0FBTywrQ0FBUSxNQUFNLGNBQUcsUUFBUSxJQUFNLENBQUM7QUFDM0MsQ0FBQztBQUpELGtDQUlDIn0=