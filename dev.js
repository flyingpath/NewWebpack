const { resolve } = require('path')
const webpack = require('webpack')
const fs = require('fs-extra')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const OfflinePlugin = require('offline-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

devPack = env => {
    console.log('打包dev')
    fs.removeSync('dev/public')
    fs.mkdir('dev/public', () => { })
    fs.mkdir('dev/public/source', () => { })

    const port = env.port

    return {
        entry: [
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://0.0.0.0:${port}`,
            'webpack/hot/only-dev-server', //-- react 的 hotreload
            './index.js'
        ],
        output: {
            filename: 'bundle.js',
            path: resolve(__dirname, 'dev/public'),
        },
        context: resolve(__dirname, 'public'),
        devServer: {
            port: port,
            host: '0.0.0.0',
            contentBase: resolve(__dirname, 'dev'),
            publicPath: '/public',
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
                        'babel-loader',
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({         // 把 css 另外打包的 plugin
                        fallback: 'style-loader',
                        use: 'css-loader!postcss-loader',
                    })
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader!postcss-loader!sass-loader',
                    })
                },
                {
                    test: /\.(png|gif|jpg|svg|eot|woff(2)?|ttf)?$/,
                    use: 'url-loader?name=source/[name]-[hash].[ext]',
                },
                {
                    test: /\.html$/,
                    use: [{
                        loader: 'html-loader',
                        options: {
                            minimize: true
                        }
                    }]
                }
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(), //-- react 的 hotreload plugin
            new webpack.NamedModulesPlugin(),
            new ExtractTextPlugin("styles.css"),
            new webpack.DefinePlugin(
                {
                    'process.env': { 'NODE_ENV': JSON.stringify('develope') }
                }
            ),
            new HtmlWebpackPlugin({
                template: 'index.html'
            }),
            new OfflinePlugin({
                publicPath: '/',
                caches: {
                    main: [
                        'index.html'
                    ]
                },
                externals: [
                ],
                ServiceWorker: {
                    navigateFallbackURL: '/'
                }
            })
        ]
    }
}

module.exports = devPack