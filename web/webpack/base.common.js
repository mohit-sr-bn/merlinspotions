/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/no-commonjs */
/* eslint-env node */

const WebpackNotifierPlugin = require('webpack-notifier')
const packageConfig = require('../package.json')

module.exports = {
    plugins: [
        // Enable desktop notifications when the build succeeds or fails
        new WebpackNotifierPlugin({
            title: `Mobify Project: ${packageConfig.name}`,
            excludeWarnings: true,
            skipFirstNotification: true
        }),
    ],
    devServer: {
        compress: true
    }
}
