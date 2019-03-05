/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IM from 'mobify-integration-manager/dist/'

import {Connector} from 'mobify-integration-manager/dist/connectors/sfcc'
import ampPackageJson from '../../../package.json'

import SFCCMapper from 'web/app/config/sfcc/url.js'
import urlMapper from 'web/app/config/url-mapper'

export const initConnector = (config) => {
    urlMapper.initialize(SFCCMapper, {
        baseUrl: 'https://mobify-tech-prtnr-na03-dw.demandware.net/s/2017refresh'
    })

    IM.initialize(Connector({
        siteBaseURL: ampPackageJson.siteUrl,
        features: {
            shouldBridgeDesktopSession: false
        },
        ...config
    }))
    return Promise.resolve()
}
