/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import Immutable from 'immutable'

import rootReducer from '../containers/reducers'
import userReducer from 'mobify-integration-manager/dist/store/user/reducer'
import cartReducer from 'mobify-integration-manager/dist/store/cart/reducer'
import categoryReducer from 'mobify-integration-manager/dist/store/categories/reducer'
import modalReducer from 'progressive-web-sdk/dist/store/modals/reducer'
import notificationsReducer from 'progressive-web-sdk/dist/store/notifications/reducer'
import pushMessagingReducer from 'progressive-web-sdk/dist/store/push-messaging/reducer'
import productReducer from 'mobify-integration-manager/dist/store/products/reducer'
import productSearchesReducer from 'mobify-integration-manager/dist/store/product-searches/reducer'
import offlineReducer from 'progressive-web-sdk/dist/store/offline/reducer'
import checkoutReducer from 'mobify-integration-manager/dist/store/checkout/reducer'
import appReducer from 'progressive-web-sdk/dist/store/app/reducer'
import {reducer as imReducer} from 'mobify-integration-manager/dist/integration-manager/reducer'
import {reducer as formReducer} from 'redux-form'

import analytics from 'redux-analytics'
import analyticsManager from 'progressive-web-sdk/dist/analytics/analytics-manager'
import {ReduxFormPluginOption} from 'progressive-web-sdk/dist/analytics/actions'
import addToHomescreenReducer from 'progressive-web-sdk/dist/store/add-to-homescreen/reducer'

if (!window.Progressive.isServerSide) {
    analyticsManager.init({
        projectSlug: AJS_SLUG,              // eslint-disable-line no-undef
        mobifyGAID: WEBPACK_MOBIFY_GA_ID,   // eslint-disable-line no-undef
        ecommerceLibrary: 'ec',
        debug: DEBUG                        // eslint-disable-line no-undef
    })
}

/**
 * Wrap redux-form's default reducer with ours which adds
 * analytics tracking to all forms.
 */
const trackingFormReducer = (state, action) => {
    const reducer = (action.meta && action.meta.form) ?
        formReducer.plugin({
            [action.meta.form]: (state, action) => ReduxFormPluginOption.all(state, action)
        }) : formReducer
    return reducer(state, action)
}


const configureStore = (initialState) => {
    const middlewares = [
        thunk
    ]
    if (!window.Progressive.isServerSide) {
        middlewares.push(analytics(({type, payload}, state) => analyticsManager.distribute(type, payload, state)))
    }
    const reducer = combineReducers({
        addToHomescreen: addToHomescreenReducer,
        app: appReducer,
        categories: categoryReducer,
        cart: cartReducer,
        ui: rootReducer,
        user: userReducer,
        modals: modalReducer,
        notifications: notificationsReducer,
        products: productReducer,
        productSearches: productSearchesReducer,
        checkout: checkoutReducer,
        offline: offlineReducer,
        integrationManager: imReducer,
        form: trackingFormReducer,
        pushMessaging: pushMessagingReducer
    })

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              serialize: {
                  immutable: Immutable
              }
          })
          : compose

    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(...middlewares))
    )

    return store
}

export default configureStore
