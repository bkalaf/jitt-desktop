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
exports.ButtonListItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useWhyDidYou_1 = require("../hooks/useWhyDidYou");
const _cn_1 = require("./$cn");
const Button_1 = require("./Button");
function ButtonListItem(props) {
    (0, useWhyDidYou_1.useWhyDidYou)(ButtonListItem.name, props);
    const _a = (0, _cn_1.$cn)(props, {}, 'px-2 py-1 nav-button auth-button py-1.5'), { ix } = _a, spread = __rest(_a, ["ix"]);
    return ((0, jsx_runtime_1.jsx)("li", Object.assign({ className: 'flex' }, { children: (0, jsx_runtime_1.jsx)(Button_1.Button, Object.assign({}, spread)) }), ix));
}
exports.ButtonListItem = ButtonListItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uTGlzdEl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9CdXR0b25MaXN0SXRlbS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esd0RBQXFEO0FBQ3JELCtCQUE0QjtBQUM1QixxQ0FBa0M7QUFHbEMsU0FBb0IsY0FBYyxDQUFDLEtBQTBGO0lBQ3pILElBQUEsMkJBQVksRUFBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sS0FBb0IsSUFBQSxTQUFHLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSx5Q0FBeUMsQ0FBQyxFQUE3RSxFQUFFLEVBQUUsT0FBeUUsRUFBcEUsTUFBTSxjQUFmLE1BQWlCLENBQTRELENBQUM7SUFDcEYsT0FBTyxDQUNILDZDQUFhLFNBQVMsRUFBQyxNQUFNLGdCQUN6Qix1QkFBQyxlQUFNLG9CQUFLLE1BQU0sRUFBVyxLQUR4QixFQUFFLENBRU4sQ0FDUixDQUFDO0FBQ04sQ0FBQztBQVJELHdDQVFDIn0=