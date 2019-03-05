/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* global DEBUG */

import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {waitForResolves} from 'react-redux-resolve'
import thunk from 'redux-thunk'
import {fromJS} from 'immutable'

// DO NOT USE! Merlins Connector is an example connector that is for demo only
import {initConnector} from './connectors/merlins-connector'
// import {initConnector} from './connectors/sfcc-connector'
// import {initConnector} from './connectors/stub-connector'

import {reducer as imReducer} from 'mobify-integration-manager/dist/integration-manager/reducer'
import {CURRENT_URL} from 'progressive-web-sdk/dist/store/app/constants'

import appReducer from './app-reducer'
import footerReducer from 'web/app/containers/footer/reducer'
import homeReducer from 'web/app/containers/home/reducer'
import navigationReducer from 'web/app/modals/navigation/reducer'
import productListReducer from 'web/app/containers/product-list/reducer'
import productDetailsReducer from './product-details-reducer'
import categoryReducer from 'mobify-integration-manager/dist/store/categories/reducer'
import productReducer from 'mobify-integration-manager/dist/store/products/reducer'
import productSearchReducer from 'mobify-integration-manager/dist/store/product-searches/reducer'

let storeSnapshotMiddleware
if (DEBUG) {
    storeSnapshotMiddleware = require('./store-snapshot').middleware
}

import {PAGE_TITLE} from './constants'

export const initializeStore = (fullUrl, containers) => {
    return initConnector({
        siteID: '2017refresh', // for SFCC Connector
        clientID: '5640cc6b-f5e9-466e-9134-9853e9f9db93' // for SFCC Connector
    }).then(() => {

        const uiReducer = combineReducers({
            footer: footerReducer,
            home: homeReducer,
            navigation: navigationReducer,
            productDetails: productDetailsReducer,
            productList: productListReducer
        })

        const reducer = combineReducers({
            app: appReducer,
            categories: categoryReducer,
            ui: uiReducer,
            products: productReducer,
            productSearches: productSearchReducer,
            integrationManager: imReducer
        })

        const middlewares = [
            thunk,
        ]

        if (DEBUG) {
            middlewares.push(storeSnapshotMiddleware)
        }

        const noop = (f) => f

        const initialState = ({
            app: fromJS({
                [CURRENT_URL]: fullUrl,
                [PAGE_TITLE]: 'Merlins AMP' // Fetch the page again and get title?
            })
        })

        const createdStore = createStore(reducer, initialState, compose(applyMiddleware(...middlewares), noop))

        const renderProps = {
            location: {},
            components: containers,
            history: {}
        }

        return waitForResolves(renderProps, createdStore)
        .then(() => {
            return createdStore
        })
    })
}
