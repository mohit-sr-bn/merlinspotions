/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */
/* eslint-env node */

const path = require('path')
const webpack = require('webpack')
const baseCommon = require('./base.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webPackageJson = require('../package.json')   // eslint-disable-line import/no-extraneous-dependencies
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: './app/native/onboarding/onboarding.jsx',
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: 'onboarding.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader?cacheDirectory'
                }
            },
            {
                test: /\.css?$/,
                exclude: /node_modules/,
                use: 'postcss-loader',
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader?url=false!sass-loader'
            },
            {
                test: /\.svg$/,
                use: 'text-loader'
            }
        ],
    },
    plugins: [
        ...baseCommon.plugins,
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: baseCommon.postcss
            }
        }),
        new HtmlWebpackPlugin({
            template: './app/native/onboarding/index.html'
        }),
        new webpack.DefinePlugin({
            // This is defined as a boolean, not a string
            MESSAGING_ENABLED: `${webPackageJson.messagingEnabled}`,
            AJS_SLUG: `'${webPackageJson.aJSSlug}'`,
            WEBPACK_MOBIFY_GA_ID: `'${webPackageJson.mobifyGAID}'`,
            DEBUG: !isProd
        })
    ]
}
