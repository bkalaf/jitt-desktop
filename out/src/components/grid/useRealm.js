"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealm = void 0;
const client_1 = require("@apollo/client");
const App_1 = require("../App");
function useRealm() {
    return (0, client_1.useReactiveVar)(App_1.$realm);
}
exports.useRealm = useRealm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlUmVhbG0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9ncmlkL3VzZVJlYWxtLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBZ0Q7QUFDaEQsZ0NBQWdDO0FBRWhDLFNBQWdCLFFBQVE7SUFDcEIsT0FBTyxJQUFBLHVCQUFjLEVBQUMsWUFBTSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUZELDRCQUVDIn0=