"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProvideToaster = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fst_1 = require("../common/fst");
const generateRandomString_1 = require("../components/providers/generateRandomString");
const snd_1 = require("../common/snd");
const Toast_1 = require("../components/providers/Toast");
function useProvideToaster() {
    const [map, setMap] = (0, react_1.useState)([]);
    const toasts = (0, react_1.useCallback)(() => map.map(snd_1.snd), [map]);
    const append = (0, react_1.useCallback)((item) => {
        setMap((prev) => [...prev, [item.props.id, item]]);
    }, []);
    const remove = (0, react_1.useCallback)((id) => {
        setMap((prev) => [...prev.filter((x) => (0, fst_1.fst)(x) !== id)]);
    }, []);
    const addToast = (0, react_1.useCallback)((type) => {
        return function (body, title, subtitle) {
            const [icon, bgDark, bg, bgLight, titleDefault] = Toast_1.toastTypeMap[type];
            const id = (0, generateRandomString_1.generateRandomString)(24);
            const el = ((0, jsx_runtime_1.jsx)(Toast_1.Toast, { id: id, icon: icon, bg: bg, bgLight: bgLight, bgDark: bgDark, subtitle: subtitle, body: body, title: title !== null && title !== void 0 ? title : titleDefault }, id));
            append(el);
        };
    }, [append]);
    return [toasts, addToast, remove];
}
exports.useProvideToaster = useProvideToaster;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlUHJvdmlkZVRvYXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaG9va3MvdXNlUHJvdmlkZVRvYXN0ZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxpQ0FBdUQ7QUFDdkQsdUNBQW9DO0FBQ3BDLHVGQUFvRjtBQUNwRix1Q0FBb0M7QUFDcEMseURBQW9FO0FBR3BFLFNBQWdCLGlCQUFpQjtJQUs3QixNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBMEIsRUFBRSxDQUFDLENBQUM7SUFDNUQsTUFBTSxNQUFNLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RELE1BQU0sTUFBTSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQWlCLEVBQUUsRUFBRTtRQUM3QyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1AsTUFBTSxNQUFNLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsRUFBVSxFQUFFLEVBQUU7UUFDdEMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSxTQUFHLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLE1BQU0sUUFBUSxHQUFHLElBQUEsbUJBQVcsRUFDeEIsQ0FBQyxJQUFlLEVBQUUsRUFBRTtRQUNoQixPQUFPLFVBQVUsSUFBWSxFQUFFLEtBQWMsRUFBRSxRQUFpQjtZQUM1RCxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxHQUFHLG9CQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckUsTUFBTSxFQUFFLEdBQUcsSUFBQSwyQ0FBb0IsRUFBQyxFQUFFLENBQUMsQ0FBQztZQUNwQyxNQUFNLEVBQUUsR0FBRyxDQUNQLHVCQUFDLGFBQUssSUFDRixFQUFFLEVBQUUsRUFBRSxFQUVOLElBQUksRUFBRSxJQUFJLEVBQ1YsRUFBRSxFQUFFLEVBQUUsRUFDTixPQUFPLEVBQUUsT0FBTyxFQUNoQixNQUFNLEVBQUUsTUFBTSxFQUNkLFFBQVEsRUFBRSxRQUFRLEVBQ2xCLElBQUksRUFBRSxJQUFJLEVBQ1YsS0FBSyxFQUFFLEtBQUssYUFBTCxLQUFLLGNBQUwsS0FBSyxHQUFJLFlBQVksSUFQdkIsRUFBRSxDQVFULENBQ0wsQ0FBQztZQUNGLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNmLENBQUMsQ0FBQztJQUNOLENBQUMsRUFDRCxDQUFDLE1BQU0sQ0FBQyxDQUNYLENBQUM7SUFDRixPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBdENELDhDQXNDQyJ9