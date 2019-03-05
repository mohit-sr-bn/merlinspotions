/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const reportsPath = process.env.CIRCLE_TEST_REPORTS || './tests/reports'
const screenshotsPath = process.env.CIRCLE_ARTIFACTS || './tests/screenshots'

const notificationSettings = {
    ALLOW: 1,
    BLOCK: 2
}

// User agent for Google's main crawler, Googlebot
// https://support.google.com/webmasters/answer/1061943?hl=en
const googlebotUserAgent = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

require('babel-core/register')

module.exports = {
    src_folders: ['./tests/e2e'],
    output_folder: reportsPath,
    custom_commands_path: './node_modules/nightwatch-commands/commands',
    custom_assertions_path: './node_modules/nightwatch-commands/assertions',
    selenium: {
        start_process: true,
        server_path: './node_modules/nightwatch-commands/selenium/selenium-server.jar',
        log_path: './node_modules/nightwatch-commands/selenium/',
        cli_args: {
            'webdriver.chrome.driver': './node_modules/nightwatch-commands/selenium/drivers/chromedriver'
        }
    },

    test_settings: {
        default: {
            globals: {
                waitForConditionTimeout: 5000,
                waitForConditionPollInterval: 100,
            },
            end_session_on_fail: false,
            silent: true,
            output: true,
            exclude: ['page-objects', 'sauce-connect', 'test-scripts'],
            screenshots: {
                enabled: true,
                path: screenshotsPath,
                on_failure: true,
            },
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    args: [
                        /**
                         * To facilitate testing of Push notifications, we need
                         * a user agent that is supported. Unfortunately, Selenium
                         * doesn't seem to have any emulated mobile devices that
                         * we support.
                         */
                        '--user-agent="Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Mobile Safari/537.36"',
                        'window-size=320,850',
                        '--allow-running-insecure-content',
                        '--test-type'
                    ],
                    // Allow browser push notifications
                    prefs: {
                        'profile.default_content_setting_values.notifications': notificationSettings.ALLOW
                    }
                },
                javascriptEnabled: true,
                acceptSslCerts: true,
            }
        },
        chrome_incognito: {
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    args: [
                        '--user-agent="Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Mobile Safari/537.36"',
                        'window-size=320,850',
                        '--allow-running-insecure-content',
                        '--test-type',
                        '--incognito'
                    ],
                    // Allow browser push notifications
                    prefs: {
                        'profile.default_content_setting_values.notifications': notificationSettings.ALLOW
                    }
                },
                javascriptEnabled: true,
                acceptSslCerts: true,
            }
        },
        // Emulate Googlebot
        chrome_googlebot: {
            selenium: {
                cli_args: {
                    'webdriver.chrome.driver': '/usr/local/bin/chromedriver-googlebot'
                }
            },
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    binary: '/usr/local/bin/chrome-googlebot/chrome',
                    args: [
                        `--user-agent=${googlebotUserAgent}`,
                        '--allow-running-insecure-content',
                        '--test-type',
                        '--no-sandbox'
                    ],
                    mobileEmulation: {deviceName: 'Apple iPhone 6'}
                },
                javascriptEnabled: true,
                acceptSslCerts: true,
            }
        },
        // To be run with Appium.
        // Run the simulator beforehand and accept the certificate
        safari: {
            automationName: 'XCUITest',
            exclude: ['page-objects', 'test-scripts', '**/push-subscribe.js'],
            selenium_start_process: false,
            selenium_port: 4723,
            selenium_host: '0.0.0.0',
            desiredCapabilities: {
                app: '',
                browserName: 'Safari',
                platformName: 'iOS',
                platformVersion: '11.2',
                deviceName: 'iPhone 6s',
                useNewWDA: 'false',
                xcodeOrgId: 'KS9S3B73SG',
                xcodeSigningId: 'iPhone Developer',
                javascriptEnabled: true
            }
        },
        saucelabs_ios: {
            selenium_start_process: false,
            selenium_port: 4445,
            selenium_host: 'localhost',
            silent: true,
            exclude: ['page-objects', 'test-scripts', '**/push-subscribe.js'],
            username: process.env.SAUCE_USERNAME,
            access_key: process.env.SAUCE_ACCESS_KEY,
            desiredCapabilities: {
                browserName: 'Safari',
                appiumVersion: '1.7.2',
                deviceName: 'iPhone 7 Simulator',
                platformVersion: '11.2',
                platformName: 'iOS'
            }
        },
        saucelabs_android: {
            selenium_start_process: false,
            selenium_port: 4445,
            selenium_host: 'localhost',
            silent: true,
            username: process.env.SAUCE_USERNAME,
            access_key: process.env.SAUCE_ACCESS_KEY,
            desiredCapabilities: {
                browserName: 'Chrome',
                appiumVersion: '1.7.2',
                deviceName: 'Google Pixel GoogleAPI Emulator',
                platformVersion: '7.0',
                platformName: 'Android'
            }
        }
    }
}
