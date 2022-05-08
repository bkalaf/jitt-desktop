"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rendererConfig = void 0;
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const mode = process.env.NODE_ENV;
exports.rendererConfig = {
    mode: mode !== null && mode !== void 0 ? mode : 'development',
    entry: './src/index.tsx',
    output: {
        path: [__dirname, 'public'].join('/'),
        filename: '[name]bundle.js',
        assetModuleFilename: '[hash][ext][query]',
    },
    target: 'electron-renderer',
    plugins: [
        new html_webpack_plugin_1.default({
            template: 'src/index.html',
            title: 'JITT - Junk in the Trunk Inc'
        }),
        new mini_css_extract_plugin_1.default({ filename: 'styles.css' })
    ],
    externals: [
        (0, webpack_node_externals_1.default)({
            allowlist: [/webpack(\/.*)?/, 'electron-devtools-installer']
        })
    ],
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.html',
            '.json',
            '.css',
            '.jpg',
            '.svg',
            '.png',
            '.woff',
            '.webp',
            '.ttf',
            '.otf',
        ],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    mini_css_extract_plugin_1.default.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-import',
                                    'tailwindcss',
                                    'postcss-nesting',
                                    'postcss-custom-properties',
                                    'autoprefixer',
                                    'postcss-preset-env',
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]',
                },
            },
            {
                test: /\.(woff2?|otf|ttf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]',
                },
            },
            { test: /\.tsx?$/, use: 'ts-loader' },
        ],
    },
};
exports.default = exports.rendererConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay5yZW5kZXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3dlYnBhY2sucmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsOEVBQW9EO0FBQ3BELHNGQUEyRDtBQUMzRCxvRkFBMEQ7QUFHMUQsTUFBTSxJQUFJLEdBQWlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBZSxDQUFDO0FBQzFELFFBQUEsY0FBYyxHQUFrQjtJQUN6QyxJQUFJLEVBQUUsSUFBSSxhQUFKLElBQUksY0FBSixJQUFJLEdBQUksYUFBYTtJQUMzQixLQUFLLEVBQUUsaUJBQWlCO0lBQ3hCLE1BQU0sRUFBRTtRQUNKLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3JDLFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsbUJBQW1CLEVBQUUsb0JBQW9CO0tBQzVDO0lBQ0QsTUFBTSxFQUFFLG1CQUFtQjtJQUMzQixPQUFPLEVBQUU7UUFDTCxJQUFJLDZCQUFpQixDQUFDO1lBQ2xCLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsS0FBSyxFQUFFLDhCQUE4QjtTQUN4QyxDQUFDO1FBQ0YsSUFBSSxpQ0FBb0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQztLQUN2RDtJQUNELFNBQVMsRUFBRTtRQUNQLElBQUEsZ0NBQW9CLEVBQUM7WUFDakIsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsNkJBQTZCLENBQUM7U0FDL0QsQ0FBQztLQUNMO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1IsS0FBSztZQUNMLE1BQU07WUFDTixLQUFLO1lBQ0wsTUFBTTtZQUNOLE9BQU87WUFDUCxPQUFPO1lBQ1AsTUFBTTtZQUNOLE1BQU07WUFDTixNQUFNO1lBQ04sTUFBTTtZQUNOLE9BQU87WUFDUCxPQUFPO1lBQ1AsTUFBTTtZQUNOLE1BQU07U0FDVDtLQUNKO0lBQ0QsT0FBTyxFQUFFLFlBQVk7SUFDckIsTUFBTSxFQUFFO1FBQ0osS0FBSyxFQUFFO1lBQ0g7Z0JBQ0ksSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsR0FBRyxFQUFFO29CQUNELGlDQUFvQixDQUFDLE1BQU07b0JBQzNCLFlBQVk7b0JBQ1o7d0JBQ0ksTUFBTSxFQUFFLGdCQUFnQjt3QkFDeEIsT0FBTyxFQUFFOzRCQUNMLGNBQWMsRUFBRTtnQ0FDWixPQUFPLEVBQUU7b0NBQ0wsZ0JBQWdCO29DQUNoQixhQUFhO29DQUNiLGlCQUFpQjtvQ0FDakIsMkJBQTJCO29DQUMzQixjQUFjO29DQUNkLG9CQUFvQjtpQ0FDdkI7NkJBQ0o7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSjtZQUNEO2dCQUNJLElBQUksRUFBRSw2QkFBNkI7Z0JBQ25DLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLFNBQVMsRUFBRTtvQkFDUCxRQUFRLEVBQUUsMkJBQTJCO2lCQUN4QzthQUNKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLHFCQUFxQjtnQkFDM0IsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsU0FBUyxFQUFFO29CQUNQLFFBQVEsRUFBRSwwQkFBMEI7aUJBQ3ZDO2FBQ0o7WUFDRCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRTtTQUN4QztLQUNKO0NBQ0osQ0FBQztBQUVGLGtCQUFlLHNCQUFjLENBQUMifQ==