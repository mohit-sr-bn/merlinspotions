/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {LATEST_SEARCH_PARAMS as SFCC_LATEST_SEARCH_PARAMS} from '../../config/sfcc/constants'
import {LATEST_SEARCH_PARAMS as HYBRIS_LATEST_SEARCH_PARAMS} from '../../config/hybris/constants'
import {LATEST_SEARCH_PARAMS as MERLINS_LATEST_SEARCH_PARAMS} from '../../config/merlins/constants'
import {LATEST_SEARCH_PARAMS as STUB_LATEST_SEARCH_PARAMS} from '../../config/stub/constants'

export const getHeroProductsSearchParams = () => {
    const connectorSearchParamConstants = {
        sfcc: SFCC_LATEST_SEARCH_PARAMS,
        merlins: MERLINS_LATEST_SEARCH_PARAMS,
        hybris: HYBRIS_LATEST_SEARCH_PARAMS,
        stub: STUB_LATEST_SEARCH_PARAMS
    }

    return connectorSearchParamConstants[IntegrationManager.getOption('name')]
}
