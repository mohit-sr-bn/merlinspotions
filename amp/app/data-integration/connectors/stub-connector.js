/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Promise from 'bluebird'
import _jsdom from 'jsdom'
import fs from 'fs'

import IM from 'mobify-integration-manager/dist/'

import {Connector} from 'web/app/connectors/stub-connector'

import {jqueryResponse} from '../capturejs'

import StubMapper from 'web/app/config/stub/url.js'
import urlMapper from 'web/app/config/url-mapper'

const jsdom = Promise.promisifyAll(_jsdom)

const jqueryDir = process.env.NODE_ENV === 'production' ? '.' : './app/vendor'
const jquery = fs.readFileSync(`${jqueryDir}/jquery.min.js`, 'utf-8')

export const jsdomEnv = () => jsdom.envAsync('', [], {src: jquery})

export const initConnector = (config) => {
    urlMapper.initialize(StubMapper)

    return jsdomEnv().then((window) => {
        IM.initialize(Connector({
            features: {
                jqueryResponse: jqueryResponse(window)
            },
            ...config
        }))
    })
}
