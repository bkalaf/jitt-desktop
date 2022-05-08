"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitAt = void 0;
function splitAt(predicate) {
    function inner(arr, accum = [], current = []) {
        if (arr.length == 0)
            return [...accum, current];
        const [h, ...t] = arr;
        if (predicate(h)) {
            return inner(t, [...accum, current], [h]);
        }
        return inner(t, accum, [...current, h]);
    }
    return (arr) => inner(arr);
}
exports.splitAt = splitAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXRBdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tb24vYXJyYXkvc3BsaXRBdC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsU0FBZ0IsT0FBTyxDQUFJLFNBQTRCO0lBQ25ELFNBQVMsS0FBSyxDQUFDLEdBQVEsRUFBRSxRQUFlLEVBQUUsRUFBRSxVQUFlLEVBQUU7UUFDekQsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDZixPQUFPLENBQUMsR0FBRyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNkLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxPQUFPLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQVhELDBCQVdDIn0=