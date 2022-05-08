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
exports.IndicatorGroup = exports.Indicator = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const pro_duotone_svg_icons_1 = require("@fortawesome/pro-duotone-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const _cn_1 = require("./$cn");
function Indicator(props) {
    const { prop, tag, className: $className } = props, remain = __rest(props, ["prop", "tag", "className"]);
    const _a = (0, _cn_1.$cn)(remain, {
        'hidden peer-required:flex': prop === 'required',
        'hidden peer-readonly:flex': prop === 'readOnly',
        'hidden peer-disabled:flex': prop === 'disabled',
        'hidden peer-invalid:flex': prop === 'invalid',
        hidden: prop === 'local' && tag !== 'OUTPUT',
        flex: prop === 'local' && tag === 'OUTPUT'
    }, $className), { size, icon } = _a, spread = __rest(_a, ["size", "icon"]);
    return ((0, jsx_runtime_1.jsx)("span", Object.assign({}, spread, { children: (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { size: size, icon: icon }) })));
}
exports.Indicator = Indicator;
function IndicatorGroup(props) {
    const { tag } = props;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Indicator, { prop: 'required', tag: tag, icon: pro_duotone_svg_icons_1.faExclamationCircle, size: 'lg', className: 'absolute top-0 right-0 text-white bg-red', title: 'Field is required.' }), (0, jsx_runtime_1.jsx)(Indicator, { prop: 'readOnly', tag: tag, icon: pro_duotone_svg_icons_1.faPenSlash, size: 'lg', className: 'absolute top-0 right-0 text-white bg-orange', title: 'Field is immutable.' }), (0, jsx_runtime_1.jsx)(Indicator, { prop: 'disabled', tag: tag, icon: pro_duotone_svg_icons_1.faBan, size: 'lg', className: 'absolute top-0 right-0 text-white bg-black', title: 'Field is disabled.' }), (0, jsx_runtime_1.jsx)(Indicator, { prop: 'invalid', tag: tag, icon: pro_duotone_svg_icons_1.faShieldXmark, size: 'lg', className: 'absolute top-0 right-0 text-white bg-magenta', title: 'Field is not valid.' }), (0, jsx_runtime_1.jsx)(Indicator, { prop: 'local', tag: tag, icon: pro_duotone_svg_icons_1.faCalculatorAlt, size: 'lg', className: 'absolute top-0 right-0 text-white bg-blue', title: 'Field is calculated.' })] }));
}
exports.IndicatorGroup = IndicatorGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5kaWNhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvSW5kaWNhdG9yLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw4RUFBNEg7QUFDNUgsc0VBQWlFO0FBQ2pFLCtCQUE0QjtBQWM1QixTQUFnQixTQUFTLENBQUMsS0FBc0I7SUFDNUMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsS0FBZ0IsS0FBSyxFQUFoQixNQUFNLFVBQUssS0FBSyxFQUF2RCw0QkFBK0MsQ0FBUSxDQUFDO0lBQzlELE1BQU0sS0FBNEIsSUFBQSxTQUFHLEVBQ2pDLE1BQU0sRUFDTjtRQUNJLDJCQUEyQixFQUFFLElBQUksS0FBSyxVQUFVO1FBQ2hELDJCQUEyQixFQUFFLElBQUksS0FBSyxVQUFVO1FBQ2hELDJCQUEyQixFQUFFLElBQUksS0FBSyxVQUFVO1FBQ2hELDBCQUEwQixFQUFFLElBQUksS0FBSyxTQUFTO1FBQzlDLE1BQU0sRUFBRSxJQUFJLEtBQUssT0FBTyxJQUFJLEdBQUcsS0FBSyxRQUFRO1FBQzVDLElBQUksRUFBRSxJQUFJLEtBQUssT0FBTyxJQUFJLEdBQUcsS0FBSyxRQUFRO0tBQzdDLEVBQ0QsVUFBVSxDQUNiLEVBWEssRUFBRSxJQUFJLEVBQUUsSUFBSSxPQVdqQixFQVhzQixNQUFNLGNBQXZCLGdCQUF5QixDQVc5QixDQUFDO0lBQ0YsT0FBTyxDQUNILGlEQUFVLE1BQU0sY0FDWix1QkFBQyxtQ0FBZSxJQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksR0FBSSxJQUN4QyxDQUNWLENBQUM7QUFDTixDQUFDO0FBbkJELDhCQW1CQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxLQUFzQjtJQUNqRCxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLE9BQU8sQ0FDSCw2REFDSSx1QkFBQyxTQUFTLElBQ04sSUFBSSxFQUFDLFVBQVUsRUFDZixHQUFHLEVBQUUsR0FBRyxFQUNSLElBQUksRUFBRSwyQ0FBbUIsRUFDekIsSUFBSSxFQUFDLElBQUksRUFDVCxTQUFTLEVBQUMsMENBQTBDLEVBQ3BELEtBQUssRUFBQyxvQkFBb0IsR0FDNUIsRUFDRix1QkFBQyxTQUFTLElBQ04sSUFBSSxFQUFDLFVBQVUsRUFDZixHQUFHLEVBQUUsR0FBRyxFQUNSLElBQUksRUFBRSxrQ0FBVSxFQUNoQixJQUFJLEVBQUMsSUFBSSxFQUNULFNBQVMsRUFBQyw2Q0FBNkMsRUFDdkQsS0FBSyxFQUFDLHFCQUFxQixHQUM3QixFQUNGLHVCQUFDLFNBQVMsSUFDTixJQUFJLEVBQUMsVUFBVSxFQUNmLEdBQUcsRUFBRSxHQUFHLEVBQ1IsSUFBSSxFQUFFLDZCQUFLLEVBQ1gsSUFBSSxFQUFDLElBQUksRUFDVCxTQUFTLEVBQUMsNENBQTRDLEVBQ3RELEtBQUssRUFBQyxvQkFBb0IsR0FDNUIsRUFDRix1QkFBQyxTQUFTLElBQ04sSUFBSSxFQUFDLFNBQVMsRUFDZCxHQUFHLEVBQUUsR0FBRyxFQUNSLElBQUksRUFBRSxxQ0FBYSxFQUNuQixJQUFJLEVBQUMsSUFBSSxFQUNULFNBQVMsRUFBQyw4Q0FBOEMsRUFDeEQsS0FBSyxFQUFDLHFCQUFxQixHQUM3QixFQUNGLHVCQUFDLFNBQVMsSUFDTixJQUFJLEVBQUMsT0FBTyxFQUNaLEdBQUcsRUFBRSxHQUFHLEVBQ1IsSUFBSSxFQUFFLHVDQUFlLEVBQ3JCLElBQUksRUFBQyxJQUFJLEVBQ1QsU0FBUyxFQUFDLDJDQUEyQyxFQUNyRCxLQUFLLEVBQUMsc0JBQXNCLEdBQzlCLElBQ0gsQ0FDTixDQUFDO0FBQ04sQ0FBQztBQTlDRCx3Q0E4Q0MifQ==