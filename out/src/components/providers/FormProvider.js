"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormContext = exports.FormProvider = exports.FormContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const OverlayProvider_1 = require("./OverlayProvider");
exports.FormContext = (0, react_1.createContext)(undefined);
function FormProvider({ children, register }) {
    return (0, jsx_runtime_1.jsx)(exports.FormContext.Provider, Object.assign({ value: { register } }, { children: children }));
}
exports.FormProvider = FormProvider;
function useFormContext() {
    return (0, OverlayProvider_1.useProvidedContext)('Form', exports.FormContext);
}
exports.useFormContext = useFormContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybVByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvcHJvdmlkZXJzL0Zvcm1Qcm92aWRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGlDQUFzQztBQUV0Qyx1REFBdUQ7QUFLMUMsUUFBQSxXQUFXLEdBQUcsSUFBQSxxQkFBYSxFQUEyQixTQUFTLENBQUMsQ0FBQTtBQUU3RSxTQUFnQixZQUFZLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUE4RztJQUMzSixPQUFPLHVCQUFDLG1CQUFXLENBQUMsUUFBUSxrQkFBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsZ0JBQzNDLFFBQVEsSUFDVSxDQUFDO0FBQzVCLENBQUM7QUFKRCxvQ0FJQztBQUVELFNBQWdCLGNBQWM7SUFDMUIsT0FBTyxJQUFBLG9DQUFrQixFQUFDLE1BQU0sRUFBRSxtQkFBVyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUZELHdDQUVDIn0=