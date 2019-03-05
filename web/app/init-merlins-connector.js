/* global DEBUG */

import {Connector} from './connectors/_merlins-connector'
import IntegrationManager from 'mobify-integration-manager/dist/'
import {jqueryResponse} from 'progressive-web-sdk/dist/jquery-response'

import MerlinMapper from './config/merlins/url'
import urlMapper from './config/url-mapper'

import extension from './connector-extension/merlins-connector'


const initConnector = () => {
    urlMapper.initialize(MerlinMapper)

    const connector = Connector({
        features: {
            jqueryResponse
        }
    })
    IntegrationManager.initialize(
        connector,
        extension,
        {
            name: 'merlins',
            debug: DEBUG,
            paymentRequestEnabled: true
        }
    )
}

export default initConnector
