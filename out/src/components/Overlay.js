"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Overlay = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const pro_duotone_svg_icons_1 = require("@fortawesome/pro-duotone-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_1 = require("react");
const OverlayProvider_1 = require("./providers/OverlayProvider");
function Overlay() {
    const { contents, popOverlay, props } = (0, OverlayProvider_1.useOverlay)();
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({}, props, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: 'container relative flex items-center justify-center p-5 text-white border rounded-lg shadow-lg pointer-events-auto bg-black/80 border-blue shadow-black' }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ type: 'button', className: 'absolute top-0 right-0 mt-2 mr-3 text-white bg-transparent border border-white rounded-lg', onClick: popOverlay, title: 'Close Window' }, { children: (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { size: 'lg', icon: pro_duotone_svg_icons_1.faWindowClose }) })), contents.map((x, ix) => (0, react_1.cloneElement)(x, Object.assign(Object.assign({}, x.props), { key: ix })))] })) })));
}
exports.Overlay = Overlay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL092ZXJsYXkudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw4RUFBbUU7QUFDbkUsc0VBQWlFO0FBQ2pFLGlDQUFxQztBQUNyQyxpRUFBeUQ7QUFFekQsU0FBZ0IsT0FBTztJQUNuQixNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFBLDRCQUFVLEdBQUUsQ0FBQztJQUNyRCxPQUFPLENBQ0gsZ0RBQVMsS0FBSyxjQUNWLCtDQUFLLFNBQVMsRUFBQyx5SkFBeUosaUJBQ3BLLGlEQUFRLElBQUksRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLDJGQUEyRixFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFDLGNBQWMsZ0JBQ2pLLHVCQUFDLG1DQUFlLElBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUUscUNBQWEsR0FBSSxJQUM3QyxFQUNSLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFBLG9CQUFZLEVBQUMsQ0FBQyxrQ0FBTyxDQUFDLENBQUMsS0FBSyxLQUFFLEdBQUcsRUFBRSxFQUFFLElBQUcsQ0FBQyxLQUNoRSxJQUNKLENBQ1QsQ0FBQztBQUNOLENBQUM7QUFaRCwwQkFZQyJ9