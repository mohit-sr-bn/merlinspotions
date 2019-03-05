#!/usr/bin/env node
const childProcess = require('child_process')

const main = () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Installing /web:')
        process.chdir('../web')

        // This is a bit more convoluted than just forking `npm i`
        // But it ensures that we use whatever package manager
        // is currently managing the installation in the /amp folder
        // Eg. if you `yarn install` in /amp, we'll `yarn install` in /web
        childProcess.execSync(
            '"' + process.env.NODE + '" "' + process.env.npm_execpath + '" install',
            {stdio: 'inherit'}
        )
        process.chdir('../amp')
    }
    console.log('Installing /amp:')
}

if (require.main === module) {
    main()
}
