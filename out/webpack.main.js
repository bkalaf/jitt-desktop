"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainConfig = void 0;
const mode = process.env.NODE_ENV;
exports.mainConfig = {
    mode: mode !== null && mode !== void 0 ? mode : 'development',
    entry: './src/app.ts',
    output: {
        path: [__dirname, 'public'].join('/'),
        filename: 'app.js',
        assetModuleFilename: '[hash][ext][query]',
    },
    target: 'electron-main',
    plugins: [],
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
                    'style-loader',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay5tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vd2VicGFjay5tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sSUFBSSxHQUFpQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQWUsQ0FBQTtBQUN6RCxRQUFBLFVBQVUsR0FBa0I7SUFDdkMsSUFBSSxFQUFFLElBQUksYUFBSixJQUFJLGNBQUosSUFBSSxHQUFJLGFBQWE7SUFDM0IsS0FBSyxFQUFFLGNBQWM7SUFDckIsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDckMsUUFBUSxFQUFFLFFBQVE7UUFDbEIsbUJBQW1CLEVBQUUsb0JBQW9CO0tBQzFDO0lBQ0QsTUFBTSxFQUFFLGVBQWU7SUFDdkIsT0FBTyxFQUFFLEVBQ1I7SUFDRCxPQUFPLEVBQUU7UUFDUCxVQUFVLEVBQUU7WUFDVixLQUFLO1lBQ0wsTUFBTTtZQUNOLEtBQUs7WUFDTCxNQUFNO1lBQ04sT0FBTztZQUNQLE9BQU87WUFDUCxNQUFNO1lBQ04sTUFBTTtZQUNOLE1BQU07WUFDTixNQUFNO1lBQ04sT0FBTztZQUNQLE9BQU87WUFDUCxNQUFNO1lBQ04sTUFBTTtTQUNQO0tBQ0Y7SUFDRCxPQUFPLEVBQUUsWUFBWTtJQUNyQixNQUFNLEVBQUU7UUFDTixLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxHQUFHLEVBQUU7b0JBQ0gsY0FBYztvQkFDZCxZQUFZO29CQUNaO3dCQUNFLE1BQU0sRUFBRSxnQkFBZ0I7d0JBQ3hCLE9BQU8sRUFBRTs0QkFDUCxjQUFjLEVBQUU7Z0NBQ2QsT0FBTyxFQUFFO29DQUNQLGdCQUFnQjtvQ0FDaEIsYUFBYTtvQ0FDYixpQkFBaUI7b0NBQ2pCLDJCQUEyQjtvQ0FDM0IsY0FBYztvQ0FDZCxvQkFBb0I7aUNBQ3JCOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsNkJBQTZCO2dCQUNuQyxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixTQUFTLEVBQUU7b0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtpQkFDdEM7YUFDRjtZQUNEO2dCQUNFLElBQUksRUFBRSxxQkFBcUI7Z0JBQzNCLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLFNBQVMsRUFBRTtvQkFDVCxRQUFRLEVBQUUsMEJBQTBCO2lCQUNyQzthQUNGO1lBQ0QsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUU7U0FDdEM7S0FDRjtDQUNGLENBQUEifQ==