"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = exports.usePreventDefault = exports.toastTypeMap = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_1 = require("react");
const _cn_1 = require("../$cn");
const useDeleteToast_1 = require("../../hooks/useDeleteToast");
const pro_duotone_svg_icons_1 = require("@fortawesome/pro-duotone-svg-icons");
const useToggle_1 = require("../../hooks/useToggle");
const useToken_1 = require("../../hooks/useToken");
const useVisibility_1 = require("../../hooks/useVisibility");
exports.toastTypeMap = {
    info: [pro_duotone_svg_icons_1.faExclamationSquare, 'bg-cyan-dark', 'bg-cyan', 'bg-cyan-light', 'INFO'],
    success: [pro_duotone_svg_icons_1.faThumbsUp, 'bg-emerald-dark', 'bg-emerald', 'bg-emerald-light', 'SUCCESS'],
    failure: [pro_duotone_svg_icons_1.faBanParking, 'bg-red-dark', 'bg-red', 'bg-red-light', 'FAILURE'],
    error: [pro_duotone_svg_icons_1.faBug, 'bg-indigo-dark', 'bg-indigo', 'bg-indigo-light', 'ERROR'],
    warning: [pro_duotone_svg_icons_1.faTrafficCone, 'bg-orange-dark', 'bg-orange', 'bg-orange-light', 'WARNING']
};
function usePreventDefault() {
    return (0, react_1.useCallback)((ev) => {
        ev.stopPropagation();
    }, []);
}
exports.usePreventDefault = usePreventDefault;
function Toast(props) {
    const { title, subtitle, body, icon, bg, bgDark, bgLight, id } = props;
    const deleteToast = (0, useDeleteToast_1.useDeleteToast)();
    const [visibility, changeVisibility] = (0, useVisibility_1.useVisibility)('showing');
    const [isLocked, toggleLock] = (0, useToggle_1.useToggle)();
    const onAnimationEnd = (0, react_1.useCallback)(() => {
        if (visibility === 'hiding' || visibility === 'showing') {
            changeVisibility();
        }
    }, [changeVisibility, visibility]);
    const spread = (0, _cn_1.$cn)({ onAnimationEnd }, {
        hidden: visibility === 'hidden',
        flex: visibility !== 'hidden',
        bounceInDown: visibility === 'showing',
        fadeOutRight: visibility === 'hiding'
    }, 'flex flex-row border border-black rounded-lg pointer-events-auto items-center justify-center duration-1000 delay-150 ease-in-out');
    const [token, hasToken, setToken, clearToken] = (0, useToken_1.useToken)();
    (0, react_1.useEffect)(() => {
        if (isLocked) {
            clearToken();
        }
    }, [changeVisibility, clearToken, isLocked]);
    (0, react_1.useEffect)(() => {
        if (visibility === 'shown' && !isLocked) {
            if (hasToken()) {
                clearToken();
            }
            const cb = setTimeout(() => changeVisibility(), 12000);
            setToken(cb);
            return () => {
                clearTimeout(cb);
                clearToken();
            };
        }
        if (visibility === 'hiding' && hasToken()) {
            clearTimeout(token.current);
            clearToken();
        }
        if (visibility === 'hidden') {
            deleteToast(id);
        }
    }, [changeVisibility, clearToken, deleteToast, hasToken, id, isLocked, setToken, token, visibility]);
    const prevent = usePreventDefault();
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ role: 'button' }, spread, { onClick: changeVisibility }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: `${bg} flex items-center justify-center h-full text-black ` }, { children: (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { className: 'w-10 h-10', icon: icon, size: '2x' }) })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: 'flex flex-grow items-center justify-center flex-col p-0.5' }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: `flex ${bgDark} text-white font-fira-sans text-xl tracking-wide leading-loose justify-center  text-center font-bold w-full` }, { children: title })), (0, jsx_runtime_1.jsx)("span", Object.assign({ className: `flex ${bg} text-black font-fira-sans text-lg font-bold whitespace-pre text-center justify-center w-full` }, { children: subtitle !== null && subtitle !== void 0 ? subtitle : ' ' })), (0, jsx_runtime_1.jsx)("p", Object.assign({ className: `flex ${bgLight} text-black text-base font-fira-sans font-normal text-left w-full justify-center ` }, { children: body })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: `flex w-full ${bgDark}`, onClick: prevent }, { children: [(0, jsx_runtime_1.jsx)("label", Object.assign({ className: 'flex text-base font-normal', htmlFor: 'lock' }, { children: "Lock this notification" })), (0, jsx_runtime_1.jsx)("input", { className: 'flex', type: 'checkbox', name: 'lock', id: 'lock', checked: isLocked, onChange: toggleLock })] }))] }))] })));
}
exports.Toast = Toast;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9wcm92aWRlcnMvVG9hc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxzRUFBaUU7QUFDakUsaUNBQStDO0FBQy9DLGdDQUE2QjtBQUM3QiwrREFBNEQ7QUFFNUQsOEVBQXlIO0FBRXpILHFEQUFrRDtBQUNsRCxtREFBZ0Q7QUFDaEQsNkRBQTBEO0FBRTdDLFFBQUEsWUFBWSxHQUF3RTtJQUM3RixJQUFJLEVBQUUsQ0FBQywyQ0FBbUIsRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUM7SUFDL0UsT0FBTyxFQUFFLENBQUMsa0NBQVUsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxDQUFDO0lBQ3JGLE9BQU8sRUFBRSxDQUFDLG9DQUFZLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDO0lBQzNFLEtBQUssRUFBRSxDQUFDLDZCQUFLLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLE9BQU8sQ0FBQztJQUN6RSxPQUFPLEVBQUUsQ0FBQyxxQ0FBYSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLENBQUM7Q0FDeEYsQ0FBQztBQVdGLFNBQWdCLGlCQUFpQjtJQUM3QixPQUFPLElBQUEsbUJBQVcsRUFBQyxDQUFDLEVBQXFDLEVBQUUsRUFBRTtRQUN6RCxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUpELDhDQUlDO0FBQ0QsU0FBZ0IsS0FBSyxDQUFDLEtBQWlCO0lBQ25DLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFP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