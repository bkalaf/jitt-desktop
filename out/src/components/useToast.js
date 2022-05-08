"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = void 0;
const react_1 = require("react");
const ToasterProvider_1 = require("./providers/ToasterProvider");
function useToast(type) {
    const { addToast } = (0, ToasterProvider_1.useToaster)();
    return (0, react_1.useMemo)(() => addToast(type), [addToast, type]);
}
exports.useToast = useToast;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlVG9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy91c2VUb2FzdC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWdDO0FBQ2hDLGlFQUFvRTtBQUVwRSxTQUFnQixRQUFRLENBQUMsSUFBZTtJQUNwQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSw0QkFBVSxHQUFFLENBQUM7SUFDbEMsT0FBTyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBSEQsNEJBR0MifQ==