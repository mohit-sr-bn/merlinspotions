/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */
const fs = require('fs')
const webpack = require('webpack')

const loaderConfig = require('./base.loader')
const mainConfig = require('./base.main')
const workerConfig = require('./base.worker')
const nonPWAConfig = require('./base.non-pwa')
const ssrConfigs = require('./base.ssr')
const translationsConfig = require('./base.translations')
const webPackageJson = require('../package.json') // eslint-disable-line import/no-extraneous-dependencies

const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

/*
 * Use UglifyJS to do tree-shaking and drop dead code. We don't want to
 * do complete uglification; that makes debugging more difficult.
 */
const uglifyPluginOptions = {
    cache: true,
    parallel: true,
    uglifyOptions: {
        ie8: false,
        mangle: false,
        warnings: false,
        compress: {
            // These options configure dead-code removal
            dead_code: true,
            unused: true,

            // These options configure uglification. For development,
            // we don't uglify completely.
            booleans: false,
            collapse_vars: false,
            comparisons: false,
            conditionals: false,
            drop_debugger: false,
            evaluate: false,
            if_return: false,
            join_vars: true,
            keep_fnames: true,
            loops: false,
            properties: true,
            reduce_vars: false,
            sequences: false
        }
    },
    // This is necessary to get maps with the Uglify plugin
    sourceMap: true
}
const uglifyJSPlugin = new UglifyJsPlugin(uglifyPluginOptions)

/*
 * Produce compressed (gzipped) versions of assets so that the development
 * (preview) server can serve them. Production doesn't need this, because
 * the CDN handles it.
 */
const compressionPluginOptions = {
    algorithm: 'gzip',
    test: /\.(js|html|css)$/,
    threshold: 2048,
    minRatio: 0.8
}

const cssLoader = [
    MiniCssExtractPlugin.loader,
    {
        loader: 'css-loader?-autoprefixer',
        options: {
            // Don't use css-loader's automatic URL transforms
            url: false
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

// Handle loading and transforming PWA scss files
mainConfig.module.rules = mainConfig.module.rules.concat({
    test: /\.scss$/,
    loader: cssLoader,
    include: [
        /node_modules\/progressive-web-sdk/,
        /app/
    ]
})

mainConfig.plugins = mainConfig.plugins.concat([
    new webpack.NoEmitOnErrorsPlugin()
])

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

/**
 * Watcher plugin function. Add this function (by name, not as a call)
 * to every config that is built. It will track builds, and touch the file
 * BUILD_MARKER when all builds are complete.
 *
 * The "before-compile", "after-compile" and "done" hooks fire once for
 * every config processed by webpack, so it's not simple to detect when all
 * builds are done. This watcher will track the number of builds started, and
 * will touch the file only when all have completed.
 */
let buildingCount = 0
const BUILD_MARKER = 'build/build.marker'
const watcherPlugin = function() {
    this.plugin(
        'before-compile',
        (watching, callback) => {
            buildingCount += 1
            callback()
        }
    )

    this.plugin(
        'after-compile',
        (watching, callback) => {
            buildingCount -= 1
            callback()
        }
    )

    this.plugin(
        'done',
        (watching, callback) => {
            if (buildingCount <= 0) {
                console.log('All builds complete')
                fs.closeSync(fs.openSync(BUILD_MARKER, 'w'))
            }

            callback()
        }
    )
}

let configs = [mainConfig, loaderConfig, workerConfig, nonPWAConfig, translationsConfig]

if (
    process.env.SSR_ENABLED ||
    (webPackageJson.mobify && webPackageJson.mobify.ssrEnabled)
) {
    configs = configs.concat(ssrConfigs)
}

// Apply shared settings to all configs
configs.forEach((config) => {
    config.mode = 'development'
    config.devtool = (process.env.DEVTOOL || 'cheap-module-eval-source-map')
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            DEBUG: true
        }),
        new CompressionPlugin(compressionPluginOptions)
    ])

    // We override any existing minimizer configuration
    config.optimization = config.optimization || {}
    config.optimization.minimizer = [uglifyJSPlugin]
})

// Adding the watcherPlugin confuses the dev-server in webpack,
// so we only add it if asked to.
if (process.env.TOUCH_BUILD_MARKER) {
    configs.forEach((config) => {
        config.plugins = config.plugins.concat([watcherPlugin])
    })
}

module.exports = configs
