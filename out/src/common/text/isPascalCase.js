"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPascalCase = void 0;
const isLower_1 = require("./isLower");
const isUpper_1 = require("./isUpper");
function isPascalCase(str) {
    return !str.includes('-') && !str.includes('_') && !str.includes(' ') && str.split('').some(isLower_1.isLower) && (0, isUpper_1.isUpper)(str[0]);
}
exports.isPascalCase = isPascalCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNQYXNjYWxDYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi90ZXh0L2lzUGFzY2FsQ2FzZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW9DO0FBQ3BDLHVDQUFvQztBQUVwQyxTQUFnQixZQUFZLENBQUMsR0FBVztJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFPLENBQUMsSUFBSSxJQUFBLGlCQUFPLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUgsQ0FBQztBQUZELG9DQUVDIn0=