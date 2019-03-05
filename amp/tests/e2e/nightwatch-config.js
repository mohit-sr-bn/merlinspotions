/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

var reportsPath = process.env.CIRCLE_TEST_REPORTS || './tests/reports';
var screenshotsPath = process.env.CIRCLE_ARTIFACTS || './tests/screenshots';

require('babel-core/register');

module.exports = {
    'src_folders': ['./tests/e2e'],
    'output_folder': reportsPath,
    'custom_commands_path': './node_modules/nightwatch-commands/commands',
    'custom_assertions_path': './node_modules/nightwatch-commands/assertions',
    'selenium': {
        'start_process': true,
        'server_path': './node_modules/nightwatch-commands/selenium/selenium-server.jar',
        'log_path': './node_modules/nightwatch-commands/selenium/',
        'cli_args': {
            'webdriver.chrome.driver': './node_modules/nightwatch-commands/selenium/drivers/chromedriver'
        }
    },

    'test_settings': {
        'default': {
            'globals' : {
                'waitForConditionTimeout' : 5000,
                'waitForConditionPollInterval': 100
            },
            'end_session_on_fail': false,
            'silent': true,
            'output': true,
            'exclude': ['page-objects'],
            'screenshots': {
                'enabled': true,
                'path': screenshotsPath,
                'on_failure': true,
            },
            'desiredCapabilities': {
                'browserName': 'chrome',
                'chromeOptions': {
                    'mobileEmulation': {
                        'deviceName': 'iPhone 6'
                    },
                    'args': [
                        '--allow-running-insecure-content',
                        '--test-type'
                    ],
                },
                'javascriptEnabled': true,
                'acceptSslCerts': true
            }
        }
    }
};
