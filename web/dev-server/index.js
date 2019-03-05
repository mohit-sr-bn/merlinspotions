/* eslint-disable import/no-commonjs */
/* eslint-env node */

const fs = require('fs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../webpack/dev.js')

const logger = require('./logger')

const argv = require('minimist')(process.argv.slice(2))
const port = argv.port || process.env.PORT || 8443

const compiler = webpack(config)

const localhostKeyAndCert = fs.readFileSync('./dev-server/localhost.pem')

const server = new WebpackDevServer(compiler, { // eslint-disable-line no-unused-vars
    headers: {
        // The Mobify CDN has this response header, and we need it for certain
        // CORS fetches
        'Access-Control-Allow-Origin': '*'
    },
    https: {
        cert: localhostKeyAndCert,
        key: localhostKeyAndCert,
    },
    stats: {
        // Configures logging: https://webpack.js.org/configuration/stats/
        assets: false,
        builtAt: false,
        chunks: true,
        chunkModules: false,
        chunkOrigins: false,
        colors: true,
        depth: false,
        entrypoints: false,
        hash: false,
        modules: false,
        timings: false,
        version: false,
    },
    compress: true
})

server.listen(port, 'localhost', (err) => { // eslint-disable-line consistent-return
    if (err) {
        return logger.error(err.message)
    }

    logger.appStarted(port)
    logger.waitForBuild()
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        logger.inUse(port)
        process.exit()
    }
    return logger.error(error.message)
})
