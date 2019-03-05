import {Connector} from './connectors/stub-connector'
import IntegrationManager from 'mobify-integration-manager/dist/'

import {jqueryResponse} from 'progressive-web-sdk/dist/jquery-response'

import extension from './connector-extension/stub-connector/'

import StubMapper from './config/stub/url'
import urlMapper from './config/url-mapper'

const initConnector = () => {

    urlMapper.initialize(StubMapper)

    IntegrationManager.initialize(
        Connector({
            features: {
                jqueryResponse
            }
        }),
        extension,
        {
            name: 'stub'
        }
    )
}

export default initConnector
