/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {
    getLocale,
    getTranslations
} from '../../containers/app/selectors'

// `react-intl` is the default library for i18n (Internationalize) and l10n
// (Localization). If you're project does not need these libraries, you may
// simply comment out or delete these lines.
import {
    IntlProvider as ReactIntlProvider,
    FormattedMessage as ReactFormattedMessage,
    FormattedNumber as ReactFormattedNumber,
    addLocaleData,
    injectIntl
} from 'react-intl'
import en from 'react-intl/locale-data/en'
import ja from 'react-intl/locale-data/ja'

import {getSelectedCurrency} from 'progressive-web-sdk/dist/store/app/selectors'

const UNDEFINED = 'undefined'

const MISSING_INTL_CONTEXT_ERROR = `\n` +
    `Could not find required \`intl\` object. ` +
    `Make sure \`<ProxyIntlProvider>\` wraps your application.`

const CURRENCY_SYMBOLS = {
    GBP: '£',
    JPY: '¥',
    USD: '$',
}



/**
 * FormattedText
 *
 * This is a proxy component for `react-intl`'s component of the same name. This
 * is designed to work when the library is in use, but if the library is absent
 * then it will directy access the store and render the translations as
 * a fallback.
 */

const FormattedText = ({messageId, translations, config = {}}, context) => {
    if (typeof context.intl === UNDEFINED) {
        throw new Error(MISSING_INTL_CONTEXT_ERROR)
    }

    if (typeof ReactFormattedMessage !== UNDEFINED) {
        return <ReactFormattedMessage id={messageId} {...config} />
    }

    // In the circumstance where no third party number formatting component is
    // available, fallback to the following:
    return translations
        ? <span>{translations[messageId]}</span>
        : <span>{messageId}</span>
}

FormattedText.propTypes = {
    messageId: PropTypes.string.isRequired,
    config: PropTypes.object,
    translations: PropTypes.object
}

FormattedText.contextTypes = {
    intl: PropTypes.object
}

const WrappedFormattedText = connect(
    createPropsSelector({translations: getTranslations})
)(FormattedText)



/**
 * FormattedPrice
 *
 * This is a proxy component for `react-intl`'s component of the same name. This
 * is designed to work when the library is in use, but if the library is absent
 * then it will directly access the store and render the price as a fallback.
 */

const FormattedPrice = ({value, currency}, context) => {
    if (typeof context.intl === UNDEFINED) {
        throw new Error(MISSING_INTL_CONTEXT_ERROR)
    }

    if (typeof ReactFormattedNumber !== UNDEFINED) {
        const currencyCode = currency.code || 'USD'
        return (
            <span itemProp="price">
                <ReactFormattedNumber
                    currency={currencyCode}
                    value={value}
                    style="currency"
                />
                <meta itemProp="priceCurrency" content={currencyCode} />
            </span>
        )
    }

    // In the circumstance where no third party number formatting component is
    // available, fallback to the following:
    return <span>{currency.symbol}{value}</span>
}

FormattedPrice.propTypes = {
    value: PropTypes.string.isRequired,
    currency: PropTypes.object // @TODO: use object shape
}

FormattedPrice.contextTypes = {
    intl: PropTypes.object
}

const WrappedFormattedPrice = connect(
    createPropsSelector({currency: getSelectedCurrency})
)(FormattedPrice)



/**
 * formatNumber checks for the `context.intl` object (see `/web/app/components/intl/index.jsx`).
 * If the object isn't present, error out and report what's wrong.
 *
 * @param context {object} expects the context object from the parent scope.
 * @param value {string} expects the numerical value to be formatted.
 * @param options {object} Optional – expects a list of options to be passed
 * down to the formatNumber function.
 */

const formatNumber = (context, value, options) => {
    if (typeof context.intl === UNDEFINED) {
        throw new Error(MISSING_INTL_CONTEXT_ERROR)
    }

    return context.intl.formatNumber(value, options)
}



/**
 * formatMessage checks for the `context.intl` object (see `/web/app/components/intl/index.jsx`).
 * If the object isn't present, error out and report what's wrong.
 *
 * @param context {object} expects the context object from the parent scope.
 * @param messageId {string} expects the numerical value to be formatted.
 * @param translations {}
 * @param options {object} Optional – expects a list of options to be passed
 * down to the formatMessage function.
 */

const formatMessage = (context, messageId, translations, config) => {
    if (typeof context.intl === UNDEFINED) {
        throw new Error(MISSING_INTL_CONTEXT_ERROR)
    }

    return context.intl.formatMessage(messageId, translations, config)
}



/**
 * IntlContext
 *
 * This component serves two purposes: 1) to proxy the use of `react-intl`'s
 * `injectIntl()` function, and 2) give its children access to an `intl` object
 * via context that is itself a proxy of `react-intl`'s `intl` object.
 *
 * If the `react-intl` library is removed, then this component will skip
 * wrapping its children in `injectIntl()`, but will still provide an
 * `intl` object.
 */

class IntlContext extends React.Component {
    getChildContext() {
        const intl = this.props.intl || {}

        /**
         * formatMessage
         *
         * This is a proxy function for `react-intl`'s function of the same name. This
         * is designed to work when the library is in use, and to simply pass its props
         * through when the library is absent.
         *
         * This function is only meant to be used from the `context.intl` object, added
         * via this IntlContext component.
         */

        const formatMessage = (intl) => {
            if ('formatMessage' in intl) {
                return intl.formatMessage
            }

            return (message) => {
                return message.defaultMessage || message.id
            }
        }

        /**
         * formatNumber
         *
         * This is a proxy function for `react-intl`'s function of the same name. This
         * is designed to work when the library is in use, and to simply pass its props
         * through when the library is absent.
         *
         * This function is only meant to be used from the `context.intl` object, added
         * via this IntlContext component.
         */

        const formatNumber = (intl) => {
            if ('formatNumber' in intl) {
                return intl.formatNumber
            }

            return (value, options) => {
                if (options.style !== 'currency') {
                    throw new Error(
                        '`formatNumber` only supports the `currency` style. ' +
                        'To support more styles, you will need to modify and extend ' +
                        'the `formatNumber` function in /web/components/intl/index.jsx'
                    )
                }

                const symbol = CURRENCY_SYMBOLS[options.currency] || CURRENCY_SYMBOLS.USD
                return `${symbol}${value}`
            }
        }

        return {
            intl: {
                ...intl,
                formatMessage: formatMessage(intl),
                formatNumber: formatNumber(intl),
            }
        }
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

IntlContext.propTypes = {
    children: PropTypes.node,
    intl: PropTypes.object
}

IntlContext.childContextTypes = {
    intl: PropTypes.object
}

const proxyInjectIntl = (component) => {
    if (typeof injectIntl !== UNDEFINED) {
        return injectIntl(component)
    }

    return component
}

const ConnectedIntlContext = proxyInjectIntl(IntlContext)



/**
 * ProxyIntlProvider
 *
 * This is a proxy component for `react-intl`'s `IntlProvider` component of the
 * same name. This is designed to work when the library is in use, but if the
 * library is absent then it will skip adding any kind of provider, but still
 * use the `ConnectedIntlContext` component to give its children access to the
 * `intl` object via context.
 *
 * @TODO: This component will need to be refactored to take swappable
 * "Providers". Doing so will allow us to A) easily swap in different providers
 * for different libraries, and B) swap in a stub provider if no i18n/l10n is
 * needed in the first place.
 */

class ProxyIntlProvider extends React.Component {
    componentWillMount() {
        if (typeof addLocaleData !== UNDEFINED) {
            addLocaleData([...en, ...ja])
        }
    }

    render() {
        // If no library is being used for localization, just allow children to
        // pass through as is.
        if (typeof ReactIntlProvider !== UNDEFINED) {
            return (
                <ReactIntlProvider
                    locale={this.props.locale}
                    messages={this.props.messages}
                >
                    <ConnectedIntlContext>
                        {this.props.children}
                    </ConnectedIntlContext>
                </ReactIntlProvider>
            )
        }

        return (
            <ConnectedIntlContext>
                {this.props.children}
            </ConnectedIntlContext>
        )
    }
}

ProxyIntlProvider.propTypes = {
    children: PropTypes.node,
    locale: PropTypes.string,
    messages: PropTypes.object
}

const WrappedIntlProvider = connect(
    createPropsSelector({locale: getLocale, messages: getTranslations})
)(ProxyIntlProvider)



/**
 * Final Exports
 */

export {
    WrappedIntlProvider as ProxyIntlProvider,
    WrappedFormattedText as FormattedText,
    WrappedFormattedPrice as FormattedPrice,
    formatNumber,
    formatMessage,
}
