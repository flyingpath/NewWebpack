const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

devPack = env => {

    console.log('打包dev');

    // fs.removeSync('dev/public')
    // fs.mkdir('dev/public', () => { })
    // fs.mkdir('dev/public/source', () => { })

    const port = env.port

    return {
        entry: [
            'babel-polyfill',
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://0.0.0.0:${port}`,
            'webpack/hot/only-dev-server', //-- react 的 hotreload
            './index.js'
        ],
        output: {
            filename: 'bundle.js',
            path: resolve(__dirname, 'dev'),
        },
        context: resolve(__dirname, 'public'),
        devServer: {
            port: port,
            host: '0.0.0.0',
            contentBase: resolve(__dirname, 'dev'),
            // publicPath: '/',
            hot: true,
            disableHostCheck: true
        },
        devtool: 'eval-source-map',
        module: {
            rules: [
                // {
                //     enforce: "pre",
                //     test: /\.js$/,
                //     exclude: /node_modules/,
                //     loader: "eslint-loader",
                // },  
                {
                    test: /\.(js|jsx)$/,
                    use: [
                        'babel-loader'
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader"
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.(png|gif|jpg|svg|eot|woff(2)?|ttf)?$/,
                    use: 'url-loader?name=source/[name]-[hash].[ext]',
                }
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(), //-- react 的 hotreload plugin
            new webpack.NamedModulesPlugin(),
            new MiniCssExtractPlugin({
                filename: "styles.css",
                chunkFilename: "[id].css"
            }),
            new HtmlWebpackPlugin({  
                filename: 'index.html',
                template: 'index.html',
                title: 'NewWebpack',
            })
        ]
    }
}

module.exports= devPack
