"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeftSidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_1 = require("react-router");
const _cn_1 = require("./$cn");
const Sidebar_1 = require("./Sidebar");
const NavMenu_1 = require("./NavMenu");
function LeftSidebar() {
    const { appendContents, contents, cycleVisibility, popContents, side, visibility } = (0, Sidebar_1.useLeftSidebar)();
    const props = (0, _cn_1.$cn)({ style: { maxWidth: '50%' }, onAnimationEnd: cycleVisibility }, {
        slideInLeft: visibility === 'showing',
        slideOutLeft: visibility === 'hiding',
        flex: visibility !== 'hidden',
        hidden: visibility === 'hidden'
    }, 'h-full w-1/4 resize-x bg-black/80 text-white rounded-r-lg border border-white left-0 top-0');
    const location = (0, react_router_1.useLocation)();
    (0, react_1.useEffect)(() => {
        if (location.pathname.startsWith('/data')) {
            appendContents((0, jsx_runtime_1.jsx)(NavMenu_1.NavMenu, {}));
            return () => popContents();
        }
        else {
            if (contents.length > 0) {
                popContents();
            }
        }
    }, [appendContents, contents.length, location.pathname, popContents]);
    return (0, jsx_runtime_1.jsx)("aside", Object.assign({}, props, { children: contents }));
}
exports.LeftSidebar = LeftSidebar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGVmdFNpZGViYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9MZWZ0U2lkZWJhci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGlDQUFrQztBQUNsQywrQ0FBMkM7QUFDM0MsK0JBQTRCO0FBQzVCLHVDQUEyQztBQUMzQyx1Q0FBb0M7QUFFcEMsU0FBZ0IsV0FBVztJQUN2QixNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFBLHdCQUFjLEdBQUUsQ0FBQztJQUN0RyxNQUFNLEtBQUssR0FBRyxJQUFBLFNBQUcsRUFBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLEVBQUU7UUFDL0UsV0FBVyxFQUFFLFVBQVUsS0FBSyxTQUFTO1FBQ3JDLFlBQVksRUFBRSxVQUFVLEtBQUssUUFBUTtRQUNyQyxJQUFJLEVBQUUsVUFBVSxLQUFLLFFBQVE7UUFDN0IsTUFBTSxFQUFFLFVBQVUsS0FBSyxRQUFRO0tBQ2xDLEVBQUUsNEZBQTRGLENBQUMsQ0FBQztJQUNqRyxNQUFNLFFBQVEsR0FBRyxJQUFBLDBCQUFXLEdBQUUsQ0FBQztJQUMvQixJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ1gsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN2QyxjQUFjLENBQUMsdUJBQUMsaUJBQU8sS0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTyxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM5QjthQUFNO1lBQ0gsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckIsV0FBVyxFQUFFLENBQUM7YUFDakI7U0FDSjtJQUNMLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN0RSxPQUFPLGtEQUFXLEtBQUssY0FDbEIsUUFBUSxJQUNMLENBQUM7QUFDYixDQUFDO0FBdEJELGtDQXNCQyJ9