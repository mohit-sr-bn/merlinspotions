import React from 'react'
import {Provider} from 'react-redux'
import {ProxyIntlProvider} from '../components/intl/index'

/*
 * Wrap Provider and IntlProvider to component so it can access to store for i18n
 */

export const wrapProviderIntlProvider = (component, store) => {
    const createStore = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => store
    }

    return (
        <Provider store={createStore}>
            <ProxyIntlProvider>
                {component}
            </ProxyIntlProvider>
        </Provider>
    )
}

/*
 * Wrap IntlProvider to component for i18n
 */

export const wrapIntlProvider = (component) => (
    <ProxyIntlProvider>
        {component}
    </ProxyIntlProvider>
)


/*
 * Wrap Provider for testing
 */

export const wrapProvider = (component, store) => {
    const createStore = {
        subscribe: () => {},
        dispatch: () => {},
        getState: () => store
    }

    return (
        <Provider store={createStore}>
            {component}
        </Provider>
    )
}


/**
 * Context Helper for i18n
 *
 * This helper is meant to help create a mock context for components used in
 * Enzyme's shallow() function. Specifically, mocking the i18n/l10n context
 * provided by ProxyIntlProvider.
 *
 * Usage example:
 *
 *     shallow(<Template route={route} />, intlContext)
 */

export const intlContext = {
    context: {
        intl: {}
    }
}


/**
 * Currency Object
 */

export const currencyObject = {
    label: 'Dollar',
    code: 'USD',
    symbol: '$',
}
