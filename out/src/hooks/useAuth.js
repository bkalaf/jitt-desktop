"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const client_1 = require("@apollo/client");
const react_1 = require("react");
const App_1 = require("../components/App");
function useAuth() {
    var _a;
    const currentUser = (0, client_1.useReactiveVar)(App_1.$currentUser);
    const isAuthenticated = (0, react_1.useMemo)(() => currentUser != null, [currentUser]);
    const profileEmail = (0, react_1.useMemo)(() => { var _a; return (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.profile) === null || _a === void 0 ? void 0 : _a.email; }, [(_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.profile) === null || _a === void 0 ? void 0 : _a.email]);
    const accessToken = (0, react_1.useMemo)(() => currentUser === null || currentUser === void 0 ? void 0 : currentUser.accessToken, [currentUser === null || currentUser === void 0 ? void 0 : currentUser.accessToken]);
    return {
        isAuthenticated,
        profileEmail,
        accessToken
    };
}
exports.useAuth = useAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlQXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VBdXRoLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBZ0Q7QUFDaEQsaUNBQTZDO0FBQzdDLDJDQUFpRDtBQUVqRCxTQUFnQixPQUFPOztJQUNuQixNQUFNLFdBQVcsR0FBRyxJQUFBLHVCQUFjLEVBQUMsa0JBQVksQ0FBQyxDQUFDO0lBQ2pELE1BQU0sZUFBZSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE1BQU0sWUFBWSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxXQUFDLE9BQUEsTUFBQSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsT0FBTywwQ0FBRSxLQUFLLENBQUEsRUFBQSxFQUFFLENBQUMsTUFBQSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsT0FBTywwQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQy9GLE1BQU0sV0FBVyxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxXQUFXLEVBQUUsQ0FBQyxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN4RixPQUFPO1FBQ0gsZUFBZTtRQUNmLFlBQVk7UUFDWixXQUFXO0tBQ2QsQ0FBQztBQUNOLENBQUM7QUFWRCwwQkFVQyJ9