"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangeBetween = void 0;
function rangeBetween(start, end) {
    if (start === end)
        return [start];
    return [start, ...rangeBetween(start + 1, end)];
}
exports.rangeBetween = rangeBetween;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2VCZXR3ZWVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1vbi9hcnJheS9yYW5nZUJldHdlZW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLFlBQVksQ0FBQyxLQUFhLEVBQUUsR0FBVztJQUNuRCxJQUFJLEtBQUssS0FBSyxHQUFHO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFKRCxvQ0FJQyJ9