const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const fs = require('fs-extra')
const OfflinePlugin = require('offline-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

console.log('打包pro'); 

fs.removeSync('dist/public') 
fs.mkdir('dist/public', ()=>{})
fs.mkdir('dist/public/source', ()=>{})

module.exports = {
    entry: './index.js',
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
            {      
                test: /^((?!\.global).)*\.css$/,
                loader: ExtractTextPlugin.extract({         // 把 css 另外打包的 plugin
                    fallback: 'style-loader',
                    use: 'css-loader?modules!postcss-loader', // 把'?modules'移掉就不會用 css modules
                })
            },
            {
                test: /\.scss$/, //-- 可以直接用scss... 但不知道跟 css 另外打包的 plugin 會不會衝到，要再研究，先不用
                loader: ExtractTextPlugin.extract({        
                    fallback: 'style-loader',
                    use: 'css-loader?modules!postcss-loader!sass-loader', 
                })
            },
            {
                test: /\.global\.css$/,  // anything with .global will not go through css modules loader
                loaders: ExtractTextPlugin.extract({        
                    fallback: 'style-loader',
                    use: 'css-loader!postcss-loader', 
                })
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
		new webpack.optimize.UglifyJsPlugin({       // 把 打包檔 minify 的plugin
            beautify: false,
            mangle: {
                    screw_ie8: true,
                    keep_fnames: true
            },
            compress: {
                    screw_ie8: true,
                    warnings: false
            },
            comments: false
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new ExtractTextPlugin("styles.css"),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        }),
        new webpack.NamedModulesPlugin(),
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






