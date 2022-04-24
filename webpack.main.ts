import { Configuration } from 'webpack';

const mode: 'development' | 'production' = process.env.NODE_ENV as any
export const mainConfig: Configuration = {
  mode: mode ?? 'development',
  entry: './src/app.ts',
  output: {
    path: [__dirname, 'public'].join('/'),
    filename: 'app.js',
    assetModuleFilename: '[hash][ext][query]',
  },
  target: 'electron-main',
  plugins: [
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
}
