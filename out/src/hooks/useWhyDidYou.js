"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWhyDidYou = void 0;
const react_1 = require("react");
function useWhyDidYou(name, props) {
    // Get a mutable ref object where we can store props ...
    // ... for comparison next time this hook runs.
    const previousProps = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (previousProps.current != null) {
            // Get all keys from previous and current props
            const allKeys = Object.keys(Object.assign(Object.assign({}, previousProps.current), props));
            // Use this object to keep track of changed props
            const changesObj = {};
            // Iterate through keys
            allKeys.forEach((key) => {
                // If previous is different from current
                if (previousProps.current != null && previousProps.current[key] !== props[key]) {
                    // Add to changesObj
                    changesObj[key] = {
                        from: previousProps.current[key],
                        to: props[key]
                    };
                }
            });
            // If changesObj not empty then output to console
            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, changesObj);
            }
        }
        // Finally update previousProps with current props for next hook call
        previousProps.current = props;
    });
}
exports.useWhyDidYou = useWhyDidYou;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlV2h5RGlkWW91LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hvb2tzL3VzZVdoeURpZFlvdS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTBDO0FBRTFDLFNBQWdCLFlBQVksQ0FBZ0MsSUFBWSxFQUFFLEtBQVE7SUFDOUUsd0RBQXdEO0lBQ3hELCtDQUErQztJQUMvQyxNQUFNLGFBQWEsR0FBRyxJQUFBLGNBQU0sRUFBVyxJQUFJLENBQUMsQ0FBQztJQUM3QyxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ1gsSUFBSSxhQUFhLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtZQUMvQiwrQ0FBK0M7WUFDL0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksaUNBQU0sYUFBYSxDQUFDLE9BQU8sR0FBSyxLQUFLLEVBQUcsQ0FBQztZQUNwRSxpREFBaUQ7WUFDakQsTUFBTSxVQUFVLEdBQXdCLEVBQUUsQ0FBQztZQUMzQyx1QkFBdUI7WUFDdkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNwQix3Q0FBd0M7Z0JBQ3hDLElBQUksYUFBYSxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzVFLG9CQUFvQjtvQkFDcEIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHO3dCQUNkLElBQUksRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQzt3QkFDaEMsRUFBRSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7cUJBQ2pCLENBQUM7aUJBQ0w7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILGlEQUFpRDtZQUNqRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQzthQUN6RDtTQUNKO1FBQ0QscUVBQXFFO1FBQ3JFLGFBQWEsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTdCRCxvQ0E2QkMifQ==