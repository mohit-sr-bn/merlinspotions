/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/**
 * Runs Lighthouse against a config file of URLS located in `tests/performance/
 * lighthouse/lighthouse-urls.json`
 * Use by `npm run test:lighthouse <environment> <preview>
 *
 * `npm run test:lighthouse staging preview` to run Lighthouse against staging
 * URLs with Mobify Preview
 * `npm run test:lighthouse` to run it against production and without Mobify
 * Preview
 */

/* eslint-disable import/no-commonjs*/
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const chalk = require('chalk')

/* eslint-disable no-undef */
const configFile = path.resolve(__dirname, 'lighthouse-urls.json')
const environment = process.argv[2] || 'production'
const isPreview = process.argv[3] || 'false'
console.log(`npm run test:lighthouse "${configFile}" "${environment}" "${isPreview}"`)

const execPromise = function(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                return reject(err)
            }
            return resolve(stdout, stderr)
        })
    })
}

const runLighthouse = function(env, isPreview) {
    let arg = 'prod'
    if (isPreview === 'preview') {
        arg = 'preview'
    }
    const commands = []
    for (const page in env) {
        if (env.hasOwnProperty(page)) {
            console.log(`npm run test:pwa-${arg} ${env[page]} ${page}`)
            commands.push(`npm run test:pwa-${arg} ${env[page]} ${page}`)
        }
    }
    /* Reduces each element in the commands array to reduce it to a single stdout*/
    commands.reduce((p, cmd) => {
        return p.then((results) => {
            return execPromise(cmd).then((stdout) => {
                results.push(stdout)
                return results
            })
        })
    }, Promise.resolve([])).then((results) => {
        let failure = false
        results.forEach((output) => {
            const errorString = 'Error'
            if (output.includes(errorString)) {
                console.log(chalk.red(output))
                failure = true
            } else {
                console.log(output)
            }
        })
        if (failure === true) {
            console.log(chalk.red('Lighthouse Test Failed'))
            process.exit(1)
        } else {
            console.log(chalk.green('Lighthouse Test Passed'))
        }
    }, (err) => {
        console.error(`exec error: ${err}`)
        process.exit(1)
    })
}

const runParseUrls = function(configJson, environment, isPreview) {
    try {
        let config = []
        config = JSON.parse(fs.readFileSync(configJson, 'utf8'))
        let env
        if (environment === 'production') {
            console.log(`Running Lighthouse against ${environment} list of Urls.`)
            env = config.production
        } else {
            console.log('Running Lighthouse against Staging list of Urls.')
            env = config.staging
        }
        runLighthouse(env, isPreview)
    } catch (e) {
        console.log(e)
        console.log(`Could not read JSON file at ${configJson}`)
        console.log(`Please check if configuration file is present at /web/tests/performance/lighthouse/lighthouse-url.json`)
    }
}

runParseUrls(configFile, environment, isPreview)
