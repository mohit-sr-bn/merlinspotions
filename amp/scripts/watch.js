#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const spawn = require('child_process').spawn;
const config = require('../webpack.config')

const compiler = webpack(config);
const watchConfig = {
    aggregateTimeout: 300
};

let serverProcess;

/**
 * Start Webpack's watch process and start the AMP server in a subprocess
 * on successful compile.
 */
compiler.watch(watchConfig, (err, stats) => {

    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
        info.errors.forEach(message => console.log(message));
        return;
    }

    if (stats.hasWarnings()) {
        info.warnings.forEach(message => console.log(message));
    }

    if (serverProcess) {
        console.log('\nRestarting AMP server...');
        serverProcess.kill();
    } else {
        console.log('\nStarting AMP server...');
    }

    const args = [path.resolve(__dirname, '..', 'build', 'main.js')];

    process.env.NODE_ENV === 'debug' && args.unshift('--inspect');

    serverProcess = spawn('node', args, {stdio: 'inherit'});
});
