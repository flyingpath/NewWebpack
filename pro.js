const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const { InjectManifest } = require('workbox-webpack-plugin')

const fs = require('fs-extra')

console.log('打包pro');

fs.removeSync('dist')
fs.mkdir('dist/public', () => { })
fs.copy('distData', 'dist')

module.exports = (env) => ({
    
    entry: {
        main: ['babel-polyfill', './index.js'],
        // vendor: [ 'react', 'react-dom', 'mobx', 'mobx-react', 'material-ui', 'styled-components' ]
    },
    output: {
        path: resolve( __dirname, 'dist' ),
        filename: 'bundle.js',
        chunkFilename: "[name].chunk.js"
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
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name  : '[name]-[hash].[ext]',
                            outputPath : './source/',
                            publicPath : './source/',
                            limit : 2048,
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            chunks: "async",
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles.css",
            chunkFilename: "chunks.css"
        }),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({  
            filename: 'index.html',
            template: 'index.html',
            title: 'NewWebpack',
        }),
        new InjectManifest({
            swSrc: './public/sw.js',
        }),
    ]
})






