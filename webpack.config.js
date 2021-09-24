const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const packageJson = require('./package.json');
const webpack = require('webpack');
const dotEnv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
const envVars = dotEnv.config().parsed || process.env;

const transformEnvVars = (envVars) => {
	const transformEnvVars = {};

	Object.keys(envVars).forEach((key) => {
		transformEnvVars[key] = JSON.stringify(envVars[key]);
	});

	return transformEnvVars;
};

const transformDependencies = (deps) => {
	const transformDependencies = {};

	Object.keys(deps).forEach((key) => {
		transformDependencies[key] = {
			eager: true,
			requiredVersion: deps[key],
		};
	});

	return transformDependencies;
};

module.exports = {
	entry: './src/index',
	mode: env,
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		port: 3002,
	},
	output: {
		publicPath: 'auto',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		plugins: [new TsconfigPathsPlugin()],
	},
	module: {
		rules: [
			{
				test: /bootstrap\.tsx$/,
				loader: 'bundle-loader',
				options: {
					lazy: true,
				},
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					// disable type checker - we will use it in fork plugin
					transpileOnly: true,
				},
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-preset-env',
										{
											// Options
										},
									],
								],
							},
						},
					},
				],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'dts-loader',
						options: {
							name: 'widgetsModule', // The name configured in ModuleFederationPlugin
							exposes: {
								'./footballMatches': './src/widgets/footballMatches/footballMatches',
								'./news': './src/widgets/news/news',
							},
							typesOutputDir: '.webpack-federation-modules-types', // Optional, default is '.wp_federation'
						},
					},
				],
			},
		],
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'widgetsModule',
			filename: 'remoteEntry.js',
			remotes: {},
			exposes: {
				'./footballMatches': './src/widgets/footballMatches/footballMatches',
				'./news': './src/widgets/news/news',
			},
			shared: {
				...transformDependencies(packageJson.dependencies),
			},
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			templateParameters: {
				PUBLIC_URL: '/public',
			},
		}),
		// new Dotenv(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'public/**/*',
					globOptions: {
						ignore: ['**/index.html'],
					},
					noErrorOnMissing: true,
				},
			],
		}),
		new FileManagerPlugin({
			events: {
				onStart: {
					delete: [
						{
							source: '..webpack-federation-modules-types',
							options: {
								force: true,
							},
						},
					],
				},
				onEnd: {
					archive: [
						{
							source: '.webpack-federation-modules-types',
							destination: './dist/widgetsModule-dts.tgz',
							format: 'tar', // optional
							options: {
								// see https://www.archiverjs.com/docs/archiver
								gzip: true,
							},
						},
					],
				},
			},
		}),
		new ForkTsCheckerWebpackPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
				...transformEnvVars(envVars),
			},
		}),
	],
};
