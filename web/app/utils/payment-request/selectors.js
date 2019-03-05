/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import {
    getDiscount,
    getShippingAmount,
    getTax,
    getOrderTotal,
    getSubtotal
} from 'progressive-web-sdk/dist/store/cart/selectors'
import {getShippingMethods} from 'progressive-web-sdk/dist/store/checkout/selectors'

import {getTranslations} from '../../containers/app/selectors'
import {getSelectedShippingMethodValue, getAddressLineOne} from '../../store/checkout/shipping/selectors'
import {getSelectedCurrency} from 'progressive-web-sdk/dist/store/app/selectors'

export const getCurrencyCode = createGetSelector(getSelectedCurrency, 'code', 'USD')

const getDisplayItem = (label, value, currency) => ({
    label,
    amount: {
        currency,
        value
    }
})

const getDisplayItems = createSelector(
    getSubtotal,
    getDiscount,
    getShippingAmount,
    getTax,
    getCurrencyCode,
    getTranslations,
    (subtotal, discount, shippingAmount, tax, currencyCode, translations) => {
        const displayItems = []

        const subtotalLabel = translations.get('checkoutPayment.ledger.subtotalWithoutCount')
        const subtotalDisplayItem = getDisplayItem(subtotalLabel, subtotal, currencyCode)
        displayItems.push(subtotalDisplayItem)

        // Discount is a string
        if (discount && parseFloat(discount) > 0) {
            const discountsLabel = translations.get('checkoutPayment.ledger.discounts')
            // Make sure we're always showing a negative value for the discount
            const discountValue = Math.abs(parseFloat(discount))
            const discountDisplayItem = getDisplayItem(discountsLabel, -discountValue, currencyCode)
            displayItems.push(discountDisplayItem)
        }

        if (shippingAmount) {
            const shippingLabel = translations.get('checkoutPayment.ledger.shippingWithoutLabel')
            const shippingDisplayItem = getDisplayItem(shippingLabel, shippingAmount, currencyCode)
            displayItems.push(shippingDisplayItem)
        }

        if (tax) {
            const taxesLabel = translations.get('checkoutPayment.ledger.taxes')
            const taxDisplayItem = getDisplayItem(taxesLabel, tax, currencyCode)
            displayItems.push(taxDisplayItem)
        }

        return displayItems
    }
)

const getShippingOptions = createSelector(
    getShippingMethods,
    getSelectedShippingMethodValue,
    getCurrencyCode,
    getAddressLineOne,
    (shippingMethods, shippingMethodID, currencyCode, addressLineOne) => {
        // We need to select an address before selecting a shipping option
        // Otherwise, the Payment Request sheet acts a little weird
        // It will appear as though the user has selected an address
        // but that address won't be returned in the shippingoptionchange event
        // By not selecting an option, we force the user to always select an address
        const shouldSelectOption = !!addressLineOne

        const shippingOptions = shippingMethods.toJS().map((method) => {
            const {
                cost,
                id,
                label
            } = method

            return ({
                id,
                label,
                amount: {
                    currency: currencyCode,
                    value: cost
                },
                selected: shouldSelectOption && shippingMethodID === id
            })
        })

        return shippingOptions
    }
)

const getTotal = createSelector(
    getOrderTotal,
    getCurrencyCode,
    getTranslations,
    (totalValue, currencyCode, translations) => {
        const totalLabel = translations.get('checkoutPayment.ledger.total')
        return getDisplayItem(totalLabel, totalValue, currencyCode)
    }
)

export const getPaymentDetails = createSelector(
    getDisplayItems,
    getShippingOptions,
    getTotal,
    (displayItems, shippingOptions, total) => ({
        displayItems,
        shippingOptions,
        total
    })
)
