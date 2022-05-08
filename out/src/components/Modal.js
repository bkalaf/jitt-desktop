"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const OverlayProvider_1 = require("./providers/OverlayProvider");
const MainWindow_1 = require("./MainWindow");
function Modal({ children }) {
    const { appendOverlay, popOverlay } = (0, OverlayProvider_1.useOverlay)();
    (0, react_1.useEffect)(() => {
        appendOverlay(children);
        return () => popOverlay();
    });
    return (0, jsx_runtime_1.jsx)(MainWindow_1.Spinner, {});
}
exports.Modal = Modal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9Nb2RhbC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGlDQUFrQztBQUNsQyxpRUFBeUQ7QUFFekQsNkNBQXVDO0FBR3ZDLFNBQWdCLEtBQUssQ0FBQyxFQUFFLFFBQVEsRUFBOEI7SUFDMUQsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFBLDRCQUFVLEdBQUUsQ0FBQztJQUNuRCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ1gsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLHVCQUFDLG9CQUFPLEtBQUcsQ0FBQztBQUN2QixDQUFDO0FBUEQsc0JBT0MifQ==