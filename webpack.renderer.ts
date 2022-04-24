import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpackNodeExternals from 'webpack-node-externals';
import { render } from 'react-dom';

const mode: 'development' | 'production' = process.env.NODE_ENV as any;
export const rendererConfig: Configuration = {
    mode: mode ?? 'development',
    entry: './src/index.tsx',
    output: {
        path: [__dirname, 'public'].join('/'),
        filename: '[name]bundle.js',
        assetModuleFilename: '[hash][ext][query]',
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'JITT - Junk in the Trunk Inc'
        }),
        new MiniCssExtractPlugin({ filename: 'styles.css' })
    ],
    externals: [
        webpackNodeExternals({
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
                    MiniCssExtractPlugin.loader,
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

export default rendererConfig;