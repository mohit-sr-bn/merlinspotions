/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable no-unused-vars */

import {receiveCategoryContents, receiveCategoryInformation} from 'mobify-integration-manager/dist/integration-manager/api/categories/results'
import {receiveProductListProductData} from 'mobify-integration-manager/dist/integration-manager/api/products/results'

import {urlToPathKey} from 'progressive-web-sdk/dist/utils/utils'

export const getCategory = (id, opts) => (dispatch) => {
    console.log('[Stub Connector] Called getCategory stub')

    dispatch(receiveCategoryInformation('newarrivals', {
        id: 'newarrivals',
        title: 'New Arrivals',
        href: 'newarrivals.html',
        pageMeta: {
            title: 'Women and Mens New Arrivals in Clothing, Jewelry, Accessories & More',
            description: 'Shop all new arrivals including women and mens clothing, jewelry, accessories, suits & more at Salesforce Commerce Cloud',
            keywords: undefined
        },
        parentId: null
    }))

    return Promise.resolve()
}
