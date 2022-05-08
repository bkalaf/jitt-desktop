"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToken = void 0;
const react_1 = require("react");
function useToken() {
    const token = (0, react_1.useRef)(null);
    const setToken = (0, react_1.useCallback)((value) => {
        token.current = value;
    }, []);
    const clearToken = (0, react_1.useCallback)(() => (token.current = null), []);
    const hasToken = (0, react_1.useCallback)(() => token.current != null, []);
    return [token, hasToken, setToken, clearToken];
}
exports.useToken = useToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlVG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaG9va3MvdXNlVG9rZW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUE0QztBQUU1QyxTQUFnQixRQUFRO0lBTXBCLE1BQU0sS0FBSyxHQUFHLElBQUEsY0FBTSxFQUF3QixJQUFJLENBQUMsQ0FBQztJQUNsRCxNQUFNLFFBQVEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxLQUFxQixFQUFFLEVBQUU7UUFDbkQsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1AsTUFBTSxVQUFVLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqRSxNQUFNLFFBQVEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUQsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFiRCw0QkFhQyJ9