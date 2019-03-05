/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */

const glob = require('glob')
const path = require('path')
const baseCommon = require('./base.common')

const entryPoints = {}

glob.sync('./app/config/translations/*.js').forEach((filePath) => {
    const localeMatch = filePath.match(/\/([^/]+)\.js/)
    if (localeMatch) {
        entryPoints[localeMatch[1]] = filePath
    }
})

module.exports = {
    devtool: 'source-map',
    entry: entryPoints,
    output: {
        path: path.resolve(process.cwd(), 'build/translations'),
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
            }
        ],
    },
    plugins: [
        ...baseCommon.plugins,
    ]
}
