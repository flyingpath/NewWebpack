const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const fs = require('fs-extra')


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
                test: /\.scss$/, 
                loader: ExtractTextPlugin.extract({        
                    fallback: 'style-loader',
                    use: 'css-loader!postcss-loader!sass-loader', 
                })
            },
            {
                test: /\.css$/,
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
		new webpack.NamedModulesPlugin()
	]
}






