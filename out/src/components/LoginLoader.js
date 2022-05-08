"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = exports.LoginLoader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const OverlayProvider_1 = require("./providers/OverlayProvider");
const MainWindow_1 = require("./MainWindow");
function LoginLoader() {
    const overlay = (0, OverlayProvider_1.useOverlay)();
    (0, react_1.useEffect)(() => {
        overlay === null || overlay === void 0 ? void 0 : overlay.appendOverlay((0, jsx_runtime_1.jsx)(MainWindow_1.LoginPage, {}));
        return () => overlay === null || overlay === void 0 ? void 0 : overlay.popOverlay();
    }, [overlay]);
    return (0, jsx_runtime_1.jsx)(MainWindow_1.Spinner, {});
}
exports.LoginLoader = LoginLoader;
function Modal({ child }) {
    const { appendOverlay, popOverlay } = (0, OverlayProvider_1.useOverlay)();
    (0, react_1.useEffect)(() => {
        appendOverlay(child);
        return () => popOverlay();
    });
    return (0, jsx_runtime_1.jsx)(MainWindow_1.Spinner, {});
}
exports.Modal = Modal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5Mb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Mb2dpbkxvYWRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGlDQUFrQztBQUNsQyxpRUFBeUQ7QUFFekQsNkNBQWtEO0FBRWxELFNBQWdCLFdBQVc7SUFDdkIsTUFBTSxPQUFPLEdBQUcsSUFBQSw0QkFBVSxHQUFFLENBQUM7SUFDN0IsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNYLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxhQUFhLENBQUMsdUJBQUMsc0JBQVMsS0FBRyxDQUFDLENBQUM7UUFDdEMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsVUFBVSxFQUFFLENBQUM7SUFDdkMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNkLE9BQU8sdUJBQUMsb0JBQU8sS0FBRyxDQUFDO0FBQ3ZCLENBQUM7QUFQRCxrQ0FPQztBQUVELFNBQWdCLEtBQUssQ0FBQyxFQUFFLEtBQUssRUFBMEI7SUFDbkQsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFBLDRCQUFVLEdBQUUsQ0FBQztJQUNuRCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ1gsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLHVCQUFDLG9CQUFPLEtBQUcsQ0FBQTtBQUN0QixDQUFDO0FBUEQsc0JBT0MifQ==