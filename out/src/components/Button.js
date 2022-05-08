"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const useWhyDidYou_1 = require("../hooks/useWhyDidYou");
const _cn_1 = require("./$cn");
function Button(props) {
    (0, useWhyDidYou_1.useWhyDidYou)(Button.name, props);
    const spread = (0, _cn_1.$cn)(props, {}, 'nav-button');
    return (0, jsx_runtime_1.jsx)("button", Object.assign({ type: 'button' }, spread));
}
exports.Button = Button;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQnV0dG9uLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0Esd0RBQXFEO0FBQ3JELCtCQUE0QjtBQUc1QixTQUFnQixNQUFNLENBQUMsS0FBK0U7SUFDbEcsSUFBQSwyQkFBWSxFQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBQSxTQUFHLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUM1QyxPQUFPLGlEQUFRLElBQUksRUFBQyxRQUFRLElBQUssTUFBTSxFQUFXLENBQUM7QUFDdkQsQ0FBQztBQUpELHdCQUlDIn0=