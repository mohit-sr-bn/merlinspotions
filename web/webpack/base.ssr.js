/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */
/* eslint-env node */

const webpack = require('webpack')
const path = require('path')
const baseCommon = require('./base.common')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webPackageJson = require('../package.json') // eslint-disable-line import/no-extraneous-dependencies
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const analyzeBundle = process.env.MOBIFY_ANALYZE === 'true'

const CWD = process.cwd()
const BUILD_DIR = path.resolve(CWD, 'build')

const isProduction = process.env.NODE_ENV === 'production'
const mobifyOptions = webPackageJson.mobify || {}


/**
 * This configuration is for the SSR server that can be run as a local
 * development server and as a remote server.
 */
const ssrServerConfig = {
    // We always want a source map, since it makes debugging issues
    // with the rendering server much easier.
    devtool: 'cheap-source-map',
    entry: './app/ssr.js',
    target: 'node',
    output: {
        path: BUILD_DIR,
        filename: 'ssr.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            // This is necessary to avoid the .mjs file being used, which fails
            // under webpack 4.
            'node-fetch': path.resolve(
                process.cwd(),
                'node_modules/progressive-web-sdk/node_modules/node-fetch/lib/index.js'
            )
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            // This is a JSON object's literal value
            WEBPACK_PACKAGE_JSON_MOBIFY: `${JSON.stringify(webPackageJson.mobify || {})}`,
            // This is a string
            WEBPACK_SITE_URL: `'${webPackageJson.siteUrl}'`,
            // These are defined as string constants
            PROJECT_SLUG: `'${webPackageJson.projectSlug}'`,
            DEBUG: !isProduction,
            WEBPACK_MOBIFY_GA_ID: `'${webPackageJson.mobifyGAID}'`,
            WEBPACK_PAGE_NOT_FOUND_URL: `'${mobifyOptions.pageNotFoundURL || ''}' `
        }),
        // Bundle everything into one server-side file. Dynamic
        // module loading isn't helpful in Lambda (it slows down
        // startup).
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ],
    module: {
        rules: [
            {
                test: /.*jsdom.*xmlhttprequest\.js$/,
                loader: require.resolve('./jsdom-fixup')
            },
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader?cacheDirectory',
                options: {
                    babelrc: './ssr.babelrc',
                    plugins: [
                        'syntax-dynamic-import'
                    ]
                }
            },
            {
                test: /\.svg$/,
                use: 'text-loader'
            }
        ],
    }
}

if (isProduction) {
    ssrServerConfig.optimization = {
        minimizer: [
            new UglifyJSPlugin(
                {
                    uglifyOptions: {
                        compress: false,
                        mangle: false,
                        ecma: 6
                    }
                }
            )
        ]
    }
}

const ssrSWLoaderConfig = {
    devtool: 'cheap-source-map',
    entry: './service-worker-loader.js',
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: 'service-worker-loader.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: `${__dirname}/tmp`
                    }
                }
            },
            {
                test: /\.css?$/,
                exclude: /node_modules/,
                use: 'postcss-loader',
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            // This is defined as a boolean, not a string
            MESSAGING_ENABLED: `${webPackageJson.messagingEnabled}`,
            // These are defined as string constants
            MESSAGING_SITE_ID: `'${webPackageJson.messagingSiteId}'`,
            PROJECT_SLUG: `'${webPackageJson.projectSlug}'`,
            AJS_SLUG: `'${webPackageJson.aJSSlug}'`,
            DEBUG: !isProduction
        }),
        // Keep the output to a single chunk
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ]
}

const ssrLoaderConfig = {
    devtool: 'cheap-source-map',
    entry: {
        'ssr-loader': './app/ssr-loader.js',
        'core-polyfill': 'core-js',
        'fetch-polyfill': 'whatwg-fetch'
    },
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: `${__dirname}/tmp`
                    }
                }
            },
            {
                test: /\.css?$/,
                exclude: /node_modules/,
                use: 'postcss-loader',
            }
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: baseCommon.postcss
            }
        }),
        new webpack.DefinePlugin({
            // This is defined as a boolean, not a string
            MESSAGING_ENABLED: `${webPackageJson.messagingEnabled}`,
            // These are defined as string constants
            MESSAGING_SITE_ID: `'${webPackageJson.messagingSiteId}'`,
            PROJECT_SLUG: `'${webPackageJson.projectSlug}'`,
            AJS_SLUG: `'${webPackageJson.aJSSlug}'`,
            DEBUG: !isProduction,
            SITE_NAME: `"${webPackageJson.siteName}"`
        }),
        // Keep the ssr-loader in a single chunk
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ]
}

const configs = [ssrServerConfig, ssrLoaderConfig, ssrSWLoaderConfig]

if (analyzeBundle) {
    console.info('Analyzing build...')
    configs.forEach(
        (config) => {
            config.plugins = config.plugins.concat([
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: true
                })
            ])
        }
    )
}

module.exports = configs
