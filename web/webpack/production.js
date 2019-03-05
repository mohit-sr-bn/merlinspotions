/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */
/* eslint-env node */

const webpack = require('webpack')
const assign = require('lodash.assign')

// Set the NODE_ENV variable before requiring in configs that test it
process.env.NODE_ENV = 'production'

const baseLoaderConfig = require('./base.loader')
const baseMainConfig = require('./base.main')
const workerConfig = require('./base.worker')
const nonPWAConfig = require('./base.non-pwa')
const translationsConfig = require('./base.translations')
const webPackageJson = require('../package.json') // eslint-disable-line import/no-extraneous-dependencies
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ssrConfigs = require('./base.ssr')

const cssLoader = [
    MiniCssExtractPlugin.loader,
    {
        loader: 'css-loader?-autoprefixer',
        options: {
            // Don't use css-loader's automatic URL transforms
            url: false,
            minimize: true
        }
    },
    // Manually specify the path to the postcss config
    // so that we can use one single file for all webpack configs that use it
    {
        loader: 'postcss-loader',
        options: {
            config: {
                path: '../web/webpack/postcss.config.js'
            }
        }
    },
    'sass-loader'
]

// Add production flag to main app config
const productionMainConfig = assign(baseMainConfig, {
    // Extend base config with production settings here
    plugins: [].concat(baseMainConfig.plugins, [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        })
    ])
})

// Handle loading and transforming PWA scss files
productionMainConfig.module.rules = productionMainConfig.module.rules.concat({
    test: /\.scss$/,
    loader: cssLoader,
    include: [
        /progressive-web-sdk/,
        /app/
    ]
})

// Handle loading and transforming non-PWA scss files
nonPWAConfig.module.rules = nonPWAConfig.module.rules.concat({
    test: /\.scss$/,
    loader: cssLoader,
    include: [
        /node_modules\/progressive-web-sdk/,
        /app/,
        /non-pwa/
    ]
})

let configs = [productionMainConfig, baseLoaderConfig, workerConfig, nonPWAConfig, translationsConfig]

if (
    process.env.SSR_ENABLED ||
    (webPackageJson.mobify && webPackageJson.mobify.ssrEnabled)
) {
    configs = configs.concat(ssrConfigs)
}

// Apply shared settings to all configs.
configs.forEach((config) => {
    config.mode = 'production'
    config.cache = true
    config.devtool = 'source-map'

    config.plugins = config.plugins || []
    config.plugins.push(
        new webpack.DefinePlugin({
            DEBUG: false
        })
    )

    const optimization = config.optimization = config.optimization || {}

    // Despite the name 'minimizer', the value is an array of minimizers
    const minimizers = optimization.minimizer = optimization.minimizer || []

    // Some configs already have a UglifyJSPlug configured. If we find one,
    // we just modify its configuration. If we don't find one, we add it.
    const uglifyer = minimizers.find(
        (minimizer) => minimizer instanceof UglifyJSPlugin
    )

    if (uglifyer) {
        uglifyer.options.cache = true
        uglifyer.options.parallel = true
        uglifyer.options.sourceMap = true
    } else {
        minimizers.push(
            new UglifyJSPlugin(
                {
                    // Cache uglified files
                    cache: true,
                    // Run in parallel (all availables CPUs - 1)
                    parallel: true,
                    // Support source maps
                    sourceMap: true
                }
            )
        )
    }
})

module.exports = configs
