"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toaster = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ToasterProvider_1 = require("./ToasterProvider");
function Toaster() {
    const toasts = (0, ToasterProvider_1.useToaster)().toasts;
    return (0, jsx_runtime_1.jsx)("div", Object.assign({ className: 'absolute top-0 flex flex-col-reverse w-1/5 h-full space-y-1 pointer-events-none left-2/3' }, { children: toasts() }));
}
exports.Toaster = Toaster;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9hc3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3Byb3ZpZGVycy9Ub2FzdGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsdURBQStDO0FBRS9DLFNBQWdCLE9BQU87SUFDbkIsTUFBTSxNQUFNLEdBQUcsSUFBQSw0QkFBVSxHQUFFLENBQUMsTUFBTSxDQUFDO0lBQ25DLE9BQU8sOENBQUssU0FBUyxFQUFDLDBGQUEwRixnQkFDM0csTUFBTSxFQUFFLElBQ1AsQ0FBQTtBQUNWLENBQUM7QUFMRCwwQkFLQyJ9