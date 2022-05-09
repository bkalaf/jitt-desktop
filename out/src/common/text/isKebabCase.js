"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKebabCase = void 0;
const isUpper_1 = require("./isUpper");
function isKebabCase(str) {
    return str.includes('-') && str.split('').every((x) => !(0, isUpper_1.isUpper)(x));
}
exports.isKebabCase = isKebabCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNLZWJhYkNhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3RleHQvaXNLZWJhYkNhc2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFvQztBQUVwQyxTQUFnQixXQUFXLENBQUMsR0FBVztJQUNuQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBQSxpQkFBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEUsQ0FBQztBQUZELGtDQUVDIn0=