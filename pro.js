const { resolve } = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const fs = require('fs-extra')


console.log('打包pro');

fs.removeSync('dist/public')
fs.mkdir('dist/public', () => { })
fs.mkdir('dist/public/source', () => { })

module.exports = {
    entry: [
        'babel-polyfill',
        './index.js'
    ],
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist/public'),
    },
    context: resolve(__dirname, 'public'),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, 
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            // {
            //     test: /\.scss$/, //-- 可以直接用scss... 但不知道跟 css 另外打包的 plugin 會不會衝到，要再研究，先不用
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //         'postcss-loader',
            //         'sass-loader'
            //     ],
            // },
            {      
                test: /^((?!\.global).)*\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.scss$/, //-- 可以直接用scss... 但不知道跟 css 另外打包的 plugin 會不會衝到，要再研究，先不用
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.global\.css$/,  // anything with .global will not go through css modules loader
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.(png|gif|jpg|svg|eot|woff(2)?|ttf)?$/,
                use: 'url-loader?name=source/[name]-[hash].[ext]',
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css",
            chunkFilename: "[id].css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new webpack.NamedModulesPlugin()
    ]
}






