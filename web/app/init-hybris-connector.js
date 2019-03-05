/* global DEBUG */

import {Connector} from 'mobify-integration-manager/dist/connectors/hybris'
import IntegrationManager from 'mobify-integration-manager/dist/'

import extension from './connector-extension/hybris-connector/'

import HybrisMapper from './config/hybris/url'
import urlMapper from './config/url-mapper'

// HYBRIS CONNECTOR CONFIG
//
// menuConfig: On Hybris, navigation menus are configured under the CMS module, which is not available
// through OCC web services. Only the Categories endpoint is available, which returns a category tree
// as it's been stored on the database starting from the category requested. The menuConfig property
// allows to define which categories will populate the first level of the navigation menu, as well as
// if they should be grouped on a single node (displayAsNode: true) or if the children of the
// selected category should be used as nodes (displayAsNode: false)
//
// regions: OCC does not expose the available regions per delivery country, therefore, this
// property allows hard-coding this values to be available on the client

const initConnector = () => {
    console.log('[IntegrationManager.hybris-connector] Registering Hybris connector')
    urlMapper.initialize(HybrisMapper)
    IntegrationManager.initialize(Connector({
        api: {
            host: '',
            type: 'rest',
            version: 'v2'
        },
        auth: {
            anonymous: {
                clientId: 'client-side',
                clientSecret: 'secret'
            },
            customer: {
                clientId: 'mobile_android',
                clientSecret: 'secret'
            }
        },
        baseSiteId: 'apparel-uk',
        catalogId: {
            electronics: 'electronicsProductCatalog',
            'apparel-uk': 'apparelProductCatalog'
        },
        catalogVersionId: 'Online',
        defaultCurrencyCode: 'USD',
        menuConfig: {
            'apparel-uk': [
                {
                    id: 'categories',
                    displayAsNode: false
                },
                {
                    id: 'collections',
                    displayAsNode: true,
                },
                {
                    id: 'brands',
                    displayAsNode: true
                }
            ]
        },
        variants: {
            'apparel-uk': {
                primary: {
                    type: 'ApparelStyleVariantProduct',
                    qualifier: 'style'
                },
                secondary: {
                    type: 'ApparelSizeVariantProduct',
                    qualifier: 'size'
                }
            },
            electronics: {
                primary: {
                    type: 'ElectronicsColorVariantProduct',
                    qualifier: 'color'
                },
            }
        },
        imagesSizes: {
            product: 'product',
            thumbnail: 'thumbnail',
            zoom: 'zoom',
        },
        imagesTypes: {
            gallery: 'GALLERY',
            primary: 'PRIMARY',
        },
        regions: {
            'apparel-uk': [
                {
                    label: 'Kent',
                    id: 'GB-KEN',
                    countryId: 'GB'
                }
            ],
            electronics: []
        }
    }), extension, {
        name: 'hybris',
        debug: DEBUG
    })
}

export default initConnector
