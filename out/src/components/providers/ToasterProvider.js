"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToaster = exports.ToasterProvider = exports.ToasterContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useProvideToaster_1 = require("../../hooks/useProvideToaster");
const OverlayProvider_1 = require("./OverlayProvider");
exports.ToasterContext = (0, react_1.createContext)(undefined);
function ToasterProvider({ children }) {
    const [toasts, addToast, deleteToast] = (0, useProvideToaster_1.useProvideToaster)();
    return (0, jsx_runtime_1.jsx)(exports.ToasterContext.Provider, Object.assign({ value: { toasts, addToast, deleteToast } }, { children: children }));
}
exports.ToasterProvider = ToasterProvider;
function useToaster() {
    return (0, OverlayProvider_1.useProvidedContext)('Toaster', exports.ToasterContext);
}
exports.useToaster = useToaster;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9hc3RlclByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvcHJvdmlkZXJzL1RvYXN0ZXJQcm92aWRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLGlDQUFzQztBQUN0QyxxRUFBa0U7QUFFbEUsdURBQXVEO0FBUzFDLFFBQUEsY0FBYyxHQUFHLElBQUEscUJBQWEsRUFBOEIsU0FBUyxDQUFDLENBQUM7QUFFcEYsU0FBZ0IsZUFBZSxDQUFDLEVBQUUsUUFBUSxFQUEwQjtJQUNoRSxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLHFDQUFpQixHQUFFLENBQUM7SUFDNUQsT0FBTyx1QkFBQyxzQkFBYyxDQUFDLFFBQVEsa0JBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsZ0JBQUcsUUFBUSxJQUEyQixDQUFDO0FBQ25ILENBQUM7QUFIRCwwQ0FHQztBQUNELFNBQWdCLFVBQVU7SUFDdEIsT0FBTyxJQUFBLG9DQUFrQixFQUFDLFNBQVMsRUFBRSxzQkFBYyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUZELGdDQUVDIn0=