/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */

const webpack = require('webpack')
const path = require('path')
const baseCommon = require('./base.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const NonPWAConst = require('progressive-web-sdk/dist/non-pwa/messaging/constants').default

const webPackageJson = require('../package.json')

module.exports = {
    devtool: 'source-map',
    entry: {
        'non-pwa': './non-pwa/non-pwa.js',
        'non-pwa-ask': path.resolve(process.cwd(), 'non-pwa', NonPWAConst.ASK_SCRIPT)
    },
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader?cacheDirectory'
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {
                    loader: 'html-loader'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            MESSAGING_ENABLED: `${webPackageJson.messagingEnabled}`,
            // These are defined as string constants
            MESSAGING_SITE_ID: `'${webPackageJson.messagingSiteId}'`,
            PROJECT_SLUG: `'${webPackageJson.projectSlug}'`,
            AJS_SLUG: `'${webPackageJson.aJSSlug}'`
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: baseCommon.postcss
            }
        })
    ]
}
