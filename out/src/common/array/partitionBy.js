"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partitionBy = void 0;
function partitionBy(predicate) {
    function inner(arr, tAcc = [], fAcc = []) {
        if (arr.length === 0)
            return [tAcc, fAcc];
        const [head, ...tail] = arr;
        if (predicate(head)) {
            return inner(tail, [...tAcc, head], fAcc);
        }
        return inner(tail, tAcc, [...fAcc, head]);
    }
    return inner;
}
exports.partitionBy = partitionBy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGl0aW9uQnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL2FycmF5L3BhcnRpdGlvbkJ5LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixXQUFXLENBQUksU0FBNEI7SUFDdkQsU0FBUyxLQUFLLENBQUMsR0FBUSxFQUFFLE9BQVksRUFBRSxFQUFFLE9BQVksRUFBRTtRQUNuRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM1QixJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqQixPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBVkQsa0NBVUMifQ==