"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteCommand = exports.useInsertCommand = exports.useProvideDeleteCommand = exports.deleteById = exports.useProvideInsertCommand = void 0;
const client_1 = require("@apollo/client");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const ignore_1 = require("../ignore");
const App_1 = require("../App");
const MainWindow_1 = require("../MainWindow");
const react_query_1 = require("react-query");
const useToast_1 = require("../useToast");
const toTitleCase_1 = require("../../common/text/toTitleCase");
function useProvideInsertCommand() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const execute = (0, react_1.useCallback)(() => {
        navigate('new');
    }, [navigate]);
    (0, react_1.useEffect)(() => {
        (0, App_1.$insertCommand)({ isDisabled: false, execute });
        return () => {
            (0, App_1.$insertCommand)({ isDisabled: true, execute: ignore_1.ignore });
        };
    }, [execute]);
}
exports.useProvideInsertCommand = useProvideInsertCommand;
function deleteById(params) {
    const { realm, collection, id } = params;
    try {
        realm.write(() => {
            realm.delete(id.map((x) => realm.objectForPrimaryKey(collection, new Realm.BSON.ObjectId(x))));
        });
        return Promise.resolve(id);
    }
    catch (error) {
        return Promise.reject(error);
    }
}
exports.deleteById = deleteById;
function useProvideDeleteCommand() {
    const [searchParams, setSearchParams] = (0, react_router_dom_1.useSearchParams)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const successToast = (0, useToast_1.useToast)('success');
    const failureToast = (0, useToast_1.useToast)('failure');
    const realm = (0, client_1.useReactiveVar)(App_1.$realm);
    const collection = (0, MainWindow_1.useCollectionParam)();
    const selected = (0, react_1.useMemo)(() => { var _a, _b; return (_b = (_a = searchParams.get('selected')) === null || _a === void 0 ? void 0 : _a.split('&')) !== null && _b !== void 0 ? _b : []; }, [searchParams]);
    const isDisabled = realm != null && selected.length > 0;
    const mutation = (0, react_query_1.useMutation)(deleteById, {
        onSuccess: (ids, params) => {
            successToast(`You have successfully deleted ${ids.length} records.`, 'SUCCESS', `${(0, toTitleCase_1.toTitleCase)(params.collection)} Delete`);
            queryClient.invalidateQueries(['selectAll', params.collection]);
            queryClient.invalidateQueries(['dropdown', params.collection]);
            queryClient.refetchQueries(['selectAll', params.collection]);
            queryClient.refetchQueries(['dropdown', params.collection]);
        },
        onError: (error) => {
            failureToast(error.message, 'FAILED', error.name);
        }
    });
    const execute = (0, react_1.useCallback)(() => {
        if (realm == null)
            return;
        mutation.mutate({
            realm,
            collection,
            id: selected
        });
    }, [collection, mutation, realm, selected]);
    (0, react_1.useEffect)(() => {
        (0, App_1.$deleteCommand)({ execute, isDisabled });
        return () => {
            (0, App_1.$deleteCommand)({ execute: ignore_1.ignore, isDisabled: true });
        };
    }, [execute, isDisabled]);
}
exports.useProvideDeleteCommand = useProvideDeleteCommand;
function useInsertCommand() {
    return (0, client_1.useReactiveVar)(App_1.$insertCommand);
}
exports.useInsertCommand = useInsertCommand;
function useDeleteCommand() {
    return (0, client_1.useReactiveVar)(App_1.$deleteCommand);
}
exports.useDeleteCommand = useDeleteCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZEJhclByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvcHJvdmlkZXJzL0NvbW1hbmRCYXJQcm92aWRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXlEO0FBRXpELGlDQUFnRTtBQUNoRSx1REFBZ0U7QUFDaEUsc0NBQW1DO0FBQ25DLGdDQUEwRTtBQUMxRSw4Q0FBbUQ7QUFDbkQsNkNBQTBEO0FBQzFELDBDQUF1QztBQUN2QywrREFBNEQ7QUFFNUQsU0FBZ0IsdUJBQXVCO0lBQ25DLE1BQU0sUUFBUSxHQUFHLElBQUEsOEJBQVcsR0FBRSxDQUFDO0lBQy9CLE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDZixJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ1gsSUFBQSxvQkFBYyxFQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sR0FBRyxFQUFFO1lBQ1IsSUFBQSxvQkFBYyxFQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsZUFBTSxFQUFFLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUM7SUFDTixDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUM7QUFYRCwwREFXQztBQUNELFNBQWdCLFVBQVUsQ0FBQyxNQUEwRDtJQUNqRixNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFDekMsSUFBSTtRQUNBLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ2IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FB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