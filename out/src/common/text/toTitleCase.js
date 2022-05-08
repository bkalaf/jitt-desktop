"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = void 0;
const isTitleCase_1 = require("./isTitleCase");
const isPascalCase_1 = require("./isPascalCase");
const isSnakeCase_1 = require("./isSnakeCase");
const isUpper_1 = require("./isUpper");
const isCamelCase_1 = require("./isCamelCase");
const isKebabCase_1 = require("./isKebabCase");
const splitAt_1 = require("../array/splitAt");
const capitalize_1 = require("./capitalize");
const decapitalize_1 = require("./decapitalize");
const concatText_1 = require("./concatText");
const toLower_1 = require("./toLower");
function toTitleCase(str) {
    const splitted = (0, isKebabCase_1.isKebabCase)(str)
        ? str.split('-')
        : (0, isSnakeCase_1.isSnakeCase)(str)
            ? str.split('_')
            : (0, isCamelCase_1.isCamelCase)(str) || (0, isPascalCase_1.isPascalCase)(str)
                ? (0, splitAt_1.splitAt)(isUpper_1.isUpper)((0, decapitalize_1.decapitalize)(str).split('')).map(concatText_1.concatText)
                : (0, isTitleCase_1.isTitleCase)(str)
                    ? str.split(' ')
                    : [str];
    return splitted
        .map(toLower_1.toLower)
        .map(capitalize_1.capitalize)
        .join(' ');
}
exports.toTitleCase = toTitleCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9UaXRsZUNhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbW9uL3RleHQvdG9UaXRsZUNhc2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUE0QztBQUM1QyxpREFBOEM7QUFDOUMsK0NBQTRDO0FBQzVDLHVDQUFvQztBQUNwQywrQ0FBNEM7QUFDNUMsK0NBQTRDO0FBQzVDLDhDQUEyQztBQUMzQyw2Q0FBMEM7QUFDMUMsaURBQThDO0FBQzlDLDZDQUEwQztBQUMxQyx1Q0FBb0M7QUFFcEMsU0FBZ0IsV0FBVyxDQUFDLEdBQVc7SUFDbkMsTUFBTSxRQUFRLEdBQUcsSUFBQSx5QkFBVyxFQUFDLEdBQUcsQ0FBQztRQUM3QixDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDaEIsQ0FBQyxDQUFDLElBQUEseUJBQVcsRUFBQyxHQUFHLENBQUM7WUFDZCxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDaEIsQ0FBQyxDQUFDLElBQUEseUJBQVcsRUFBQyxHQUFHLENBQUMsSUFBSSxJQUFBLDJCQUFZLEVBQUMsR0FBRyxDQUFDO2dCQUNuQyxDQUFDLENBQUMsSUFBQSxpQkFBTyxFQUFDLGlCQUFPLENBQUMsQ0FBQyxJQUFBLDJCQUFZLEVBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLHVCQUFVLENBQUM7Z0JBQy9ELENBQUMsQ0FBQyxJQUFBLHlCQUFXLEVBQUMsR0FBRyxDQUFDO29CQUNkLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEIsT0FBTyxRQUFRO1NBQ1YsR0FBRyxDQUFDLGlCQUFPLENBQUM7U0FDWixHQUFHLENBQUMsdUJBQVUsQ0FBQztTQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBZEQsa0NBY0MifQ==