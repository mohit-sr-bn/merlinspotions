const chalk = require('chalk');

exports.info = (m) => console.log(m)

exports.success = (m) => console.log(chalk.green(m))

exports.error = (m) => console.error(chalk.red(m))

exports.step = (m) => console.error(chalk.cyan("[step] " + m))
