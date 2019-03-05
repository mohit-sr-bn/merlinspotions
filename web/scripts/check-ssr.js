/* eslint import/no-commonjs:0 */

const webPackageJSON = require('../package.json')
const ssrEnabled = (
    process.env.SSR_ENABLED ||
    (webPackageJSON.mobify && webPackageJSON.mobify.ssrEnabled)
)

console.log(
    `SSR ${ssrEnabled ? 'enabled' : 'disabled'} in package.json`
)

process.exit(ssrEnabled ? 0 : 1)

