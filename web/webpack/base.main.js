/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */
/* eslint-env node */

const webpack = require('webpack')
const path = require('path')
const baseCommon = require('./base.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webPackageJson = require('../package.json')   // eslint-disable-line import/no-extraneous-dependencies

const analyzeBundle = process.env.MOBIFY_ANALYZE === 'true'

// For more information on these settings, see https://webpack.js.org/configuration
const config = {
    // Create a source map for all files
    devtool: 'source-map',
    // Tell webpack where to look to start building the bundle
    entry: './app/main.jsx',
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: '[name].js',
        // A chunk is a JS file that is split out by webpack and loaded async
        // The chunks are named using a comment when we asychronously import them
        // See app/containers/templates.jsx
        chunkFilename: '[name].js'
    },
    // Tell webpack how to find specific modules
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'babel-runtime': path.resolve(process.cwd(), 'node_modules', 'babel-runtime'),
            lodash: path.resolve(process.cwd(), 'node_modules', 'lodash'),
            'lodash-es': path.resolve(process.cwd(), 'node_modules', 'lodash'),
            'lodash._basefor': path.resolve(process.cwd(), 'node_modules', 'lodash', '_baseFor'),
            'lodash.escaperegexp': path.resolve(process.cwd(), 'node_modules', 'lodash', 'escapeRegExp'),
            'lodash.find': path.resolve(process.cwd(), 'node_modules', 'lodash', 'find'),
            'lodash.frompairs': path.resolve(process.cwd(), 'node_modules', 'lodash', 'fromPairs'),
            'lodash.isarray': path.resolve(process.cwd(), 'node_modules', 'lodash', 'isArray'),
            'lodash.isarguments': path.resolve(process.cwd(), 'node_modules', 'lodash', 'isArguments'),
            'lodash.intersection': path.resolve(process.cwd(), 'node_modules', 'lodash', 'intersection'),
            'lodash.isplainobject': path.resolve(process.cwd(), 'node_modules', 'lodash', 'isPlainObject'),
            'lodash.keys': path.resolve(process.cwd(), 'node_modules', 'lodash', 'keys'),
            'lodash.keysin': path.resolve(process.cwd(), 'node_modules', 'lodash', 'keysIn'),
            'lodash.mapvalues': path.resolve(process.cwd(), 'node_modules', 'lodash', 'mapValues'),
            'lodash.throttle': path.resolve(process.cwd(), 'node_modules', 'lodash', 'throttle'),
            react: path.resolve(process.cwd(), 'node_modules', 'react'),
            'redux-actions': path.resolve(process.cwd(), 'node_modules', 'redux-actions', 'dist', 'redux-actions.min'),
            'redux-form': path.resolve(process.cwd(), 'node_modules', 'redux-form', 'dist', 'redux-form.min'),
            redux: path.resolve(process.cwd(), 'node_modules', 'redux', 'dist', 'redux.min'),
            'react-redux': path.resolve(process.cwd(), 'node_modules', 'react-redux', 'dist', 'react-redux.min'),
            'react-dom': path.resolve(process.cwd(), 'node_modules', 'react-dom', 'cjs', 'react-dom.production.min'),
            bluebird: path.resolve(process.cwd(), 'node_modules', 'bluebird'),
            'tti-polyfill': path.resolve(process.cwd(), 'node_modules', 'tti-polyfill'),
            immutable: path.resolve(process.cwd(), 'node_modules', 'immutable', 'dist', 'immutable.min'),
            'sandy-tracking-pixel-client': path.resolve(process.cwd(), 'node_modules', 'sandy-tracking-pixel-client', 'index.min')
        }
    },
    // Manually split all of our node_modules into the file vendor.js
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]|[\\/]progressive-web-sdk[\\/]/,
                    name: 'vendor',
                    chunks: 'initial'
                }
            }
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin(
                {
                    cssProcessorOptions: {
                        discardComments: {removeAll: true}
                    }
                }
            )
        ]

    },
    plugins: [
        // Include all of the shared plugins
        ...baseCommon.plugins,
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        // Move the static files to the root
        // so that we can import them from the bundle
        new CopyPlugin([
            {from: 'app/static/', to: 'static/'}
        ]),
        // Define compile time values that we need within the files
        new webpack.DefinePlugin({
            // This is defined as a boolean, not a string
            MESSAGING_ENABLED: `${webPackageJson.messagingEnabled}`,
            // These are defined as string constants
            PROJECT_SLUG: `'${webPackageJson.projectSlug}'`,
            AJS_SLUG: `'${webPackageJson.aJSSlug}'`,
            SITE_NAME: `"${webPackageJson.siteName}"`,
            WEBPACK_MOBIFY_GA_ID: `'${webPackageJson.mobifyGAID}'`,
            WEBPACK_PACKAGE_JSON_MOBIFY: `${JSON.stringify(webPackageJson.mobify || {})}`,
            WEBPACK_SSR_ENABLED: webPackageJson.mobify ? `${webPackageJson.mobify.ssrEnabled}` : 'false'
        })
    ],
    module: {
        rules: [
            // Run the project files through the babel-loader to transpile them from es6
            {
                test: /\.js(x?)$/,
                exclude: /node_modules(?!\/mobify-progressive-app-sdk)/,
                use: {
                    loader: 'babel-loader?cacheDirectory',
                    options: {
                        plugins: ['syntax-dynamic-import']
                    }
                }
            },
            // Provide a loader for SVG files
            {
                test: /\.svg$/,
                use: 'text-loader'
            },
            // Provide a loader for CSS files
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ],
    }
}

if (analyzeBundle) {
    console.info('Analyzing build...')
    config.plugins = config.plugins.concat([
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'gzip',
            openAnalyzer: true
        })
    ])
}

module.exports = config
