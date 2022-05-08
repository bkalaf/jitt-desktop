"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEventListener = void 0;
const react_1 = require("react");
function useEventListener(name, listener, source) {
    const handler = (0, react_1.useRef)(listener);
    (0, react_1.useEffect)(() => {
        handler.current = listener;
    }, [listener]);
    (0, react_1.useEffect)(() => {
        source.addEventListener(name, handler.current);
        return () => source.removeEventListener(name, handler.current);
    });
}
exports.useEventListener = useEventListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlRXZlbnRMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VFdmVudExpc3RlbmVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBMEM7QUFFMUMsU0FBZ0IsZ0JBQWdCLENBQXVCLElBQVksRUFBRSxRQUE4QixFQUFFLE1BQXVCO0lBQ3hILE1BQU0sT0FBTyxHQUFHLElBQUEsY0FBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDWCxPQUFPLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUMvQixDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2YsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNYLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBVEQsNENBU0MifQ==