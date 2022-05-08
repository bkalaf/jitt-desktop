"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectMap = void 0;
function objectMap(func) {
    return function (obj) {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
    };
}
exports.objectMap = objectMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0TWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RhdGEvb2JqZWN0TWFwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixTQUFTLENBQU8sSUFBaUI7SUFDN0MsT0FBTyxVQUFVLEdBQXNCO1FBQ25DLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakYsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUpELDhCQUlDIn0=