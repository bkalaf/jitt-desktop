"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconLinkButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_router_dom_1 = require("react-router-dom");
function IconLinkButton(props) {
    const { to, icon, title } = props;
    return ((0, jsx_runtime_1.jsx)("li", Object.assign({ className: 'inline-flex', title: title }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, Object.assign({ className: 'inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105', role: 'button', to: to }, { children: (0, jsx_runtime_1.jsx)("span", Object.assign({ className: 'px-2 py-1 border border-white rounded-md' }, { children: (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: icon, size: '1x', className: 'block font-bold ', fixedWidth: true }) })) })) })));
}
exports.IconLinkButton = IconLinkButton;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbkxpbmtCdXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9JY29uTGlua0J1dHRvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLHNFQUFpRTtBQUNqRSx1REFBd0M7QUFHeEMsU0FBZ0IsY0FBYyxDQUFDLEtBQTJEO0lBQ3RGLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNsQyxPQUFPLENBQ0gsNkNBQUksU0FBUyxFQUFDLGFBQWEsRUFBQyxLQUFLLEVBQUUsS0FBSyxnQkFDcEMsdUJBQUMsdUJBQUksa0JBQ0QsU0FBUyxFQUFDLHNVQUFzVSxFQUNoVixJQUFJLEVBQUMsUUFBUSxFQUNiLEVBQUUsRUFBRSxFQUFFLGdCQUNOLCtDQUFNLFNBQVMsRUFBQywwQ0FBMEMsZ0JBQ3RELHVCQUFDLG1DQUFlLElBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxrQkFBa0IsRUFBQyxVQUFVLFNBQUcsSUFDOUUsSUFDSixJQUNOLENBQ1IsQ0FBQztBQUNOLENBQUM7QUFkRCx3Q0FjQyJ9