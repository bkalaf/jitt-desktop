"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFrom = void 0;
function createFrom(func, qty) {
    if (qty === 0)
        return [];
    return [func(), ...createFrom(func, qty - 1)];
}
exports.createFrom = createFrom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRnJvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3Byb3ZpZGVycy9jcmVhdGVGcm9tLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixVQUFVLENBQUksSUFBYSxFQUFFLEdBQVc7SUFDcEQsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNULE9BQU8sRUFBRSxDQUFDO0lBQ2QsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBSkQsZ0NBSUMifQ==