#!/usr/bin/env node

/**
 * Builds a standalone bundle of the app suitable for deployment,
 * including production dependencies.
 */
const Promise = require('bluebird')
const git = require('git-rev-sync')
const path = require('path')
const process = require('process')
const execSync = require('child_process').execSync
const common = require('./common')
const rimraf = Promise.promisify(require('rimraf'))
const fs = Promise.promisifyAll(require('fs'))
const ncp = Promise.promisify(require('ncp').ncp)
const archiver = require('archiver')

const ampRootDir = path.resolve(path.join(__dirname), '..')
const buildDir = path.join(ampRootDir, 'build')

const staticInDir = path.join(ampRootDir, 'app', 'static')

const {info, success, error} = common


const webpack = (outputDir) => execSync(
    `./node_modules/.bin/webpack --mode production --output-path ${outputDir}`, {cwd: ampRootDir, stdio: 'inherit'}
)

const installDependencies = (outputDir) => execSync(
    'npm install --only production', {cwd: outputDir, stdio: 'inherit'}
)

const createBundleMetaFile = (outputDir) => {
    const hash = git.short()
    const branch = git.branch()
    fs.writeFileSync(path.join(outputDir, '.meta'), `${hash}-${branch}:`)
}

const main = () => {
    Promise.resolve()
        .then(() => {
            const commitId = git.long()
            const outputDir = path.join(buildDir, commitId)
            const outputZip = `${outputDir}.zip`
            const staticOutDir = path.join(outputDir, 'static')
            const serverOutDir = path.join(outputDir, 'server')
            const serverOutDirScripts = path.join(serverOutDir, 'scripts')

            return Promise.resolve()
                .tap(() => info('Cleaning build directory'))
                .then(() => rimraf(buildDir))

                .tap(() => info('Creating directories'))
                .then(() => fs.mkdirAsync(buildDir))
                .then(() => fs.mkdirAsync(outputDir))
                .then(() => fs.mkdirAsync(serverOutDir))
                .then(() => fs.mkdirAsync(serverOutDirScripts))

                .tap(() => info('Copying static assets'))
                .then(() => ncp(staticInDir, staticOutDir))

                .tap(() => info('Installing dependencies'))
                .then(() => ncp(path.join(ampRootDir, 'package.json'), path.join(serverOutDir, 'package.json')))
                .then(() => ncp(path.join(ampRootDir, '/scripts/preinstall.js'), path.join(serverOutDirScripts, 'preinstall.js')))
                .then(() => installDependencies(serverOutDir))
                .then(() => rimraf(serverOutDirScripts))

                .tap(() => info('Building app'))
                .then(() => webpack(serverOutDir))
                .then(() => ncp(path.join(ampRootDir, 'app/vendor/jquery.min.js'), path.join(serverOutDir, 'jquery.min.js')))

                .tap(() => info('Archiving'))
                .then(() => new Promise((resolve) => {
                    const output = fs.createWriteStream(outputZip)
                    const archive = archiver('zip', {zlib: {level: 9}})

                    output.on('close', resolve)

                    archive.pipe(output)
                    archive.append(null, {name: `${commitId}/`})  // Cloud expects an entry for the directory
                    archive.directory(outputDir, commitId)
                    archive.finalize()
                }))

                .tap(() => info('Cleaning up'))
                .then(() => rimraf(outputDir))

                .tap(() => info('Creating build meta file'))
                .then(() => createBundleMetaFile(buildDir))

                .tap(() => success(`Built version '${commitId}' successfully`))
        })
        .catch((err) => {
            error(err)
            process.exit(1)
        })
}

if (require.main === module) {
    main()
}
