"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = exports.chars = void 0;
const charRange_1 = require("./charRange");
const createFrom_1 = require("./createFrom");
exports.chars = {
    lower: (0, charRange_1.charRange)('a', 'z'),
    upper: (0, charRange_1.charRange)('A', 'Z'),
    digit: (0, charRange_1.charRange)('0', '9'),
    symbols: ['-'.charCodeAt(0), '_'.charCodeAt(0)]
};
function generateRandomString(len) {
    const arr = (0, createFrom_1.createFrom)(() => Math.random(), len);
    const chs = [...exports.chars.lower, ...exports.chars.upper, ...exports.chars.digit, ...exports.chars.symbols];
    return arr.map((x) => String.fromCharCode(chs[Math.floor(x * chs.length)])).join('');
}
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVSYW5kb21TdHJpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9wcm92aWRlcnMvZ2VuZXJhdGVSYW5kb21TdHJpbmcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUF3QztBQUN4Qyw2Q0FBMEM7QUFFN0IsUUFBQSxLQUFLLEdBQUc7SUFDakIsS0FBSyxFQUFFLElBQUEscUJBQVMsRUFBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQzFCLEtBQUssRUFBRSxJQUFBLHFCQUFTLEVBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUMxQixLQUFLLEVBQUUsSUFBQSxxQkFBUyxFQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDMUIsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2xELENBQUM7QUFDRixTQUFnQixvQkFBb0IsQ0FBQyxHQUFXO0lBQzVDLE1BQU0sR0FBRyxHQUFHLElBQUEsdUJBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDakQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLGFBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxhQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsYUFBSyxDQUFDLEtBQUssRUFBRSxHQUFHLGFBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUpELG9EQUlDIn0=