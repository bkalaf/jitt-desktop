"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cycleVisibility = void 0;
function cycleVisibility(current) {
    switch (current) {
        case 'hidden':
            return 'showing';
        case 'hiding':
            return 'hidden';
        case 'shown':
            return 'hiding';
        case 'showing':
            return 'shown';
    }
}
exports.cycleVisibility = cycleVisibility;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ljbGVWaXNpYmlsaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvY3ljbGVWaXNpYmlsaXR5LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxTQUFnQixlQUFlLENBQUMsT0FBbUI7SUFDL0MsUUFBUSxPQUFPLEVBQUU7UUFDYixLQUFLLFFBQVE7WUFDVCxPQUFPLFNBQVMsQ0FBQztRQUNyQixLQUFLLFFBQVE7WUFDVCxPQUFPLFFBQVEsQ0FBQztRQUNwQixLQUFLLE9BQU87WUFDUixPQUFPLFFBQVEsQ0FBQztRQUNwQixLQUFLLFNBQVM7WUFDVixPQUFPLE9BQU8sQ0FBQztLQUN0QjtBQUNMLENBQUM7QUFYRCwwQ0FXQyJ9