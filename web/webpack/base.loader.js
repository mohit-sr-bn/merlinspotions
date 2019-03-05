/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */
/* eslint-env node */

const path = require('path')
const webpack = require('webpack')
const baseCommon = require('./base.common')

const webPackageJson = require('../package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const readNativeAstroVersion = () => {
    const nativePackageJson = require('../../native/package.json').dependencies['mobify-progressive-app-sdk']
    return `'${nativePackageJson}'`
}

const analyzeBundle = process.env.MOBIFY_ANALYZE === 'true'

// For more information on these settings, see https://webpack.js.org/configuration
const config = {
    // Create a source map for all files
    devtool: 'source-map',
    // Tell webpack where to look to start building the bundle
    // We include the polyfills here so they will be split into separate files
    // which we can load on the fly for user agents that need them
    entry: {
        loader: './app/loader.js',
        'core-polyfill': 'core-js',
        'fetch-polyfill': 'whatwg-fetch'
    },
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'sandy-tracking-pixel-client': path.resolve(process.cwd(), 'node_modules', 'sandy-tracking-pixel-client', 'index.min')
        }
    },
    module: {
        rules: [
            // Run files through the babel-loader to transpile them from es6
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader?cacheDirectory'
                }
            },
            // Provide a loader for css files imported into loader.js
            {
                test: /\.css?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: '../web/webpack/postcss.config.js'
                        }
                    }
                }
            }
        ],
    },
    plugins: [
        // Include all of the shared plugins
        ...baseCommon.plugins,
        // Define compile time values that we need within the files
        new webpack.DefinePlugin({
            // These are defined as a boolean, not a string
            MESSAGING_ENABLED: `${webPackageJson.messagingEnabled}`,
            WEBPACK_NON_PWA_ENABLED: `${webPackageJson.nonPwaEnabled}`,
            AMP_LINKING_ENABLED: `${webPackageJson.ampLinkingEnabled}`,
            // These are defined as string constants
            MESSAGING_SITE_ID: `'${webPackageJson.messagingSiteId}'`,
            NATIVE_WEBPACK_ASTRO_VERSION: readNativeAstroVersion(),
            PROJECT_SLUG: `'${webPackageJson.projectSlug}'`,
            AJS_SLUG: `'${webPackageJson.aJSSlug}'`,
            SITE_NAME: `"${webPackageJson.siteName}"`
        })
    ]
}

if (analyzeBundle) {
    console.info('Analyzing build...')
    config.plugins = config.plugins.concat([
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: true
        })
    ])
}

module.exports = config
