"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRightSidebar = exports.useLeftSidebar = exports.RightSidebarProvider = exports.LeftSidebarProvider = exports.RightSidebarContext = exports.LeftSidebarContext = exports.useProvideSidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const isIn_1 = require("../common/array/isIn");
const useArray_1 = require("../hooks/useArray");
const useVisibility_1 = require("../hooks/useVisibility");
const OverlayProvider_1 = require("./providers/OverlayProvider");
function useProvideSidebar(side) {
    const [visibility, cycleVisibility] = (0, useVisibility_1.useVisibility)('hidden');
    const { arr: contents, pop: popContents, append: appendContents } = (0, useArray_1.useArray)();
    (0, react_1.useEffect)(() => {
        if (contents.length > 0 && (0, isIn_1.isIn)(['hidden'])(visibility)) {
            cycleVisibility();
        }
        if (contents.length === 0 && visibility === 'shown') {
            cycleVisibility();
        }
    }, [contents, cycleVisibility, visibility]);
    return {
        side,
        visibility,
        cycleVisibility,
        contents,
        popContents,
        appendContents
    };
}
exports.useProvideSidebar = useProvideSidebar;
exports.LeftSidebarContext = (0, react_1.createContext)(undefined);
exports.RightSidebarContext = (0, react_1.createContext)(undefined);
function LeftSidebarProvider({ children }) {
    const value = useProvideSidebar('left');
    return (0, jsx_runtime_1.jsx)(exports.LeftSidebarContext.Provider, Object.assign({ value: value }, { children: children }));
}
exports.LeftSidebarProvider = LeftSidebarProvider;
function RightSidebarProvider({ children }) {
    const value = useProvideSidebar('right');
    return (0, jsx_runtime_1.jsx)(exports.RightSidebarContext.Provider, Object.assign({ value: value }, { children: children }));
}
exports.RightSidebarProvider = RightSidebarProvider;
function useLeftSidebar() {
    return (0, OverlayProvider_1.useProvidedContext)('LeftSidebar', exports.LeftSidebarContext);
}
exports.useLeftSidebar = useLeftSidebar;
function useRightSidebar() {
    return (0, OverlayProvider_1.useProvidedContext)('RightSidebar', exports.RightSidebarContext);
}
exports.useRightSidebar = useRightSidebar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lkZWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NpZGViYXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxpQ0FBaUQ7QUFDakQsK0NBQTRDO0FBQzVDLGdEQUE2QztBQUM3QywwREFBdUQ7QUFFdkQsaUVBQWlFO0FBUWpFLFNBQWdCLGlCQUFpQixDQUFDLElBQXlCO0lBQ3ZELE1BQU0sQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLEdBQUcsSUFBQSw2QkFBYSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlELE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUEsbUJBQVEsR0FBZSxDQUFDO0lBQzVGLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDWCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUEsV0FBSSxFQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNyRCxlQUFlLEVBQUUsQ0FBQztTQUNyQjtRQUNELElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksVUFBVSxLQUFLLE9BQU8sRUFBRTtZQUNqRCxlQUFlLEVBQUUsQ0FBQztTQUNyQjtJQUNMLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM1QyxPQUFPO1FBQ0gsSUFBSTtRQUNKLFVBQVU7UUFDVixlQUFlO1FBQ2YsUUFBUTtRQUNSLFdBQVc7UUFDWCxjQUFjO0tBQ2pCLENBQUE7QUFDTCxDQUFDO0FBbkJELDhDQW1CQztBQVdZLFFBQUEsa0JBQWtCLEdBQUcsSUFBQSxxQkFBYSxFQUE4QixTQUFTLENBQUMsQ0FBQztBQUMzRSxRQUFBLG1CQUFtQixHQUFHLElBQUEscUJBQWEsRUFBOEIsU0FBUyxDQUFDLENBQUM7QUFFekYsU0FBZ0IsbUJBQW1CLENBQUMsRUFBRSxRQUFRLEVBQTBCO0lBQ3BFLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sdUJBQUMsMEJBQWtCLENBQUMsUUFBUSxrQkFBQyxLQUFLLEVBQUUsS0FBSyxnQkFDM0MsUUFBUSxJQUNpQixDQUFBO0FBQ2xDLENBQUM7QUFMRCxrREFLQztBQUVELFNBQWdCLG9CQUFvQixDQUFDLEVBQUUsUUFBUSxFQUEwQjtJQUN4RSxNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxPQUFPLHVCQUFDLDJCQUFtQixDQUFDLFFBQVEsa0JBQUMsS0FBSyxFQUFFLEtBQUssZ0JBQzVDLFFBQVEsSUFDa0IsQ0FBQTtBQUNuQyxDQUFDO0FBTEQsb0RBS0M7QUFFRCxTQUFnQixjQUFjO0lBQzFCLE9BQU8sSUFBQSxvQ0FBa0IsRUFBQyxhQUFhLEVBQUUsMEJBQWtCLENBQUMsQ0FBQTtBQUNoRSxDQUFDO0FBRkQsd0NBRUM7QUFDRCxTQUFnQixlQUFlO0lBQzNCLE9BQU8sSUFBQSxvQ0FBa0IsRUFBQyxjQUFjLEVBQUUsMkJBQW1CLENBQUMsQ0FBQTtBQUNsRSxDQUFDO0FBRkQsMENBRUMifQ==