"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = exports.selectAll = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_query_1 = require("react-query");
const toTitleCase_1 = require("../../common/text/toTitleCase");
const MainWindow_1 = require("../MainWindow");
const CommandBarProvider_1 = require("../providers/CommandBarProvider");
const Boundary_1 = require("./Boundary");
const useRealm_1 = require("./useRealm");
function selectAll(params) {
    return () => {
        try {
            const { realm, collection, sort } = params;
            return Promise.resolve(realm.objects(collection).sorted(sort));
        }
        catch (error) {
            Promise.reject(error);
        }
    };
}
exports.selectAll = selectAll;
function Grid() {
    const collectionName = (0, MainWindow_1.useCollectionParam)();
    const schema = (0, MainWindow_1.useSchema)();
    const sort = (0, react_1.useMemo)(() => { var _a, _b; return (_b = (_a = schema.getType(collectionName)) === null || _a === void 0 ? void 0 : _a.sort.map((x) => [x, false])) !== null && _b !== void 0 ? _b : []; }, [collectionName, schema]);
    const columns = schema.getColumns(collectionName);
    const realm = (0, useRealm_1.useRealm)();
    (0, CommandBarProvider_1.useProvideInsertCommand)();
    // useProvideDeleteCommand();
    const query = (0, react_1.useMemo)(() => selectAll({ realm: realm, collection: collectionName, sort: sort }), [collectionName, realm, sort]);
    const { data } = (0, react_query_1.useQuery)(['selectAll', collectionName], query, {
        suspense: true
    });
    const headers = (0, react_1.useMemo)(() => (columns !== null && columns !== void 0 ? columns : []).map((x) => { var _a, _b; return (_b = (_a = x[1]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : ''; }), [columns]);
    const body = (0, react_1.useCallback)((data) => {
        (columns !== null && columns !== void 0 ? columns : []).map(([n, v]) => { var _a; return data[(_a = v === null || v === void 0 ? void 0 : v.name) !== null && _a !== void 0 ? _a : '']; });
    }, []);
    return ((0, jsx_runtime_1.jsx)(Boundary_1.Boundary, { children: (0, jsx_runtime_1.jsxs)("section", Object.assign({ className: 'flex w-full h-auto' }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: 'flex flex-col w-full' }, { children: (0, jsx_runtime_1.jsxs)("table", Object.assign({ className: 'text-white table-auto' }, { children: [(0, jsx_runtime_1.jsx)("caption", { children: (0, toTitleCase_1.toTitleCase)(collectionName) }), (0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsx)("tr", Object.assign({ className: 'text-lg font-bold border font-fira-sans border-blue' }, { children: headers.map((x, ix) => ((0, jsx_runtime_1.jsx)("th", Object.assign({ className: 'px-2 py-1' }, { children: x }), ix))) })) })] })) })), (0, jsx_runtime_1.jsx)("div", { className: 'flex flex-grow' })] })) }));
}
exports.Grid = Grid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9ncmlkL2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsaUNBQW9EO0FBRXBELDZDQUFnRTtBQUVoRSwrREFBNEQ7QUFDNUQsOENBQXVFO0FBQ3ZFLHdFQUFtRztBQUNuRyx5Q0FBc0M7QUFDdEMseUNBQXNDO0FBRXRDLFNBQWdCLFNBQVMsQ0FBQyxNQUFvRTtJQUMxRixPQUFPLEdBQUcsRUFBRTtRQUNSLElBQUk7WUFDQSxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFDM0MsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDbEU7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7SUFDTCxDQUFDLENBQUM7QUFDTixDQUFDO0FBVEQsOEJBU0M7QUFFRCxTQUFnQixJQUFJO0lBQ2hCLE1BQU0sY0FBYyxHQUFHLElBQUEsK0JBQWtCLEdBQUUsQ0FBQztJQUM1QyxNQUFNLE1BQU0sR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQztJQUMzQixNQUFNLElBQUksR0FBRyxJQUFBLGVBQU8sRUFDaEIsR0FBRyxFQUFFLGVBQUMsT0FBQSxNQUFBLE1BQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsMENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFtQixDQUFDLG1DQUFLLEVBQXVCLENBQUEsRUFBQSxFQUMvRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FDM0IsQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBQSxtQkFBUSxHQUFFLENBQUM7SUFDekIsSUFBQSw0Q0FBdUIsR0FBRSxDQUFDO0lBQzFCLDZCQUE2QjtJQUM3QixNQUFNLEtBQUssR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakksTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUEsc0JBQVEsRUFBQyxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsRUFBRSxLQUFLLEVBQUU7UUFDNUQsUUFBUSxFQUFFLElBQUk7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxPQUFPLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLGFBQVAsT0FBTyxjQUFQLE9BQU8sR0FBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxlQUFDLE9BQUEsTUFBQSxNQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQUUsS0FBSyxtQ0FBSSxFQUFFLENBQUEsRUFBQSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLE1BQU0sSUFBSSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQXNCLEVBQUUsRUFBRTtRQUNoRCxDQUFDLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsV0FBQyxPQUFBLElBQUksQ0FBQyxNQUFBLENBQUMsYUFBRCxDQUFDLHVCQUFELENBQUMsQ0FBRSxJQUFJLG1DQUFJLEVBQUUsQ0FBQyxDQUFBLEVBQUEsQ0FBQyxDQUFBO0lBQ3hELENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNOLE9BQU8sQ0FDSCx1QkFBQyxtQkFBUSxjQUNMLG1EQUFTLFNBQVMsRUFBQyxvQkFBb0IsaUJBQ25DLDhDQUFLLFNBQVMsRUFBQyxzQkFBc0IsZ0JBQ2pDLGlEQUFPLFNBQVMsRUFBQyx1QkFBdUIsaUJBQ3BDLDhDQUFVLElBQUEseUJBQVcsRUFBQyxjQUFjLENBQUMsR0FBVyxFQUNoRCw0Q0FDSSw2Q0FBSSxTQUFTLEVBQUMscURBQXFELGdCQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FDcEIsNkNBQUksU0FBUyxFQUFDLFdBQVcsZ0JBQVcsQ0FBQyxLQUFOLEVBQUUsQ0FBVSxDQUM5QyxDQUFDLElBQ0QsR0FDRCxLQUNKLElBQ04sRUFDTixnQ0FBSyxTQUFTLEVBQUMsZ0JBQWdCLEdBQU8sS0FDaEMsR0FDSCxDQUNkLENBQUM7QUFDTixDQUFDO0FBdENELG9CQXNDQyJ9