"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineStatus = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const pro_duotone_svg_icons_1 = require("@fortawesome/pro-duotone-svg-icons");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_1 = require("react");
const useEventListener_1 = require("../hooks/useEventListener");
const _cn_1 = require("./$cn");
const StatusItem_1 = require("./StatusItem");
function OnlineStatus() {
    const [onLine, setOnLine] = (0, react_1.useState)(window.navigator.onLine);
    const markOnLine = (0, react_1.useCallback)(() => setOnLine(true), []);
    const markOffline = (0, react_1.useCallback)(() => setOnLine(false), []);
    (0, useEventListener_1.useEventListener)('online', markOnLine, window);
    (0, useEventListener_1.useEventListener)('offline', markOffline, window);
    const spread = (0, _cn_1.$cn)({}, { 'bg-blue': onLine, 'bg-red': !onLine });
    return ((0, jsx_runtime_1.jsxs)(StatusItem_1.StatusItem, Object.assign({}, spread, { title: onLine ? 'on-line' : 'off-line' }, { children: [onLine && (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: pro_duotone_svg_icons_1.faWifi, size: 'lg', className: 'block text-xl font-extrabold text-black' }), !onLine && (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: pro_duotone_svg_icons_1.faWifiSlash, size: 'lg', className: 'block text-xl font-extrabold text-black' })] })));
}
exports.OnlineStatus = OnlineStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT25saW5lU3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvT25saW5lU3RhdHVzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsOEVBQXlFO0FBQ3pFLHNFQUFpRTtBQUNqRSxpQ0FBOEM7QUFDOUMsZ0VBQTZEO0FBRTdELCtCQUE0QjtBQUM1Qiw2Q0FBMEM7QUFFMUMsU0FBZ0IsWUFBWTtJQUN4QixNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlELE1BQU0sVUFBVSxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUQsTUFBTSxXQUFXLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1RCxJQUFBLG1DQUFnQixFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0MsSUFBQSxtQ0FBZ0IsRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELE1BQU0sTUFBTSxHQUFHLElBQUEsU0FBRyxFQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRSxPQUFPLENBQ0gsd0JBQUMsdUJBQVUsb0JBQ0gsTUFBTSxJQUNWLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxpQkFDckMsTUFBTSxJQUFJLHVCQUFDLG1DQUFlLElBQUMsSUFBSSxFQUFFLDhCQUFNLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBQyxTQUFTLEVBQUMseUNBQXlDLEdBQUcsRUFDekcsQ0FBQyxNQUFNLElBQUksdUJBQUMsbUNBQWUsSUFBQyxJQUFJLEVBQUUsbUNBQVcsRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyx5Q0FBeUMsR0FBRyxLQUN2RyxDQUNoQixDQUFDO0FBQ04sQ0FBQztBQWZELG9DQWVDIn0=