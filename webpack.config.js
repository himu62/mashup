var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var plugins = [];
var css_loader = 'css-loader!postcss-loader!sass-loader';
if(process.env.NODE_ENV === 'production') {
	plugins = [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	];
	css_loader = 'css-loader?minimize!postcss-loader!sass-loader';
}

module.exports = [
	{
		entry: path.join(__dirname, 'script/index.tsx'),
		output: {
			filename: 'js/bundle.js'
		},
		resolve: {
			extensions: ['', '.tsx', '.ts', '.js']
		},
		module: {
			loaders: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/
				}
			]
		},
		plugins: plugins
	},
	{
		entry: path.join(__dirname, 'style/style.scss'),
		output: {
			path: path.join(__dirname, 'css'),
			filename: 'style.css'
		},
		resolve: {
			extensions: ['', '.scss', '.css', '.woff2', '.woff', '.ttf', 'eot', '.svg']
		},
		module: {
			loaders: [
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract('style-loader', css_loader),
					exclude: /node_modules/
				},
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: 'url?limit=10000&mimetype=application/font-woff'
				},
				{
					test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: 'file'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('style.css')
		],
		postcss: [
			autoprefixer({
				browsers: ['last 2 versions']
			})
		]
	}
];
