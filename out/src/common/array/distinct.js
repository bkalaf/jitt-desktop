"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distinct = void 0;
function distinct(arr, accum = []) {
    if (arr.length === 0)
        return accum;
    const [head, ...tail] = arr;
    if (accum.includes(head))
        return distinct(tail, accum);
    return distinct(tail, [head, ...accum]);
}
exports.distinct = distinct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL2FycmF5L2Rpc3RpbmN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixRQUFRLENBQUksR0FBUSxFQUFFLFFBQWEsRUFBRTtJQUNqRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUNoQixPQUFPLEtBQUssQ0FBQztJQUNqQixNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzVCLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDcEIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBQyxHQUFHLEtBQUssQ0FBQyxDQUFJLENBQUE7QUFDN0MsQ0FBQztBQVBELDRCQU9DIn0=