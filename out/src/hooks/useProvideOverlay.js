"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProvideOverlay = void 0;
const react_1 = require("react");
const _cn_1 = require("../components/$cn");
const isNotIn_1 = require("../common/array/isNotIn");
const cycleVisibility_1 = require("../components/cycleVisibility");
const useArray_1 = require("./useArray");
function useProvideOverlay() {
    const { arr: contents, append: appendOverlay, pop: popOverlay } = (0, useArray_1.useArray)([]);
    const [visibility, setVisibility] = (0, react_1.useState)('hidden');
    const changeVisibility = (0, react_1.useCallback)(() => {
        setVisibility(cycleVisibility_1.cycleVisibility);
    }, []);
    const props = (0, react_1.useMemo)(() => (0, _cn_1.$cn)({ onAnimationEnd: changeVisibility }, {
        hidden: visibility === 'hidden',
        flex: visibility !== 'hidden',
        slideInDown: visibility === 'showing',
        slideOutDown: visibility === 'hiding'
    }, 'w-screen h-screen p-5 items-center justify-center pointer-events-none'), [changeVisibility, visibility]);
    (0, react_1.useEffect)(() => {
        if (contents.length === 0 && (0, isNotIn_1.isNotIn)(['hiding', 'hidden'])(visibility)) {
            changeVisibility();
        }
        if (contents.length !== 0 && (0, isNotIn_1.isNotIn)(['showing', 'shown'])(visibility)) {
            changeVisibility();
        }
    }, [changeVisibility, contents.length, visibility]);
    return {
        contents,
        props,
        appendOverlay,
        popOverlay
    };
}
exports.useProvideOverlay = useProvideOverlay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlUHJvdmlkZU92ZXJsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaG9va3MvdXNlUHJvdmlkZU92ZXJsYXkudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFrRTtBQUNsRSwyQ0FBd0M7QUFFeEMscURBQWtEO0FBQ2xELG1FQUFnRTtBQUNoRSx5Q0FBc0M7QUFHdEMsU0FBZ0IsaUJBQWlCO0lBQzdCLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUEsbUJBQVEsRUFBYyxFQUFFLENBQUMsQ0FBQztJQUM1RixNQUFNLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBYSxRQUFRLENBQUMsQ0FBQztJQUNuRSxNQUFNLGdCQUFnQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDdEMsYUFBYSxDQUFDLGlDQUFlLENBQUMsQ0FBQztJQUNuQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFUCxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQU8sRUFDakIsR0FBRyxFQUFFLENBQUMsSUFBQSxTQUFHLEVBQ0wsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsRUFDcEM7UUFDSSxNQUFNLEVBQUUsVUFBVSxLQUFLLFFBQVE7UUFDL0IsSUFBSSxFQUFFLFVBQVUsS0FBSyxRQUFRO1FBQzdCLFdBQVcsRUFBRSxVQUFVLEtBQUssU0FBUztRQUNyQyxZQUFZLEVBQUUsVUFBVSxLQUFLLFFBQVE7S0FDeEMsRUFDRCx1RUFBdUUsQ0FDMUUsRUFDRCxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxDQUNqQyxDQUFDO0lBQ0YsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNYLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBQSxpQkFBTyxFQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDcEUsZ0JBQWdCLEVBQUUsQ0FBQztTQUN0QjtRQUNELElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBQSxpQkFBTyxFQUFDLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDcEUsZ0JBQWdCLEVBQUUsQ0FBQztTQUN0QjtJQUNMLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNwRCxPQUFPO1FBQ0gsUUFBUTtRQUNSLEtBQUs7UUFDTCxhQUFhO1FBQ2IsVUFBVTtLQUNiLENBQUM7QUFDTixDQUFDO0FBbENELDhDQWtDQyJ9