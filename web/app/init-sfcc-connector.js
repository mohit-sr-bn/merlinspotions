/* global DEBUG */

import {Connector} from 'mobify-integration-manager/dist/connectors/sfcc'
import IntegrationManager from 'mobify-integration-manager/dist/'

import SFCCMapper from './config/sfcc/url'
import urlMapper from './config/url-mapper'

import extension from './connector-extension/sfcc-connector/'

const initConnector = () => {
    urlMapper.initialize(SFCCMapper, {
        baseUrl: '/s/2017refresh'
    })
    IntegrationManager.initialize(
        Connector({
            siteID: '2017refresh',
            clientID: '5640cc6b-f5e9-466e-9134-9853e9f9db93'
        }),
        extension,
        {
            name: 'sfcc',
            debug: DEBUG,
            paymentRequestEnabled: true
        }
    )
}

export default initConnector
