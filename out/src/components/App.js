"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.queryClient = exports.apolloClient = exports.getAccessToken = exports.$realm = exports.$currentUser = exports.realmApp = exports.$deleteCommand = exports.$insertCommand = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const realm_1 = __importDefault(require("realm"));
const client_1 = require("@apollo/client");
const react_router_dom_1 = require("react-router-dom");
const react_query_1 = require("react-query");
const react_1 = __importStar(require("react"));
const UI_1 = require("./UI");
const MainWindow_1 = require("./MainWindow");
const ignore_1 = require("./ignore");
const remote_1 = require("@electron/remote");
const data_1 = require("../data");
const SchemaProvider_1 = require("./providers/SchemaProvider");
exports.$insertCommand = (0, client_1.makeVar)({
    isDisabled: true,
    execute: ignore_1.ignore
});
exports.$deleteCommand = (0, client_1.makeVar)({
    isDisabled: true,
    execute: ignore_1.ignore
});
exports.realmApp = new realm_1.default.App('jitt-mntcv');
exports.$currentUser = (0, client_1.makeVar)(exports.realmApp.currentUser);
exports.$realm = (0, client_1.makeVar)(undefined);
function getAccessToken() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const user = (0, exports.$currentUser)();
        if (user) {
            return (_a = user.accessToken) !== null && _a !== void 0 ? _a : '';
        }
        return '';
    });
}
exports.getAccessToken = getAccessToken;
exports.apolloClient = new client_1.ApolloClient({
    link: new client_1.HttpLink({
        uri: 'https://realm.mongodb.com/api/client/v2.0/app/jitt-mntcv/graphql',
        fetch: (uri, options) => __awaiter(void 0, void 0, void 0, function* () {
            const accessToken = yield getAccessToken();
            options.headers.Authorization = `Bearer ${accessToken}`;
            return fetch(uri, options);
        })
    }),
    cache: new client_1.InMemoryCache()
});
exports.queryClient = new react_query_1.QueryClient();
function App() {
    const cu = (0, client_1.useReactiveVar)(exports.$currentUser);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (cu) {
            realm_1.default.open({
                schema: data_1.schema,
                path: [remote_1.app.getPath('appData'), 'jitt-desktop', 'db.realm'].join('/'),
                sync: {
                    user: cu,
                    partitionValue: (_b = (_a = cu.profile) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : ''
                }
            }).then(exports.$realm);
        }
    }, [cu]);
    return ((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.HashRouter, { children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, Object.assign({ client: exports.queryClient }, { children: (0, jsx_runtime_1.jsx)(client_1.ApolloProvider, Object.assign({ client: exports.apolloClient }, { children: (0, jsx_runtime_1.jsx)(SchemaProvider_1.SchemaProvider, { children: (0, jsx_runtime_1.jsx)(UI_1.UI, { children: (0, jsx_runtime_1.jsx)(MainWindow_1.MainWindow, {}) }) }) })) })) }) }));
}
exports.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsMkNBQWdIO0FBQ2hILHVEQUE4QztBQUM5Qyw2Q0FBK0Q7QUFDL0QsK0NBQXlDO0FBQ3pDLDZCQUEwQjtBQUMxQiw2Q0FBMEM7QUFDMUMscUNBQWtDO0FBQ2xDLDZDQUF1QztBQUN2QyxrQ0FBaUM7QUFDakMsK0RBQTREO0FBRS9DLFFBQUEsY0FBYyxHQUFHLElBQUEsZ0JBQU8sRUFBQztJQUNsQyxVQUFVLEVBQUUsSUFBSTtJQUNoQixPQUFPLEVBQUUsZUFBTTtDQUNsQixDQUFDLENBQUM7QUFDVSxRQUFBLGNBQWMsR0FBRyxJQUFBLGdCQUFPLEVBQUM7SUFDbEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLGVBQU07Q0FDbEIsQ0FBQyxDQUFDO0FBRVUsUUFBQSxRQUFRLEdBQUcsSUFBSSxlQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsWUFBWSxHQUFHLElBQUEsZ0JBQU8sRUFBQyxnQkFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLFFBQUEsTUFBTSxHQUFHLElBQUEsZ0JBQU8sRUFBb0IsU0FBUyxDQUFDLENBQUM7QUFDNUQsU0FBc0IsY0FBYzs7O1FBQ2hDLE1BQU0sSUFBSSxHQUFHLElBQUEsb0JBQVksR0FBRSxDQUFDO1FBQzVCLElBQUksSUFBSSxFQUFFO1lBQ04sT0FBTyxNQUFBLElBQUksQ0FBQyxXQUFXLG1DQUFJLEVBQUUsQ0FBQztTQUNqQztRQUNELE9BQU8sRUFBRSxDQUFDOztDQUNiO0FBTkQsd0NBTUM7QUFDWSxRQUFBLFlBQVksR0FBRyxJQUFJLHFCQUFZLENBQUM7SUFDekMsSUFBSSxFQUFFLElBQUksaUJBQVEsQ0FBQztRQUNmLEdBQUcsRUFBRSxrRUFBa0U7UUFDdkUsS0FBSyxFQUFFLENBQU8sR0FBUSxFQUFFLE9BQVksRUFBRSxFQUFFO1lBQ3BDLE1BQU0sV0FBVyxHQUFHLE1BQU0sY0FBYyxFQUFFLENBQUM7WUFDM0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsVUFBVSxXQUFXLEVBQUUsQ0FBQztZQUN4RCxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFBO0tBQ0osQ0FBQztJQUNGLEtBQUssRUFBRSxJQUFJLHNCQUFhLEVBQUU7Q0FDN0IsQ0FBQyxDQUFDO0FBQ1UsUUFBQSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7QUFDN0MsU0FBZ0IsR0FBRztJQUNmLE1BQU0sRUFBRSxHQUFHLElBQUEsdUJBQWMsRUFBQyxvQkFBWSxDQUFDLENBQUM7SUFDeEMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTs7UUFDWCxJQUFJLEVBQUUsRUFBRTtZQUNKLGVBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ1AsTUFBTSxFQUFFLGFBQU07Z0JBQ2QsSUFBSSxFQUFFLENBQUMsWUFBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDcEUsSUFBSSxFQUFFO29CQUNGLElBQUksRUFBRSxFQUFFO29CQUNSLGNBQWMsRUFBRSxNQUFBLE1BQUEsRUFBRSxDQUFDLE9BQU8sMENBQUUsS0FBSyxtQ0FBSSxFQUFFO2lCQUMxQzthQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBTSxDQUFDLENBQUM7U0FDbkI7SUFDTCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1QsT0FBTyxDQUNILHVCQUFDLGVBQUssQ0FBQyxVQUFVLGNBQ2IsdUJBQUMsNkJBQVUsY0FDUCx1QkFBQyxpQ0FBbUIsa0JBQUMsTUFBTSxFQUFFLG1CQUFXLGdCQUNwQyx1QkFBQyx1QkFBYyxrQkFBQyxNQUFNLEVBQUUsb0JBQVksZ0JBQ2hDLHVCQUFDLCtCQUFjLGNBQ1gsdUJBQUMsT0FBRSxjQUNDLHVCQUFDLHVCQUFVLEtBQUcsR0FDYixHQUNRLElBQ0osSUFDQyxHQUNiLEdBQ0UsQ0FDdEIsQ0FBQztBQUNOLENBQUM7QUE3QkQsa0JBNkJDIn0=