"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayProvider = exports.useOverlay = exports.useProvidedContext = exports.OverlayContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useProvideOverlay_1 = require("../../hooks/useProvideOverlay");
exports.OverlayContext = (0, react_1.createContext)(undefined);
function useProvidedContext(name, Context) {
    const context = (0, react_1.useContext)(Context);
    if (context == null)
        throw new Error(`${name}: bad null context`);
    return context;
}
exports.useProvidedContext = useProvidedContext;
function useOverlay() {
    return useProvidedContext('OverlayContext', exports.OverlayContext);
}
exports.useOverlay = useOverlay;
function OverlayProvider({ children }) {
    const overlay = (0, useProvideOverlay_1.useProvideOverlay)();
    return (0, jsx_runtime_1.jsx)(exports.OverlayContext.Provider, Object.assign({ value: overlay }, { children: children }));
}
exports.OverlayProvider = OverlayProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3ZlcmxheVByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvcHJvdmlkZXJzL092ZXJsYXlQcm92aWRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLGlDQUE2RTtBQUM3RSxxRUFBa0U7QUFTckQsUUFBQSxjQUFjLEdBQUcsSUFBQSxxQkFBYSxFQUE4QixTQUFTLENBQUMsQ0FBQztBQUVwRixTQUFnQixrQkFBa0IsQ0FBSSxJQUFZLEVBQUUsT0FBeUI7SUFDekUsTUFBTSxPQUFPLEdBQUcsSUFBQSxrQkFBVSxFQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLElBQUksT0FBTyxJQUFJLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sT0FBUSxDQUFDO0FBQ3BCLENBQUM7QUFKRCxnREFJQztBQUNELFNBQWdCLFVBQVU7SUFDdEIsT0FBTyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBYyxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUZELGdDQUVDO0FBQ0QsU0FBZ0IsZUFBZSxDQUFDLEVBQUUsUUFBUSxFQUEwQjtJQUNoRSxNQUFNLE9BQU8sR0FBRyxJQUFBLHFDQUFpQixHQUFFLENBQUM7SUFDcEMsT0FBTyx1QkFBQyxzQkFBYyxDQUFDLFFBQVEsa0JBQUMsS0FBSyxFQUFFLE9BQU8sZ0JBQUcsUUFBUSxJQUEyQixDQUFDO0FBQ3pGLENBQUM7QUFIRCwwQ0FHQyJ9