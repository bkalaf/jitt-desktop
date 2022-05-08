"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStatus = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useAuth_1 = require("../hooks/useAuth");
const StatusItem_1 = require("./StatusItem");
function AuthStatus() {
    const { profileEmail } = (0, useAuth_1.useAuth)();
    return (0, jsx_runtime_1.jsx)(StatusItem_1.StatusItem, Object.assign({ className: 'text-white bg-blue' }, { children: profileEmail }));
}
exports.AuthStatus = AuthStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0aFN0YXR1cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0F1dGhTdGF0dXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSw4Q0FBMkM7QUFDM0MsNkNBQTBDO0FBRzFDLFNBQWdCLFVBQVU7SUFDdEIsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0lBQ25DLE9BQU8sdUJBQUMsdUJBQVUsa0JBQUMsU0FBUyxFQUFDLG9CQUFvQixnQkFBRSxZQUFZLElBQWMsQ0FBQztBQUNsRixDQUFDO0FBSEQsZ0NBR0MifQ==