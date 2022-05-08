"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVisibility = void 0;
const react_1 = require("react");
const cycleVisibility_1 = require("../components/cycleVisibility");
function useVisibility(init = 'hidden') {
    const [state, setState] = (0, react_1.useState)(init);
    const changeState = (0, react_1.useCallback)(() => {
        setState((prev) => {
            const next = (0, cycleVisibility_1.cycleVisibility)(prev);
            console.log(`visibility changed: ${next}`);
            return next;
        });
    }, []);
    return [state, changeState];
}
exports.useVisibility = useVisibility;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlVmlzaWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VWaXNpYmlsaXR5LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBOEM7QUFDOUMsbUVBQWdFO0FBR2hFLFNBQWdCLGFBQWEsQ0FBQyxPQUFtQixRQUFRO0lBQ3JELE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFhLElBQUksQ0FBQyxDQUFDO0lBQ3JELE1BQU0sV0FBVyxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDakMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDZCxNQUFNLElBQUksR0FBRyxJQUFBLGlDQUFlLEVBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMzQyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNQLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQVZELHNDQVVDIn0=