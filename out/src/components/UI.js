"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UI = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_dom_1 = require("react-dom");
const Overlay_1 = require("./Overlay");
const OverlayProvider_1 = require("./providers/OverlayProvider");
const ToasterProvider_1 = require("./providers/ToasterProvider");
const Sidebar_1 = require("./Sidebar");
function UI({ children }) {
    const container = document.getElementById('modal-root');
    return ((0, jsx_runtime_1.jsx)(ToasterProvider_1.ToasterProvider, { children: (0, jsx_runtime_1.jsx)(Sidebar_1.RightSidebarProvider, { children: (0, jsx_runtime_1.jsx)(Sidebar_1.LeftSidebarProvider, { children: (0, jsx_runtime_1.jsxs)(OverlayProvider_1.OverlayProvider, { children: [children, (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)(Overlay_1.Overlay, {}), container)] }) }) }) }));
}
exports.UI = UI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9VSS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHlDQUF5QztBQUN6Qyx1Q0FBb0M7QUFDcEMsaUVBQThEO0FBQzlELGlFQUE4RDtBQUM5RCx1Q0FBc0U7QUFFdEUsU0FBZ0IsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUEwQjtJQUNuRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBRSxDQUFDO0lBQ3pELE9BQU8sQ0FDSCx1QkFBQyxpQ0FBZSxjQUNaLHVCQUFDLDhCQUFvQixjQUNqQix1QkFBQyw2QkFBbUIsY0FDaEIsd0JBQUMsaUNBQWUsZUFDWCxRQUFRLEVBQ1IsSUFBQSx3QkFBWSxFQUFDLHVCQUFDLGlCQUFPLEtBQUcsRUFBRSxTQUFTLENBQUMsSUFDdkIsR0FDQSxHQUNILEdBQ1QsQ0FDckIsQ0FBQztBQUNOLENBQUM7QUFkRCxnQkFjQyJ9